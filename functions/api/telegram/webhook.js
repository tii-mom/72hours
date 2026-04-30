import { getPresaleRuntime, formatPresaleStatus } from "../../_shared/presale-runtime.js";
import { getPresaleRuntimeWithChain } from "../../_shared/presale-chain.js";
import {
  analyzeSalesSignal,
  formatOperatorAlertLines,
  salesSignalRecordFields,
  shouldAlertOperator,
} from "../../_shared/sales-signals.js";
import { recordSalesEvent } from "../../_shared/sales-storage.js";
import { createTelegramApi } from "../../_shared/telegram-api.js";
import { verifyTelegramWebhookSecret } from "../../_shared/telegram-security.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function safeText(value, maxLength = 320) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function commandFromText(text) {
  const normalized = safeText(text);
  if (!normalized.startsWith("/")) return undefined;
  return normalized.split(/\s+/)[0].split("@")[0].toLowerCase();
}

function getUserLabel(user) {
  if (!user) return "unknown";
  const username = safeText(user.username, 64);
  const name = [safeText(user.first_name, 64), safeText(user.last_name, 64)].filter(Boolean).join(" ");
  return username ? `@${username}` : name || String(user.id || "unknown");
}

function isAdmin(user, env) {
  const raw = typeof env.H72H_TELEGRAM_ADMIN_IDS === "string" ? env.H72H_TELEGRAM_ADMIN_IDS : "";
  if (!raw || !user?.id) return false;
  const allowed = raw
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return allowed.includes(String(user.id));
}

function classifySalesIntent(text) {
  return analyzeSalesSignal(text).primaryIntent;
}

function mainKeyboard(runtime) {
  const keyboard = [
    [{ text: "预约白名单登记", callback_data: "command:buy" }],
    [
      { text: "链上状态", callback_data: "command:status" },
      { text: "计划阶段规则", callback_data: "signal:price" },
    ],
    [
      { text: "安全与合约", callback_data: "signal:risk" },
      { text: "人工跟进", callback_data: "command:human" },
    ],
  ];

  if (runtime.miniAppUrl?.startsWith("https://")) {
    keyboard[0] = [{ text: "打开 72H 白名单登记", web_app: { url: runtime.miniAppUrl } }];
  }

  return { inline_keyboard: keyboard };
}

function buyKeyboard(runtime) {
  const keyboard = [];

  if (runtime.miniAppUrl?.startsWith("https://")) {
    keyboard.push([{ text: "打开 Mini App 登记白名单", web_app: { url: runtime.miniAppUrl } }]);
  }

  keyboard.push([
    { text: "查看链上状态", callback_data: "command:status" },
    { text: "需要人工跟进", callback_data: "command:human" },
  ]);

  return { inline_keyboard: keyboard };
}

async function recordSalesSignal(env, event) {
  try {
    await recordSalesEvent(env, event);
  } catch (error) {
    console.error("telegram_sales_signal_record_failed", error instanceof Error ? error.message : String(error));
  }
}

async function safeSend(api, payload) {
  try {
    await api.sendMessage(payload);
  } catch (error) {
    console.error("telegram_send_failed", error instanceof Error ? error.message : String(error));
  }
}

async function safeAnswerCallback(api, payload) {
  try {
    await api.answerCallbackQuery(payload);
  } catch (error) {
    console.error("telegram_callback_answer_failed", error instanceof Error ? error.message : String(error));
  }
}

async function alertHumanSupport(api, env, context) {
  const alertChatId = typeof env.H72H_TELEGRAM_ALERT_CHAT_ID === "string" ? env.H72H_TELEGRAM_ALERT_CHAT_ID.trim() : "";
  if (!alertChatId) return;

  const signal = context.signal || analyzeSalesSignal(context.text, { primaryIntent: context.signalType });
  const text = formatOperatorAlertLines({
    title: "72H 高优先级人工跟进",
    userLabel: getUserLabel(context.user),
    userId: context.user?.id,
    chatId: context.chatId,
    signal,
    text: context.text,
  }).join("\n");

  await safeSend(api, {
    chatId: alertChatId,
    text,
  });
}

async function alertSalesSignal(api, env, context) {
  const alertChatId = typeof env.H72H_TELEGRAM_ALERT_CHAT_ID === "string" ? env.H72H_TELEGRAM_ALERT_CHAT_ID.trim() : "";
  if (!alertChatId) return;

  await safeSend(api, {
    chatId: alertChatId,
    text: formatOperatorAlertLines({
      title: "72H 高意向销售信号",
      userLabel: getUserLabel(context.user),
      userId: context.user?.id,
      chatId: context.chatId,
      signal: context.signal,
      text: context.text,
    }).join("\n"),
  });
}

