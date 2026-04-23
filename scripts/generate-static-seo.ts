import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getStaticPageEntries, renderSitemapXml, resolveRouteMeta, type ResolvedRouteMeta } from "../src/content/route-meta";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertMeta(html: string, attribute: "name" | "property", key: string, content: string) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta[^>]*${attribute}=["']${escapeRegex(key)}["'][^>]*>`, "i");

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertTitle(html: string, title: string) {
  const tag = `<title>${escapeHtml(title)}</title>`;

  if (/<title>.*?<\/title>/i.test(html)) {
    return html.replace(/<title>.*?<\/title>/i, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceHtmlLang(html: string, lang: string) {
  if (/<html\b[^>]*lang=/i.test(html)) {
    return html.replace(/<html\b([^>]*)lang="[^"]*"([^>]*)>/i, `<html$1lang="${lang}"$2>`);
  }

  return html.replace(/<html\b([^>]*)>/i, `<html$1 lang="${lang}">`);
}

function injectLinkBlock(html: string, meta: ResolvedRouteMeta) {
  const cleaned = html
    .replace(/\s*<link[^>]*rel="canonical"[^>]*>\s*/gi, "\n")
    .replace(/\s*<link[^>]*rel="alternate"[^>]*>\s*/gi, "\n");

  const block = [
    `<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`,
    `<link rel="alternate" hreflang="zh-CN" href="${escapeHtml(meta.alternateZhUrl)}" />`,
    `<link rel="alternate" hreflang="en-US" href="${escapeHtml(meta.alternateEnUrl)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(meta.xDefaultUrl)}" />`,
  ].join("\n    ");

  return cleaned.replace("</head>", `    ${block}\n  </head>`);
}

function applyRouteMeta(template: string, meta: ResolvedRouteMeta) {
  let html = replaceHtmlLang(template, meta.htmlLang);
  html = upsertTitle(html, meta.title);
  html = upsertMeta(html, "name", "description", meta.description);
  html = upsertMeta(html, "name", "robots", meta.robots);
  html = upsertMeta(html, "name", "theme-color", "#030603");
  html = upsertMeta(html, "property", "og:title", meta.title);
  html = upsertMeta(html, "property", "og:description", meta.description);
  html = upsertMeta(html, "property", "og:type", "website");
  html = upsertMeta(html, "property", "og:url", meta.canonicalUrl);
  html = upsertMeta(html, "property", "og:site_name", meta.siteName);
  html = upsertMeta(html, "property", "og:image", meta.ogImageUrl);
  html = upsertMeta(html, "property", "og:locale", meta.ogLocale);
  html = upsertMeta(html, "name", "twitter:card", "summary_large_image");
  html = upsertMeta(html, "name", "twitter:title", meta.title);
  html = upsertMeta(html, "name", "twitter:description", meta.description);
  html = upsertMeta(html, "name", "twitter:image", meta.ogImageUrl);

  return injectLinkBlock(html, meta);
}

function outputPathsFor(pathnameValue: string) {
  if (pathnameValue === "/") {
    return [path.join(distDir, "index.html")];
  }

  const relativePath = pathnameValue.replace(/^\//, "");

  return [
    path.join(distDir, relativePath, "index.html"),
    path.join(distDir, `${relativePath}.html`),
  ];
}

function notFoundOutputPathFor(locale: ResolvedRouteMeta["locale"]) {
  return locale === "en-US" ? path.join(distDir, "en", "404.html") : path.join(distDir, "404.html");
}

async function main() {
  const templatePath = path.join(distDir, "index.html");
  const template = await readFile(templatePath, "utf8");
  const entries = getStaticPageEntries();

  for (const entry of entries) {
    for (const outputPath of outputPathsFor(entry.pathname)) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, applyRouteMeta(template, entry.meta));
    }
  }

  for (const locale of ["zh-CN", "en-US"] as const) {
    const meta = resolveRouteMeta(locale, "/404");
    const outputPath = notFoundOutputPathFor(locale);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, applyRouteMeta(template, meta));
  }

  const sitemapXml = renderSitemapXml();
  await writeFile(path.join(rootDir, "public", "sitemap.xml"), sitemapXml);
  await writeFile(path.join(distDir, "sitemap.xml"), sitemapXml);
}

await main();
