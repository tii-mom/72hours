import type { ReactNode } from "react";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  Info,
  Loader2,
  Share2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "../lib/utils";
import { getGreenBookContent } from "../content/greenbook";
import { useLocale, type Locale } from "../lib/locale";
import {
  copyGreenBookLink,
  downloadGreenBookPoster,
  shareGreenBookPoster,
  type GreenBookExportFeedback,
} from "../lib/greenbook-share";
import { GreenBookPoster } from "./GreenBookPoster";

type ActionState = "idle" | "saving" | "sharing" | "copying";
type ToneState = "idle" | "success" | "error";

function ActionButton({
  label,
  icon,
  onClick,
  busy,
  disabled,
  tone,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  busy?: boolean;
  disabled?: boolean;
  tone?: "primary" | "ghost";
}) {
  const base =
    tone === "primary"
      ? "border-primary/30 bg-primary text-background shadow-[0_18px_40px_rgba(124,255,102,0.18)] hover:border-primary/40 hover:shadow-[0_20px_48px_rgba(124,255,102,0.22)]"
      : "border-white/10 bg-white/4 text-foreground hover:border-primary/30 hover:bg-white/8";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[20px] border px-4 py-3.5 text-sm font-semibold tracking-[0.08em] transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]",
        base
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );
}

function StatusIcon({ tone }: { tone: ToneState }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? TriangleAlert : Info;

  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border",
        tone === "success"
          ? "border-primary/20 bg-primary/10 text-primary"
          : tone === "error"
            ? "border-red-500/20 bg-red-500/10 text-red-200"
            : "border-white/10 bg-white/5 text-white/72"
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function GreenBookSharePanel({ className }: { className?: string }) {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const content = getGreenBookContent(locale);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [tone, setTone] = useState<ToneState>("idle");
  const [message, setMessage] = useState(
    isEnglish ? "Save the card, share the image, or copy the Green Book link." : "保存卡片、分享图片或复制绿书链接。"
  );

  const busy = actionState !== "idle";
  const statusTitle = tone === "success" ? (isEnglish ? "Completed" : "已完成") : tone === "error" ? (isEnglish ? "Needs attention" : "需要处理") : isEnglish ? "Ready" : "准备就绪";

  function resolveActiveLocale(): Locale {
    if (typeof document !== "undefined" && document.documentElement.lang === "en-US") {
      return "en-US";
    }

    return "zh-CN";
  }

  async function runAction(
    nextAction: ActionState,
    task: () => Promise<GreenBookExportFeedback>
  ) {
    setActionState(nextAction);
    setTone("idle");
    setMessage(
      nextAction === "saving"
        ? isEnglish
          ? "Saving card…"
          : "正在保存卡片…"
        : nextAction === "sharing"
          ? isEnglish
            ? "Opening share sheet…"
            : "正在打开分享面板…"
          : nextAction === "copying"
            ? isEnglish
              ? "Copying link…"
              : "正在复制链接…"
            : ""
    );

    try {
      const result = await task();
      setTone("success");
      setMessage(result.message);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setTone("idle");
        setMessage(isEnglish ? "Sharing canceled." : "分享已取消。");
        return;
      }

      const errorMessage = error instanceof Error ? error.message : isEnglish ? "Action failed. Please try again." : "操作失败，请重试。";
      setTone("error");
      setMessage(errorMessage);
    } finally {
      setActionState("idle");
    }
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(4,8,5,0.84),rgba(2,4,3,0.72))] px-0 py-0 shadow-[0_24px_90px_rgba(0,0,0,0.32)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_16%,rgba(124,255,102,0.15),transparent_28%),radial-gradient(circle_at_16%_84%,rgba(89,255,138,0.1),transparent_32%)]" />
      <div className="absolute inset-0 opacity-18 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,0.68fr)_minmax(320px,0.96fr)] lg:gap-6">
        <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {isEnglish ? "Share" : "分享"}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-[clamp(1.55rem,3.1vw,2.2rem)] font-bold tracking-[-0.05em] text-foreground">
              {isEnglish ? "Share Green Book in one clean card." : "用一张卡片分享绿书。"}
            </h2>
          </div>

          <div className="rounded-[28px] bg-transparent p-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-primary/80">
                {isEnglish ? "Card Preview" : "卡片预览"}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/52">
                {isEnglish ? "X / Telegram / WeChat" : "X / Telegram / 微信"}
              </p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_78%_18%,rgba(124,255,102,0.18),transparent_26%),linear-gradient(180deg,rgba(124,255,102,0.06),transparent_28%)] blur-sm" />
              <GreenBookPoster locale={locale} className="mx-auto max-w-[344px] shadow-[0_18px_54px_rgba(0,0,0,0.42)] sm:max-w-[392px]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4 pb-5 sm:gap-5 sm:px-6 sm:pb-6">
          <div className="rounded-[28px] border border-white/8 bg-white/[0.035] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-primary/80">
                  {isEnglish ? "Share Summary" : "分享摘要"}
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-[-0.05em] text-foreground sm:text-2xl">
                  {content.share.title}
                </h3>
              </div>
            </div>

            <ul className="mt-4 grid gap-2">
              {content.share.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 rounded-2xl border border-white/8 bg-black/25 px-3 py-3 text-sm leading-relaxed text-white/82"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_12px_rgba(124,255,102,0.8)]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ActionButton
              label={isEnglish ? "Save card" : "保存卡片"}
              icon={<Download className="h-4 w-4" />}
              onClick={() =>
                runAction("saving", async () => {
                  return downloadGreenBookPoster(resolveActiveLocale());
                })
              }
              busy={busy && actionState === "saving"}
              disabled={busy && actionState !== "saving"}
              tone="primary"
            />
            <ActionButton
              label={isEnglish ? "Share card" : "分享卡片"}
              icon={<Share2 className="h-4 w-4" />}
              onClick={() =>
                runAction("sharing", async () => {
                  return shareGreenBookPoster(resolveActiveLocale());
                })
              }
              busy={busy && actionState === "sharing"}
              disabled={busy && actionState !== "sharing"}
            />
            <ActionButton
              label={isEnglish ? "Copy link" : "复制链接"}
              icon={<Copy className="h-4 w-4" />}
              onClick={() =>
                runAction("copying", async () => {
                  return copyGreenBookLink(resolveActiveLocale());
                })
              }
              busy={busy && actionState === "copying"}
              disabled={busy && actionState !== "copying"}
            />
          </div>

          <div
            className={cn(
              "rounded-[20px] border px-4 py-3 text-sm leading-relaxed sm:px-5",
              tone === "success"
                ? "border-primary/25 bg-primary/10 text-primary"
                : tone === "error"
                  ? "border-red-500/20 bg-red-500/10 text-red-200"
                  : "border-white/10 bg-black/25 text-white/72"
            )}
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <StatusIcon tone={tone} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/54">
                  {statusTitle}
                </p>
                <p className="mt-1">{message}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GreenBookSharePanel;