async function sendStart(api, chatId, runtime) {
  await safeSend(api, {
    chatId,
    text: [
      "72H Early Access / 预售预约助手",
      "",
      "当前是 warmup / waitlist 阶段：预售预约、白名单登记、10,000,000 72H 抽奖资格、开售提醒、社群任务和用户分层。",
      "",
      "禁止真实购买、付款、签名、手工转账或链上额度承诺；现在只记录链下预约。",
      "",
      "安全提醒：不要发送助记词、私钥、验证码或资金截图。",
    ].join("\n"),
    replyMarkup: mainKeyboard(runtime),
  });
}

async function sendBuy(api, chatId, runtime) {
  const lines = [
    "72H Early Access 白名单预约",
    "",
    "正式开放时间：2026-05-05 17:00（Asia/Shanghai）。现在只可登记 waitlist / 白名单、开售提醒和社群任务状态，不会生成交易。",
    "",
    "预约成功可获得 72H 代币奖励资格，并进入 10,000,000 72H 抽奖奖池。奖池由官方/私人奖池钱包注入，开奖后通过钱包转账发放；不新增领奖合约。Bot 不会根据聊天内容生成交易，也不会要求你付款、签名或私下转账。",
  ];

  await safeSend(api, {
    chatId,
    text: lines.join("\n"),
    replyMarkup: buyKeyboard(runtime),
  });
}

async function sendHelp(api, chatId, runtime) {
  await safeSend(api, {
    chatId,
    text: [
      "72H 预售助手说明",
      "",
      "聊天只用于理解意图和人工跟进。",
      "当前不开放真实购买、付款或签名；正式开放后也只认官方 Mini App 公告路径。",
      "预约不等于链上额度或购买证明，不认截图或口头承诺。",
      "",
      runtime.enabled
        ? "当前状态：仍以 Mini App 白名单预约与链上证据展示为准。"
        : "当前状态：真实购买关闭，Mini App 只做白名单预约与状态展示。",
    ].join("\n"),
    replyMarkup: mainKeyboard(runtime),
  });
}

async function sendStatus(api, env, chatId, runtime) {
  const statusRuntime = await getPresaleRuntimeWithChain(env, { runtime });
  await safeSend(api, {
    chatId,
    text: formatPresaleStatus(statusRuntime),
    replyMarkup: mainKeyboard(runtime),
  });
}

async function sendHuman(api, env, chatId, user, text, signalType = "human_support") {
  const signal = analyzeSalesSignal(text, { primaryIntent: signalType });
  await recordSalesSignal(env, {
    signalType,
    chatId,
    telegramUserId: user?.id,
    username: user?.username,
    isAdmin: isAdmin(user, env),
    text: safeText(text),
    ...salesSignalRecordFields(signal),
  });

  await safeSend(api, {
    chatId,
    text: [
      "已通知人工运营",
      "",
      "请简单回复你的问题或预计参与区间。不要发送助记词、私钥、验证码或资金截图。",
    ].join("\n"),
    replyMarkup: mainKeyboard(getPresaleRuntime(env)),
  });

  await alertHumanSupport(api, env, {
    chatId,
    user,
    text,
    signalType,
    signal,
  });
}

async function respondToSignal(api, env, chatId, user, text, runtime, signalType) {
  const signal = analyzeSalesSignal(text, { primaryIntent: signalType });
  await recordSalesSignal(env, {
    signalType,
    chatId,
    telegramUserId: user?.id,
    username: user?.username,
    languageCode: user?.language_code,
    isAdmin: isAdmin(user, env),
    text: safeText(text),
    presaleEnabled: runtime.enabled,
    ...salesSignalRecordFields(signal),
  });

  if (shouldAlertOperator(signal) && signal.primaryIntent !== "human_support") {
    await alertSalesSignal(api, env, {
      chatId,
      user,
      text,
      signal,
    });
  }

  switch (signalType) {
    case "buy_intent":
      await sendBuy(api, chatId, runtime);
      return;
    case "wallet_help":
      await safeSend(api, {
        chatId,
        text: [
          "钱包连接说明",
          "",
          "当前只从官方 Mini App 做白名单登记与状态核对；不需要付款、签名、手工转账，也不要把助记词、私钥或验证码发给任何人。",
          "",
          runtime.miniAppUrl ? "点击下方按钮打开白名单登记界面。" : "Mini App URL 尚未配置。",
        ].join("\n"),
        replyMarkup: mainKeyboard(runtime),
      });
      return;
    case "price_question":
      await safeSend(api, {
        chatId,
        text: [
          "72H 计划阶段规则（当前不可购买）",
          "",
          "Stage 0: 1 TON = 10,072 72H",
          "Stage 1: 1 TON = 7,200 72H",
          "Stage 2: 1 TON = 3,500 72H",
          "",
          "每阶段额度：1,500,000,000 72H",
          "总预售额度：4,500,000,000 72H",
          "单钱包上限：7,200,000 72H",
          "",
          "以上仅为开售前规则核对；当前不开放真实购买、付款或签名，不承诺链上额度。",
        ].join("\n"),
        replyMarkup: mainKeyboard(runtime),
      });
      return;
    case "risk_question":
      await safeSend(api, {
        chatId,
        text: [
          "安全与合约核验",
          "",
          `PresaleVault: ${runtime.presaleVaultAddress}`,
          `72H Jetton Master: ${runtime.jettonMasterAddress}`,
          "",
          "当前不开放真实购买、付款或签名。只认官方合约地址和官方公告；截图、私聊承诺和用户自报 hash 都不能作为预约、额度或购买证明。",
        ].join("\n"),
        replyMarkup: mainKeyboard(runtime),
      });
      return;
    case "referral_question":
      await safeSend(api, {
        chatId,
        text: [
          "已记录来源/推荐信号。",
          "",
          "你可以直接回复 KOL、邀请人或渠道名称，运营会在跟进时参考。",
        ].join("\n"),
        replyMarkup: mainKeyboard(runtime),
      });
      return;
    case "human_support":
      await sendHuman(api, env, chatId, user, text, signalType);
      return;
    default:
      await safeSend(api, {
        chatId,
        text: [
          "我已记录你的问题。",
          "",
          "如果你想预约白名单、查看计划规则、核验合约或联系人工，可以点下方按钮。",
        ].join("\n"),
        replyMarkup: mainKeyboard(runtime),
      });
  }
}

