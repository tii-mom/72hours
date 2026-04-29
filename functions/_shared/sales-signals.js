function safeText(value, maxLength = 800) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function testAny(value, patterns) {
  return patterns.some((pattern) => pattern.test(value));
}

function parseNumber(value) {
  const normalized = String(value || "").replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function extractTonAmount(text) {
  const value = safeText(text).toLowerCase();
  const tonMatch = value.match(/(?:买|购买|认购|投|准备|want|buy|purchase|allocate)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:ton|吨)\b/i);
  if (tonMatch) return parseNumber(tonMatch[1]);

  const chineseMatch = value.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:个)?\s*(?:ton|吨)/i);
  if (chineseMatch) return parseNumber(chineseMatch[1]);

  return undefined;
}

function amountBand(amountTon) {
  if (amountTon === undefined) return "unknown";
  if (amountTon >= 100) return "whale";
  if (amountTon >= 20) return "high";
  if (amountTon >= 5) return "medium";
  return "low";
}

function inferIntent(value, amountTon) {
  if (testAny(value, [/(人工|客服|真人|联系|私聊|support|human|operator|agent|help me|call)/i])) {
    return "human_support";
  }
  const hasBuyIntent = testAny(value, [/(买|购买|认购|预售|参与|入金|打款|转账|buy|purchase|presale|want in|join|allocate|额度|名额)/i]);
  if (hasBuyIntent && amountTon !== undefined) return "buy_intent";
  if (testAny(value, [/(钱包|连接|地址|tonkeeper|tonhub|wallet|tonconnect|connect|disconnect|打不开|无法连接)/i])) {
    return "wallet_help";
  }
  if (testAny(value, [/(价格|阶段|多少钱|汇率|单价|price|rate|stage|1\s*ton|ton\s*=|cost)/i])) {
    return "price_question";
  }
  if (testAny(value, [/(风险|安全|审计|跑路|骗局|骗子|合约|验证|risk|safe|audit|scam|rug|contract|verify|真假|官方)/i])) {
    return "risk_question";
  }
  if (testAny(value, [/(推荐|邀请|返佣|kol|渠道|来源|referral|refer|invite|commission|source|群主|博主)/i])) {
    return "referral_question";
  }
  if (hasBuyIntent) {
    return "buy_intent";
  }
  return "unknown";
}

function inferObjections(value) {
  const objections = [];
  if (testAny(value, [/(风险|安全|审计|跑路|骗局|骗子|rug|scam|audit|safe|真假|官方)/i])) {
    objections.push("trust_or_contract_safety");
  }
  if (testAny(value, [/(钱包|tonkeeper|tonhub|wallet|tonconnect|连接|打不开|不会用)/i])) {
    objections.push("wallet_or_connection");
  }
  if (testAny(value, [/(贵|便宜|价格|阶段|多少钱|汇率|price|rate|stage|cost)/i])) {
    objections.push("price_or_stage");
  }
  if (testAny(value, [/(什么时候|开放|开始|结束|多久|today|now|when|open|live)/i])) {
    objections.push("timing");
  }
  if (testAny(value, [/(kol|推荐|邀请|返佣|渠道|来源|referral|invite|commission|群主|博主)/i])) {
    objections.push("source_or_referral");
  }
  return objections;
}

function inferUrgency(value) {
  if (testAny(value, [/(现在|马上|立即|今天|尽快|now|today|asap|right now)/i])) return "now";
  if (testAny(value, [/(明天|这周|soon|later|tomorrow|week)/i])) return "soon";
  return "unknown";
}

function inferSourceHint(value) {
  const match = value.match(/(?:kol|推荐人|邀请人|来源|渠道|from|source)\s*[:：]?\s*([@\w\u4e00-\u9fa5.-]{2,40})/i);
  return match?.[1];
}

function inferIntentStrength({ primaryIntent, amountTon, objections, urgency }) {
  if (primaryIntent === "human_support") return "high";
  if (primaryIntent === "buy_intent" && amountTon !== undefined && amountTon >= 20) return "high";
  if (primaryIntent === "buy_intent" && urgency === "now") return "high";
  if (primaryIntent === "buy_intent") return "medium";
  if (primaryIntent === "risk_question" && objections.includes("trust_or_contract_safety")) return "medium";
  if (primaryIntent === "wallet_help") return "medium";
  return "low";
}

