#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { runLotteryDraw } from "../functions/_shared/lottery-draw.js";

function env(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const readFlag = (name) => {
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  return {
    input: readFlag("--input"),
    output: readFlag("--output"),
    baseUrl: readFlag("--base-url") || env("H72H_BOT_PUBLIC_BASE_URL"),
    limit: readFlag("--limit") || "500",
    tonBlockHash: readFlag("--ton-block-hash") || env("H72H_LOTTERY_TON_BLOCK_HASH"),
    activityId: readFlag("--activity-id") || env("H72H_LOTTERY_ACTIVITY_ID"),
    drawTime: readFlag("--draw-time") || env("H72H_LOTTERY_DRAW_TIME") || new Date().toISOString(),
  };
}

async function fetchSalesAdminReservations(args) {
  const secret = env("H72H_TELEGRAM_WEBHOOK_SECRET") || env("H72H_TELEGRAM_BOT_SECRET");
  if (!secret) fail("H72H_TELEGRAM_WEBHOOK_SECRET is required when using --base-url.");
  if (!args.baseUrl) fail("Use --input sales-admin.json or provide --base-url.");

  const baseUrl = new URL(args.baseUrl);
  if (baseUrl.protocol !== "https:") fail("--base-url must be an https URL.");
  const url = new URL("/api/telegram/sales-admin", baseUrl);
  url.searchParams.set("limit", String(Math.min(Math.max(Number(args.limit) || 500, 1), 500)));

  const response = await fetch(url, {
    headers: {
      "x-telegram-bot-api-secret-token": secret,
      "user-agent": "72h-telegram-lottery-draw/1.0",
    },
  });
  const body = await response.json().catch(() => undefined);
  if (!response.ok || body?.ok === false) {
    fail(body?.error || `sales-admin read failed with HTTP ${response.status}`);
  }
  if (body.page?.listComplete === false) {
    fail(`sales-admin export is incomplete; rerun read-only export with cursor ${body.page.nextCursor || "<next>"} and merge pages before drawing.`);
  }
  return body.reservations || [];
}

async function readReservations(args) {
  if (!args.input) return fetchSalesAdminReservations(args);
  const raw = await readFile(args.input, "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.reservations)) return parsed.reservations;
  fail("--input must be a JSON array or a sales-admin export object with reservations[].");
}

function summarize(result) {
  const byTier = result.winners.reduce((acc, winner) => {
    acc[winner.winningTier] = (acc[winner.winningTier] || 0) + 1;
    return acc;
  }, {});
  return {
    ok: true,
    draw: result.draw,
    summary: {
      winnerCount: result.winners.length,
      byTier,
      totalReward72H: result.winners.reduce((sum, winner) => sum + Number(winner.rewardAmount72H || 0), 0),
    },
    winners: result.winners,
    reservations: result.reservations.map((record) => ({
      id: record.id,
      telegramUserId: record.telegramUserId,
      username: record.username,
      walletAddress: record.walletAddress,
      ticketCount: record.ticketCount,
      drawStatus: record.drawStatus,
      winningTier: record.winningTier,
      winningTierLabel: record.winningTierLabel,
      rewardAmount72H: record.rewardAmount72H,
      payoutStatus: record.payoutStatus,
      payoutTx: record.payoutTx,
      lotteryEligible: record.lotteryEligible,
      lotteryStatus: record.lotteryStatus,
      walletVerificationStatus: record.walletVerificationStatus,
      reviewStatus: record.reviewStatus,
      drawReviewStatus: record.drawReviewStatus,
      payoutReviewStatus: record.payoutReviewStatus,
      riskLevel: record.riskLevel,
      riskScore: record.riskScore,
      riskFlags: record.riskFlags,
    })),
    notice: "Off-chain deterministic draw only. Review this file, then execute official/private prize-wallet transfers manually; this script never sends on-chain transactions.",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.tonBlockHash) fail("--ton-block-hash is required.");
  if (!args.activityId) fail("--activity-id is required.");

  const reservations = await readReservations(args);
  const result = runLotteryDraw({
    reservations,
    tonBlockHash: args.tonBlockHash,
    activityId: args.activityId,
    drawTime: args.drawTime,
  });
  const output = JSON.stringify(summarize(result), null, 2);
  if (args.output) {
    await writeFile(args.output, `${output}\n`);
    console.error(`Lottery draw export written to ${args.output}`);
  } else {
    console.log(output);
  }
}

await main();
