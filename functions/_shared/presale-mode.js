export const PRESALE_MODES = ["warmup", "waitlist", "sale_ready", "sale_live", "paused"];
export const BOT_ONLY_PRESALE_MODES = ["warmup", "waitlist", "paused"];

function readString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readBoolean(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "true";
}

export function getPresaleMode(env = {}) {
  const requested = readString(env.H72H_PRESALE_MODE) || readString(env.PRESALE_MODE) || "warmup";
  const normalized = requested.toLowerCase();
  const requestedMode = PRESALE_MODES.includes(normalized) ? normalized : "warmup";
  const saleModesAllowed = readBoolean(env.H72H_ALLOW_SALE_MODES);

  if ((requestedMode === "sale_ready" || requestedMode === "sale_live") && !saleModesAllowed) {
    return {
      mode: "waitlist",
      requestedMode,
      saleModesAllowed: false,
      botOnly: true,
      purchaseEnabled: false,
      reservationEnabled: true,
      reason: "sale_modes_require_explicit_h72h_allow_sale_modes_true",
    };
  }

  return {
    mode: requestedMode,
    requestedMode,
    saleModesAllowed,
    botOnly: requestedMode !== "sale_ready" && requestedMode !== "sale_live",
    purchaseEnabled: saleModesAllowed && requestedMode === "sale_live",
    reservationEnabled: requestedMode === "warmup" || requestedMode === "waitlist" || requestedMode === "paused",
    reason: requestedMode === "paused" ? "paused" : undefined,
  };
}

export function assertBotOnlyReservationMode(env = {}) {
  const presaleMode = getPresaleMode(env);
  if (!presaleMode.reservationEnabled) {
    return { ok: false, presaleMode, error: "presale_reservations_not_available" };
  }
  if (presaleMode.purchaseEnabled) {
    return { ok: false, presaleMode, error: "purchase_mode_not_allowed_on_reservation_route" };
  }
  return { ok: true, presaleMode };
}
