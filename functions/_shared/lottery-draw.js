const DEFAULT_BIG_PRIZE_TIERS = [
  { tier: "first", label: "一等奖", count: 1, rewardAmount72H: 72000 },
  { tier: "second", label: "二等奖", count: 3, rewardAmount72H: 7200 },
  { tier: "third", label: "三等奖", count: 10, rewardAmount72H: 720 },
];

const PARTICIPATION_TIER = {
  tier: "participation",
  label: "参与奖",
  minReward72H: 10,
  maxReward72H: 200,
};

function normalizeSeedPart(value) {
  return String(value || "").trim();
}

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function seed() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a, b, c, d) {
  return function random() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    const result = (t + d) | 0;
    c = (c + result) | 0;
    return (result >>> 0) / 4294967296;
  };
}

function createRandom(seed) {
  const seedFn = xmur3(seed);
  return sfc32(seedFn(), seedFn(), seedFn(), seedFn());
}

function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function getTicketCount(record) {
  const ledger = Array.isArray(record?.lotteryCodeLedger) ? record.lotteryCodeLedger : [];
  const ledgerCount = ledger.reduce((sum, item) => sum + (Number(item?.codes) || 0), 0);
  if (ledger.length) return Math.max(0, Math.floor(ledgerCount));
  const explicit = Number(record?.lotteryCodeCount);
  if (Number.isFinite(explicit) && explicit > 0) return Math.floor(explicit);
  return 0;
}

function isEligible(record) {
  if (!record || record.lotteryEligible === false) return false;
  if (["cancelled", "rejected"].includes(record.status)) return false;
  if (record.rewardStatus === "rejected") return false;
  if (record.walletVerificationStatus && record.walletVerificationStatus !== "verified_unique") return false;
  if (["high", "blocked"].includes(record.riskLevel)) return false;
  if (["rejected", "pending_review"].includes(record.reviewStatus)) return false;
  if (["held", "ineligible"].includes(record.drawReviewStatus)) return false;
  return getTicketCount(record) > 0;
}

function createDrawSeed({ tonBlockHash, activityId, drawTime }) {
  const parts = [normalizeSeedPart(tonBlockHash), normalizeSeedPart(activityId), normalizeSeedPart(drawTime)];
  if (parts.some((part) => !part)) {
    throw new Error("tonBlockHash, activityId, and drawTime are required for a public deterministic draw seed");
  }
  return parts.join("|");
}

function normalizeReservations(reservations = []) {
  const unique = new Map();
  for (const record of reservations) {
    const userId = String(record?.telegramUserId || "").trim();
    if (!userId || unique.has(userId)) continue;
    unique.set(userId, record);
  }
  return [...unique.values()];
}

function buildTickets(reservations) {
  const tickets = [];
  for (const record of reservations) {
    if (!isEligible(record)) continue;
    const ticketCount = getTicketCount(record);
    for (let ticketIndex = 0; ticketIndex < ticketCount; ticketIndex += 1) {
      tickets.push({
        ticketId: `${record.telegramUserId}:${ticketIndex + 1}`,
        ticketIndex: ticketIndex + 1,
        telegramUserId: String(record.telegramUserId),
        reservationId: record.id,
        record,
      });
    }
  }
  return tickets;
}

function winnerPatch({ drawStatus, tier, rewardAmount72H, payoutStatus }) {
  return {
    drawStatus,
    winningTier: tier,
    rewardAmount72H: String(rewardAmount72H),
    payoutStatus,
    payoutTx: undefined,
  };
}

