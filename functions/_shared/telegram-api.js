const TELEGRAM_API_BASE_URL = "https://api.telegram.org";

function requireBotToken(env) {
  const token = typeof env.H72H_TELEGRAM_BOT_TOKEN === "string" ? env.H72H_TELEGRAM_BOT_TOKEN.trim() : "";

  if (!token) {
    throw new Error("H72H_TELEGRAM_BOT_TOKEN is not configured.");
  }

  return token;
}

async function postTelegramMethod(env, method, payload, fetchImpl = fetch) {
  const token = requireBotToken(env);
  const response = await fetchImpl(`${TELEGRAM_API_BASE_URL}/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  let body;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  if (!response.ok || body?.ok === false) {
    const description = body?.description || `Telegram ${method} failed with HTTP ${response.status}.`;
    throw new Error(description);
  }

  return body;
}

export function createTelegramApi(env, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  return {
    sendMessage({
      chatId,
      text,
      replyMarkup,
      disableWebPagePreview = true,
      parseMode,
    }) {
      const payload = {
        chat_id: chatId,
        text,
        disable_web_page_preview: disableWebPagePreview,
      };

      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }

      if (parseMode) {
        payload.parse_mode = parseMode;
      }

      return postTelegramMethod(env, "sendMessage", payload, fetchImpl);
    },

    answerCallbackQuery({
      callbackQueryId,
      text,
      showAlert = false,
    }) {
      return postTelegramMethod(
        env,
        "answerCallbackQuery",
        {
          callback_query_id: callbackQueryId,
          text,
          show_alert: showAlert,
        },
        fetchImpl,
      );
    },
  };
}
