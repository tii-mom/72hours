#!/usr/bin/env node

function env(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function callTelegram(token, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => undefined);
  if (!response.ok || body?.ok === false) {
    fail(body?.description || `Telegram ${method} failed with HTTP ${response.status}.`);
  }

  return body;
}

async function main() {
  const token = env("H72H_TELEGRAM_BOT_TOKEN");
  const miniAppUrl = env("H72H_BOT_MINIAPP_URL");

  if (!token) fail("H72H_TELEGRAM_BOT_TOKEN is required.");
  if (!miniAppUrl) fail("H72H_BOT_MINIAPP_URL is required.");

  await callTelegram(token, "setMyCommands", {
    commands: [
      { command: "start", description: "打开 72H 早期预约助手" },
      { command: "buy", description: "立即预约（不购买、不付款）" },
      { command: "codes", description: "查看抽奖码说明" },
      { command: "invite", description: "查看邀请好友说明" },
      { command: "share", description: "查看社群分享任务" },
      { command: "status", description: "查看预约阶段状态" },
      { command: "help", description: "了解预约与防钓鱼规则" },
      { command: "human", description: "请求人工跟进" },
    ],
  });

  await callTelegram(token, "setChatMenuButton", {
    menu_button: {
      type: "web_app",
      text: "72H 早期预约",
      web_app: {
        url: miniAppUrl,
      },
    },
  });

  console.log("Telegram bot commands and menu button configured.");
}

await main();
