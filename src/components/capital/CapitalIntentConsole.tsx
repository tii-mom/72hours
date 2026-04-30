import { ArrowRight, BadgeCheck, FileCode2, Radio, Wallet } from "lucide-react";
import { SpotlightCard } from "../SpotlightCard";
import type { Locale } from "../../lib/locale";
import {
  getCapitalIntentWalletSendBlockReason,
  type CapitalIntentExecutionState,
  type CapitalIntentState,
  type CapitalIntentTrackingState,
} from "../../lib/capital-intents";
import { CapitalSectionHeading } from "./CapitalSectionHeading";

const toneClassMap = {
  idle: "border-line/70 bg-surface/72 text-foreground",
  blocked: "border-gold/20 bg-gold/8 text-foreground",
  loading: "border-primary/20 bg-primary/8 text-foreground",
  ready: "border-primary/20 bg-primary/6 text-foreground",
  error: "border-gold/20 bg-gold/8 text-foreground",
} as const;

const trackingToneMap = {
  submitted: "border-primary/20 bg-primary/8 text-foreground",
  pending: "border-primary/20 bg-primary/8 text-foreground",
  confirmed: "border-primary/20 bg-primary/10 text-foreground",
  failed: "border-gold/20 bg-gold/8 text-foreground",
  stale: "border-line/70 bg-surface/72 text-foreground",
} as const;