async function handleCommand(api, env, chatId, user, text, runtime, command) {
  await recordSalesSignal(env, {
    signalType: "command",
    command,
    chatId,
    telegramUserId: user?.id,
    username: user?.username,
    isAdmin: isAdmin(user, env),
    presaleEnabled: runtime.enabled,
  });

  switch (command) {
    case "/start":
      await sendStart(api, chatId, runtime);
      return;
    case "/buy":
      await sendBuy(api, chatId, runtime);
      return;
    case "/status":
      await sendStatus(api, env, chatId, runtime);
      return;
    case "/help":
      await sendHelp(api, chatId, runtime);
      return;
    case "/human":
      await sendHuman(api, env, chatId, user, text);
      return;
    default:
      await safeSend(api, {
        chatId,
        text: "暂不支持这个命令。可以使用 /start、/buy、/status、/help 或 /human。",
        replyMarkup: mainKeyboard(runtime),
      });
  }
}

async function handleMessage(api, env, update, runtime) {
  const message = update.message || update.edited_message;
  const chatId = message?.chat?.id;
  const user = message?.from;
  const text = safeText(message?.text || message?.caption || "");

  if (!chatId) {
    return;
  }

  const command = commandFromText(text);
  if (command) {
    await handleCommand(api, env, chatId, user, text, runtime, command);
    return;
  }

  const signalType = classifySalesIntent(text);
  await respondToSignal(api, env, chatId, user, text, runtime, signalType);
}

async function handleCallbackQuery(api, env, update, runtime) {
  const callbackQuery = update.callback_query;
  const callbackQueryId = callbackQuery?.id;
  const chatId = callbackQuery?.message?.chat?.id;
  const user = callbackQuery?.from;
  const data = safeText(callbackQuery?.data || "");

  if (callbackQueryId) {
    await safeAnswerCallback(api, {
      callbackQueryId,
      text: "已收到",
    });
  }

  if (!chatId) return;

  switch (data) {
    case "command:buy":
      await handleCommand(api, env, chatId, user, "/buy", runtime, "/buy");
      return;
    case "command:status":
      await handleCommand(api, env, chatId, user, "/status", runtime, "/status");
      return;
    case "command:help":
      await handleCommand(api, env, chatId, user, "/help", runtime, "/help");
      return;
    case "command:human":
      await handleCommand(api, env, chatId, user, "/human", runtime, "/human");
      return;
    case "signal:price":
      await respondToSignal(api, env, chatId, user, "price", runtime, "price_question");
      return;
    case "signal:risk":
      await respondToSignal(api, env, chatId, user, "risk", runtime, "risk_question");
      return;
    default:
      await recordSalesSignal(env, {
        signalType: "callback_unknown",
        callbackData: data,
        chatId,
        telegramUserId: user?.id,
        username: user?.username,
      });
  }
}

export function onRequestGet() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}

export async function onRequestPost({ request, env }) {
  if (!verifyTelegramWebhookSecret(request, env)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  let update;
  try {
    update = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const api = createTelegramApi(env);
  const runtime = getPresaleRuntime(env);

  try {
    if (update.callback_query) {
      await handleCallbackQuery(api, env, update, runtime);
    } else {
      await handleMessage(api, env, update, runtime);
    }
  } catch (error) {
    console.error("telegram_webhook_update_failed", error instanceof Error ? error.message : String(error));
  }

  return json({ ok: true });
}