function followUpPriority({ primaryIntent, intentStrength, amountTon, objections }) {
  if (intentStrength === "high") return "high";
  if (amountTon !== undefined && amountTon >= 20) return "high";
  if (primaryIntent === "human_support") return "high";
  if (objections.includes("wallet_or_connection") || objections.includes("trust_or_contract_safety")) return "medium";
  if (primaryIntent === "buy_intent") return "medium";
  return "normal";
}

function operatorSuggestion(signal) {
  if (signal.primaryIntent === "buy_intent" && signal.amountTon !== undefined) {
    return `先确认 ${signal.amountTon} TON 是否为计划购买金额，再提醒真实购买只走官方 Mini App + TonConnect。`;
  }
  if (signal.primaryIntent === "buy_intent") {
    return "先确认计划购买金额区间、钱包是否已准备好，再引导打开预售界面。";
  }
  if (signal.primaryIntent === "wallet_help") {
    return "优先确认用户使用的钱包类型和连接报错，不要索要助记词、私钥或验证码。";
  }
  if (signal.primaryIntent === "risk_question") {
    return "先发官方 PresaleVault 和 Jetton Master 地址，再说明截图和私聊承诺不能作为购买证明。";
  }
  if (signal.primaryIntent === "referral_question") {
    return "记录 KOL/渠道来源，确认是否需要人工标记来源标签。";
  }
  if (signal.primaryIntent === "human_support") {
    return "尽快人工回复，先问问题类型和计划金额区间。";
  }
  return "询问用户是想购买、查价格、核验合约还是需要人工跟进。";
}

function confidenceFor(primaryIntent, text) {
  if (primaryIntent === "unknown") return "low";
  if (safeText(text).length >= 8) return "high";
  return "medium";
}

export function analyzeSalesSignal(text, context = {}) {
  const cleaned = safeText(text);
  const value = cleaned.toLowerCase();
  const amountTon = extractTonAmount(cleaned);
  const primaryIntent = context.primaryIntent || inferIntent(value, amountTon);
  const objections = inferObjections(value);
  const urgency = inferUrgency(value);
  const signal = {
    primaryIntent,
    confidence: confidenceFor(primaryIntent, cleaned),
    intentStrength: "low",
    followUpPriority: "normal",
    amountTon,
    amountBand: amountBand(amountTon),
    objections,
    urgency,
    sourceHint: inferSourceHint(cleaned),
    text: cleaned,
  };

  signal.intentStrength = inferIntentStrength({
    primaryIntent: signal.primaryIntent,
    amountTon: signal.amountTon,
    objections: signal.objections,
    urgency: signal.urgency,
  });
  signal.followUpPriority = followUpPriority(signal);
  signal.operatorSuggestion = operatorSuggestion(signal);

  return signal;
}

export function salesSignalRecordFields(signal) {
  return {
    primaryIntent: signal.primaryIntent,
    confidence: signal.confidence,
    intentStrength: signal.intentStrength,
    followUpPriority: signal.followUpPriority,
    amountTon: signal.amountTon,
    amountBand: signal.amountBand,
    objections: signal.objections,
    urgency: signal.urgency,
    sourceHint: signal.sourceHint,
    operatorSuggestion: signal.operatorSuggestion,
  };
}

export function shouldAlertOperator(signal) {
  return signal.followUpPriority === "high" || signal.primaryIntent === "human_support";
}

export function formatOperatorAlertLines({ title = "72H 销售信号", userLabel, userId, chatId, signal, text }) {
  return [
    title,
    "",
    `User: ${userLabel || "unknown"}`,
    `Telegram ID: ${userId || "unknown"}`,
    chatId ? `Chat ID: ${chatId}` : undefined,
    `Intent: ${signal.primaryIntent}`,
    `Strength: ${signal.intentStrength}`,
    `Priority: ${signal.followUpPriority}`,
    signal.amountTon !== undefined ? `Amount: ${signal.amountTon} TON (${signal.amountBand})` : undefined,
    signal.objections.length ? `Objections: ${signal.objections.join(", ")}` : undefined,
    signal.urgency !== "unknown" ? `Urgency: ${signal.urgency}` : undefined,
    signal.sourceHint ? `Source hint: ${signal.sourceHint}` : undefined,
    text ? `Message: ${safeText(text, 500)}` : undefined,
    "",
    `建议动作：${signal.operatorSuggestion}`,
  ].filter(Boolean);
}