export function runLotteryDraw({
  reservations,
  tonBlockHash,
  activityId,
  drawTime,
  bigPrizeTiers = DEFAULT_BIG_PRIZE_TIERS,
  participationTier = PARTICIPATION_TIER,
  awardParticipationToAllRemaining = true,
} = {}) {
  const seed = createDrawSeed({ tonBlockHash, activityId, drawTime });
  const normalizedReservations = normalizeReservations(reservations);
  const eligibleReservations = normalizedReservations.filter(isEligible);
  const ticketCountByUser = new Map(eligibleReservations.map((record) => [String(record.telegramUserId), getTicketCount(record)]));
  const shuffledTickets = shuffle(buildTickets(eligibleReservations), createRandom(`${seed}|tickets`));
  const winners = new Map();
  const bigWinnerUserIds = new Set();

  for (const tier of bigPrizeTiers) {
    let awarded = 0;
    for (const ticket of shuffledTickets) {
      if (awarded >= tier.count) break;
      if (bigWinnerUserIds.has(ticket.telegramUserId)) continue;
      bigWinnerUserIds.add(ticket.telegramUserId);
      winners.set(ticket.telegramUserId, {
        telegramUserId: ticket.telegramUserId,
        reservationId: ticket.reservationId,
        username: ticket.record.username,
        walletAddress: ticket.record.walletAddress,
        ticketId: ticket.ticketId,
        ticketCount: ticketCountByUser.get(ticket.telegramUserId) || 0,
        drawStatus: "finalized",
        winningTier: tier.tier,
        winningTierLabel: tier.label,
        rewardAmount72H: String(tier.rewardAmount72H),
        payoutStatus: "pending_manual_transfer",
        payoutTx: undefined,
      });
      awarded += 1;
    }
  }

  const participationRandom = createRandom(`${seed}|participation`);
  const participationOrder = shuffle(buildTickets(eligibleReservations), createRandom(`${seed}|participation-order`));
  const participatedUserIds = new Set();
  for (const ticket of participationOrder) {
    if (!awardParticipationToAllRemaining && winners.has(ticket.telegramUserId)) continue;
    if (bigWinnerUserIds.has(ticket.telegramUserId)) continue;
    if (participatedUserIds.has(ticket.telegramUserId)) continue;
    participatedUserIds.add(ticket.telegramUserId);
    const rewardAmount72H = randomInt(participationRandom, participationTier.minReward72H, participationTier.maxReward72H);
    winners.set(ticket.telegramUserId, {
      telegramUserId: ticket.telegramUserId,
      reservationId: ticket.reservationId,
      username: ticket.record.username,
      walletAddress: ticket.record.walletAddress,
      ticketId: ticket.ticketId,
      ticketCount: ticketCountByUser.get(ticket.telegramUserId) || 0,
      drawStatus: "finalized",
      winningTier: participationTier.tier,
      winningTierLabel: participationTier.label,
      rewardAmount72H: String(rewardAmount72H),
      payoutStatus: "pending_manual_transfer",
      payoutTx: undefined,
    });
  }

  const rows = normalizedReservations.map((record) => {
    const userId = String(record.telegramUserId || "");
    const winner = winners.get(userId);
    if (winner) {
      return {
        ...record,
        ...winnerPatch({
          drawStatus: winner.drawStatus,
          tier: winner.winningTier,
          rewardAmount72H: winner.rewardAmount72H,
          payoutStatus: winner.payoutStatus,
        }),
        winningTierLabel: winner.winningTierLabel,
        winningTicketId: winner.ticketId,
        ticketCount: winner.ticketCount,
      };
    }
    return {
      ...record,
      drawStatus: isEligible(record) ? "finalized" : "ineligible",
      winningTier: "none",
      rewardAmount72H: "0",
      payoutStatus: "not_required",
      payoutTx: undefined,
      ticketCount: ticketCountByUser.get(userId) || 0,
    };
  });

  return {
    ok: true,
    draw: {
      activityId,
      drawTime,
      tonBlockHash,
      seed,
      status: "finalized_off_chain_no_auto_payout",
      prizeTiers: [...bigPrizeTiers, participationTier],
      eligibleUserCount: eligibleReservations.length,
      ticketCount: shuffledTickets.length,
      winnerCount: winners.size,
      payoutMode: "official_wallet_transfer_no_new_contract",
      noAutoPayout: true,
    },
    winners: [...winners.values()].sort((left, right) => {
      const tierOrder = { first: 0, second: 1, third: 2, participation: 3 };
      return (tierOrder[left.winningTier] ?? 99) - (tierOrder[right.winningTier] ?? 99)
        || String(left.telegramUserId).localeCompare(String(right.telegramUserId));
    }),
    reservations: rows,
  };
}

export { DEFAULT_BIG_PRIZE_TIERS, PARTICIPATION_TIER, getTicketCount, isEligible };
