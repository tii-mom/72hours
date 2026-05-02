import type { Project, TelegramBotProjectPayload } from "./content-types";
import type { Locale } from "./locale";

type AppsResponse = {
  apps?: TelegramBotProjectPayload[];
};

function statusFromStage(stage: TelegramBotProjectPayload["developmentStage"]): Project["status"] {
  if (stage === "live" || stage === "new" || stage === "investable") return "live";
  return "coming_soon";
}

function normalizedPayload(payload: TelegramBotProjectPayload): TelegramBotProjectPayload {
  if (payload.slug !== "multi-millionaire") return payload;

  return {
    ...payload,
    oneLineValue: "multi-millionaire reservation / rule reference; real lock-up and reward claims are not open.",
    developmentStage: "building",
    isInvestable: false,
  };
}

function projectFromPayload(rawPayload: TelegramBotProjectPayload): Project {
  const payload = normalizedPayload(rawPayload);

  return {
    slug: payload.slug,
    name: payload.name,
    oneLineValue: payload.oneLineValue,
    category: payload.developmentStage === "building" ? "coming_soon" : "main_entry",
    status: statusFromStage(payload.developmentStage),
    audienceFit: ["curious_explorer", "community_participant"],
    participationMode: ["try_now", "follow_updates"],
    externalLink: payload.externalLink,
    proofAssets: [],
    featured: payload.developmentStage === "new" || payload.isInvestable,
    priority: payload.priority,
    visibility: payload.visibility,
    chains: payload.chains,
    appCategories: payload.appCategories,
    developmentStage: payload.developmentStage,
    heroImageSrc: payload.heroImageSrc,
    heroImageAlt: payload.heroImageAlt,
    isInvestable: payload.isInvestable,
    iconKey: payload.appCategories.includes("game")
      ? "spark"
      : payload.appCategories.includes("capital")
        ? "shield"
        : "box",
  };
}

export function mergeAppDiscoveryProjects(baseProjects: Project[], botPayloads: TelegramBotProjectPayload[]) {
  const bySlug = new Map(baseProjects.map((project) => [project.slug, project]));

  for (const rawPayload of botPayloads) {
    const payload = normalizedPayload(rawPayload);
    const existing = bySlug.get(payload.slug);

    bySlug.set(payload.slug, {
      ...(existing ?? projectFromPayload(payload)),
      name: payload.name,
      oneLineValue: payload.slug === "multi-millionaire" && existing ? existing.oneLineValue : payload.oneLineValue,
      externalLink: payload.externalLink,
      priority: payload.priority,
      visibility: payload.visibility,
      chains: payload.chains,
      appCategories: payload.appCategories,
      developmentStage: payload.developmentStage,
      heroImageSrc: payload.heroImageSrc,
      heroImageAlt: payload.heroImageAlt,
      isInvestable: payload.isInvestable,
      featured: existing?.featured || payload.developmentStage === "new" || payload.isInvestable,
    });
  }

  return [...bySlug.values()].sort((left, right) => left.priority - right.priority);
}

export async function fetchBotAppDiscovery(locale: Locale) {
  if (import.meta.env.DEV) {
    return [];
  }

  const response = await fetch(`/api/apps?locale=${encodeURIComponent(locale)}`, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`App discovery request failed (${response.status}).`);
  }

  const data = (await response.json()) as AppsResponse;
  return Array.isArray(data.apps) ? data.apps : [];
}