function formatDateTime(locale: Locale, value: string | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getTrackingTone(status: string | undefined) {
  if (!status) {
    return "border-line/70 bg-surface/72 text-foreground";
  }

  return trackingToneMap[status as keyof typeof trackingToneMap] ?? "border-line/70 bg-surface/72 text-foreground";
}

export function CapitalIntentConsole({
  locale,
  state,
  onSend,
  onRefresh,
  executionState = { status: "idle" },
  trackingState = { status: "idle" },
}: {
  locale: Locale;
  state: CapitalIntentState;
  onSend?: () => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
  executionState?: CapitalIntentExecutionState;
  trackingState?: CapitalIntentTrackingState;
}) {
  const isEnglish = locale === "en-US";
  const sendBlockReason =
    state.status === "ready"
      ? getCapitalIntentWalletSendBlockReason(locale, state.response)
      : undefined;
  const hasPreparedMessages =
    state.status === "ready" && Boolean(state.response.transactionRequest?.messages?.length);
  const canSendPreparedIntent = hasPreparedMessages && !sendBlockReason;

  return (
    <SpotlightCard className={`page-card page-card-lg flex h-full flex-col gap-5 ${toneClassMap[state.status]}`}>
      <CapitalSectionHeading
        eyebrow={isEnglish ? "Status" : "状态"}
        title={
          state.status === "idle"
            ? isEnglish
              ? "No open Capital action yet."
              : "当前没有开放的 Capital 动作。"
            : state.status === "loading"
              ? isEnglish
                ? "Preparing the request for review."
                : "正在生成请求核对记录。"
            : state.status === "ready"
                ? state.response.actionSummary?.title ?? (isEnglish ? "Request recorded." : "请求已记录。")
                : isEnglish
                  ? "This request needs attention."
                  : "该请求需要处理。"
        }
        body={
          state.status === "idle"
            ? isEnglish
              ? "Real Capital seat configuration is not open. This panel only shows status records; contract signing stays closed."
              : "真实 Capital 席位配置尚未开放。此处仅显示状态记录，不开放合约签名。"
            : state.status === "loading"
              ? isEnglish
                ? "The website is preparing the action details for review."
                : "官网正在生成动作核对信息。"
              : state.status === "blocked"
                ? state.message
                : state.status === "error"
                  ? state.message
                  : state.response.actionSummary?.body ?? state.response.message
        }
        className="gap-2"
      />

      {state.status === "ready" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {isEnglish ? "Request id" : "请求编号"}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">{state.response.intentId}</div>
            </div>
            <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {isEnglish ? "Expires" : "失效时间"}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">{formatDateTime(locale, state.response.expiresAt)}</div>
            </div>
            <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {isEnglish ? "Seat scope" : "席位范围"}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {state.response.references?.app?.name ?? "72H"} / {state.response.references?.seat?.label ?? "Seat"}
              </div>
            </div>
            <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {isEnglish ? "Network / gas" : "网络 / Gas"}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">
                {state.response.networkMeta?.networkName ?? state.response.network} / {state.response.gasPolicy}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {state.response.actionSummary?.effect ? (
              <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/88">
                {state.response.actionSummary.effect}
              </div>
            ) : null}
            {state.response.actionSummary?.safeNote ? (
              <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/88">
                {state.response.actionSummary.safeNote}
              </div>
            ) : null}
            {state.response.uiState?.reason ? (
              <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/88">
                {state.response.uiState.reason}
              </div>
            ) : null}
          </div>

          {state.response.transactionRequest?.messages?.length ? (
            <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <FileCode2 className="h-3.5 w-3.5" />
                {isEnglish ? "Transaction preview" : "交易预览"}
              </div>
              {state.response.transactionRequest.scaffold ||
              state.response.transactionRequest.operation ||
              state.response.transactionRequest.entrypoint ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {state.response.transactionRequest.operation ? (
                    <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isEnglish ? "Operation" : "操作"}
                      </div>
                      <div className="mt-2">{state.response.transactionRequest.operation}</div>
                    </div>
                  ) : null}
                  {state.response.transactionRequest.entrypoint ? (
                    <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isEnglish ? "Evidence entry" : "合约入口"}
                      </div>
                      <div className="mt-2">{state.response.transactionRequest.entrypoint}</div>
                    </div>
                  ) : null}
                  {state.response.transactionRequest.payloadEncoding ? (
                    <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86 sm:col-span-2">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isEnglish ? "Payload format" : "载荷格式"}
                      </div>
                      <div className="mt-2">{state.response.transactionRequest.payloadEncoding}</div>
                    </div>
                  ) : null}
                  {state.response.transactionRequest.scaffold?.productionReady === false ? (
                    <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86 sm:col-span-2">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isEnglish ? "Signing status" : "签名状态"}
                      </div>
                      <div className="mt-2">
                        {isEnglish
                          ? "Wallet signing will remain unavailable until the transaction details are finalized."
                          : "正式开放前，钱包签名暂不可用。"}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-4 grid gap-3">
                {state.response.transactionRequest.messages.map((message, index) => (
                  <div key={`${message.address}-${index}`} className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div>{isEnglish ? "Target" : "目标"}: {message.address}</div>
                    <div>{isEnglish ? "Amount" : "金额"}: {message.amount}</div>
                    {message.comment ? <div>{isEnglish ? "Comment" : "备注"}: {message.comment}</div> : null}
                    {message.payload ? <div>{isEnglish ? "Payload" : "载荷"}: {message.payload}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {state.response.walletRequirements || state.response.storage ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {state.response.walletRequirements ? (
                <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/86">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {isEnglish ? "Wallet boundary" : "钱包边界"}
                  </div>
                  <div className="mt-2">{state.response.walletRequirements.connectionLabel}</div>
                  <div>{state.response.walletRequirements.supportedWallets.join(" / ")}</div>
                </div>
              ) : null}
              {state.response.storage ? (
                <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/86">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {isEnglish ? "Request record" : "请求记录"}
                  </div>
                  <div className="mt-2">{isEnglish ? "Recorded for status tracking" : "已记录用于状态追踪"}</div>
                  <div>
                    {isEnglish ? "Recent requests" : "最近请求"}: {state.response.storage.recentCount}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {onSend && hasPreparedMessages ? (
            <div className="flex flex-col gap-3 border-t border-line/70 pt-4">
              <button
                type="button"
                onClick={onSend}
                disabled={!canSendPreparedIntent || executionState.status === "sending"}
                className="page-action disabled:pointer-events-none disabled:opacity-60"
              >
                {executionState.status === "sending"
                  ? isEnglish
                    ? "Sending via wallet"
                    : "正在请求钱包发送"
                  : isEnglish
                    ? "Send via wallet"
                    : "请求钱包发送"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              {sendBlockReason ? (
                <div className="rounded-sm border border-gold/20 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/88">
                  {sendBlockReason}
                </div>
              ) : null}

              {executionState.status === "success" ? (
                <div className="rounded-sm border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-7 text-foreground/88">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                    {isEnglish ? "Wallet submission result" : "钱包提交结果"}
                  </div>
                  <div className="mt-2 break-all">{executionState.boc}</div>
                </div>
              ) : null}

              {executionState.status === "error" ? (
                <div className="rounded-sm border border-gold/20 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/88">
                  {executionState.message}
                </div>
              ) : null}
            </div>
          ) : null}

          {trackingState.status !== "idle" ? (
            <div className="flex flex-col gap-3 border-t border-line/70 pt-4">
              <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {isEnglish ? "Request tracking" : "请求追踪"}
                  </div>
                  {onRefresh ? (
                    <button
                      type="button"
                      onClick={onRefresh}
                      disabled={trackingState.status === "syncing"}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary disabled:pointer-events-none disabled:opacity-60"
                    >
                      {trackingState.status === "syncing"
                        ? isEnglish
                          ? "Syncing"
                          : "同步中"
                        : isEnglish
                          ? "Refresh"
                          : "刷新"}
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isEnglish ? "Submission" : "提交状态"}
                    </div>
                    <div className={`mt-2 rounded-sm border px-3 py-2 ${getTrackingTone(trackingState.response?.submission?.status)}`}>
                      {trackingState.response?.submission?.statusLabel ??
                        (trackingState.status === "syncing"
                          ? isEnglish
                          ? "Syncing request status"
                          : "正在同步请求状态"
                          : isEnglish
                            ? "No submission signal yet"
                            : "暂未拿到提交状态")}
                    </div>
                  </div>

                  <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isEnglish ? "Submitted at" : "提交时间"}
                    </div>
                    <div className="mt-2">
                      {formatDateTime(locale, trackingState.response?.submission?.submittedAt)}
                    </div>
                  </div>

                  <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isEnglish ? "Last update" : "最后更新"}
                    </div>
                    <div className="mt-2">
                      {formatDateTime(locale, trackingState.response?.updatedAt)}
                    </div>
                  </div>

                  <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isEnglish ? "Lifecycle" : "生命周期"}
                    </div>
                    <div className="mt-2">
                      {trackingState.response?.terminal
                        ? isEnglish
                          ? "Terminal"
                          : "已终态"
                        : isEnglish
                          ? "Open"
                          : "处理中"}
                    </div>
                  </div>

                  <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isEnglish ? "Explorer" : "浏览器链接"}
                    </div>
                    <div className="mt-2 break-all">
                      {trackingState.response?.submission?.explorerUrl ? (
                        <a
                          href={trackingState.response.submission.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline decoration-primary/30 underline-offset-4"
                        >
                          {trackingState.response.submission.explorerUrl}
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>

                  <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-foreground/86">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {isEnglish ? "BOC" : "BOC"}
                    </div>
                    <div className="mt-2 break-all">
                      {trackingState.response?.submission?.boc ?? "—"}
                    </div>
                  </div>
                </div>

                {trackingState.message ? (
                  <div className="mt-4 rounded-sm border border-gold/20 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/88">
                    {trackingState.message}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-muted-foreground">
          <div className="flex items-center gap-2">
            {state.status === "blocked" ? <Wallet className="h-4 w-4" /> : state.status === "loading" ? <Radio className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
            {state.status === "blocked"
              ? isEnglish
                ? "Wallet connection is required before an action request can be prepared."
                : "生成动作请求前需要先连接钱包。"
              : state.status === "loading"
                ? isEnglish
                  ? "Request details are being prepared."
                  : "状态信息正在生成。"
                : isEnglish
                  ? "This panel becomes active when you request a Capital action."
                  : "Capital 真实动作开放后，这个面板会显示状态。"}
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
