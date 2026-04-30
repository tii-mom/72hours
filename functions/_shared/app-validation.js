const CHAINS = new Set(["TON", "BSC", "BASE", "ETH"]);
const CATEGORIES = new Set(["tool", "game", "social", "capital", "content"]);
const STAGES = new Set(["new", "live", "building", "investable"]);
const VISIBILITY = new Set(["public", "hidden"]);
const LINK_TYPES = new Set(["app", "waitlist", "community", "docs"]);

const ALLOWED_LINK_HOSTS = new Set([
  "72h.lol",
  "72hours.72h.lol",
  "distribution.72h.lol",
  "t.me",
  "telegram.me",
  "wan.lat",
]);

const ALLOWED_IMAGE_HOSTS = new Set([
  "72h.lol",
  "72hours.72h.lol",
  "imagedelivery.net",
  "images.unsplash.com",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isKebabSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isInternalPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

function validateOfficialLink(value) {
  if (!isObject(value)) return "externalLink must be an object.";
  if (typeof value.label !== "string" || value.label.length < 1 || value.label.length > 24) {
    return "externalLink.label must be 1-24 characters.";
  }
  if (!LINK_TYPES.has(value.type)) return "externalLink.type is not allowed.";
  if (isInternalPath(value.url)) return null;

  try {
    const url = new URL(value.url);
    if (url.protocol !== "https:") return "externalLink.url must use HTTPS.";
    if (!ALLOWED_LINK_HOSTS.has(url.hostname)) return "externalLink.url host is not whitelisted.";
  } catch {
    return "externalLink.url is invalid.";
  }

  return null;
}

function validateImageSrc(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "heroImageSrc must be a string.";

  if (isInternalPath(value)) {
    if (!value.startsWith("/apps/") || !/\.(avif|webp|png|jpg|jpeg)$/i.test(value)) {
      return "Internal heroImageSrc must be an image under /apps/.";
    }
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return "heroImageSrc must use HTTPS.";
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) return "heroImageSrc host is not whitelisted.";
    if (!/\.(avif|webp|png|jpg|jpeg)$/i.test(url.pathname)) return "heroImageSrc must point to an image file.";
  } catch {
    return "heroImageSrc is invalid.";
  }

  return null;
}

export function validateAppPayload(payload) {
  const errors = [];

  if (!isObject(payload)) {
    return { errors: ["Payload must be an object."] };
  }

  if (!isKebabSlug(payload.slug)) errors.push("slug must be lowercase kebab-case.");
  if (typeof payload.name !== "string" || payload.name.length < 1 || payload.name.length > 48) {
    errors.push("name must be 1-48 characters.");
  }
  if (typeof payload.oneLineValue !== "string" || payload.oneLineValue.length < 4 || payload.oneLineValue.length > 120) {
    errors.push("oneLineValue must be 4-120 characters.");
  }
  if (!Array.isArray(payload.chains) || payload.chains.length < 1 || payload.chains.some((item) => !CHAINS.has(item))) {
    errors.push("chains must contain allowed chain values.");
  }
  if (
    !Array.isArray(payload.appCategories) ||
    payload.appCategories.length < 1 ||
    payload.appCategories.some((item) => !CATEGORIES.has(item))
  ) {
    errors.push("appCategories must contain allowed category values.");
  }
  if (!STAGES.has(payload.developmentStage)) errors.push("developmentStage is not allowed.");
  if (typeof payload.isInvestable !== "boolean") errors.push("isInvestable must be boolean.");
  if (!VISIBILITY.has(payload.visibility)) errors.push("visibility is not allowed.");
  if (!Number.isFinite(payload.priority)) errors.push("priority must be a number.");
  if (
    payload.heroImageAlt !== undefined &&
    (typeof payload.heroImageAlt !== "string" || payload.heroImageAlt.length > 96)
  ) {
    errors.push("heroImageAlt must be 1-96 characters.");
  }

  const imageError = validateImageSrc(payload.heroImageSrc);
  if (imageError) errors.push(imageError);

  const linkError = validateOfficialLink(payload.externalLink);
  if (linkError) errors.push(linkError);

  return { errors };
}

export async function assertImageReachable(request, heroImageSrc) {
  if (!heroImageSrc) return null;

  const url = isInternalPath(heroImageSrc) ? new URL(heroImageSrc, request.url).toString() : heroImageSrc;
  const response = await fetch(url, { method: "HEAD" });
  const contentType = response.headers.get("content-type") || "";
  const contentLength = Number(response.headers.get("content-length") || "0");

  if (!response.ok) return "heroImageSrc is not reachable.";
  if (!contentType.startsWith("image/")) return "heroImageSrc is not an image.";
  if (contentLength > 650_000) return "heroImageSrc exceeds the mobile asset budget.";

  return null;
}

export function sanitizeAppPayload(payload) {
  return {
    slug: payload.slug,
    name: payload.name.trim(),
    oneLineValue: payload.oneLineValue.trim(),
    chains: [...new Set(payload.chains)],
    appCategories: [...new Set(payload.appCategories)],
    developmentStage: payload.developmentStage,
    isInvestable: payload.isInvestable,
    heroImageSrc: payload.heroImageSrc || undefined,
    heroImageAlt: payload.heroImageAlt?.trim(),
    externalLink: {
      label: payload.externalLink.label.trim(),
      url: payload.externalLink.url,
      type: payload.externalLink.type,
      isOfficial: payload.externalLink.isOfficial !== false,
    },
    priority: payload.priority,
    visibility: payload.visibility,
    updatedBy: payload.updatedBy || "telegram",
    updatedAt: new Date().toISOString(),
  };
}
