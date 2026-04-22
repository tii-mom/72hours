import type { LegalDocMeta } from "../lib/content-types";
import type { Locale } from "../lib/locale";
import { localized } from "../lib/locale";

const legalDocsZh: Array<
  LegalDocMeta & {
    intro: string;
    icon: "shield" | "file" | "scale";
    sections: Array<{
      heading: string;
      body: string;
    }>;
  }
> = [
  {
    slug: "privacy",
    title: "隐私政策",
    summary: "说明官网如何最少化处理数据。",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["terms", "disclaimer"],
    intro: "只收最少信息。",
    icon: "shield",
    sections: [
      {
        heading: "我们会收集什么",
        body: "只记运行、跳转和基础可用性数据。",
      },
      {
        heading: "我们如何使用",
        body: "仅用于可用性和安全判断。",
      },
      {
        heading: "如何联系",
        body: "如需说明，请走 Telegram、X 或联系页面。",
      },
    ],
  },
  {
    slug: "terms",
    title: "服务条款",
    summary: "说明官网与官方入口的使用边界。",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "disclaimer"],
    intro: "先看定位和边界。",
    icon: "file",
    sections: [
      {
        heading: "站点定位",
        body: "72hours 是社区、生态和绿书的入口。",
      },
      {
        heading: "使用边界",
        body: "只通过官方入口查看和核对信息。",
      },
      {
        heading: "内容更新",
        body: "页面随真实业务更新，以当前页为准。",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "免责声明",
    summary: "内容不构成投资建议或收益承诺。",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "terms"],
    intro: "只说明社区、生态和路径。",
    icon: "scale",
    sections: [
      {
        heading: "非收益承诺",
        body: "本站不承诺收益、回报或结果。",
      },
      {
        heading: "非投资建议",
        body: "72H、相关使用路径和生态材料仅作信息说明，不构成投资建议。",
      },
      {
        heading: "风险自担",
        body: "参与前请自行判断来源、边界和适合程度。",
      },
    ],
  },
];

const legalDocsEn: Array<
  LegalDocMeta & {
    intro: string;
    icon: "shield" | "file" | "scale";
    sections: Array<{
      heading: string;
      body: string;
    }>;
  }
> = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "Explains minimal data handling.",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["terms", "disclaimer"],
    intro: "We collect the minimum.",
    icon: "shield",
    sections: [
      {
        heading: "What we collect",
        body: "We only record runtime, navigation, and basic usability data.",
      },
      {
        heading: "How we use it",
        body: "Only for usability, safety, and maintenance.",
      },
      {
        heading: "How to contact us",
        body: "For clarification, use Telegram, X, or the Contact page.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "Explains site and entry boundaries.",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "disclaimer"],
    intro: "Confirm the boundaries first.",
    icon: "file",
    sections: [
      {
        heading: "Site positioning",
        body: "72hours is the entry for community, ecosystem, and Green Book.",
      },
      {
        heading: "Usage boundaries",
        body: "Only use official entry points to view, participate, and verify.",
      },
      {
        heading: "Content updates",
        body: "The page follows real updates; the current page wins.",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary: "Not investment advice or a return promise.",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "terms"],
    intro: "It only explains the community, ecosystem, and paths.",
    icon: "scale",
    sections: [
      {
        heading: "No return promise",
        body: "This site does not promise returns or outcomes.",
      },
      {
        heading: "Not investment advice",
        body: "72H, related usage paths, and ecosystem materials are provided for informational purposes only.",
      },
      {
        heading: "Risk is yours",
        body: "Please judge the source, boundaries, and fit before participating.",
      },
    ],
  },
];

export const legalDocs = legalDocsZh;

export function getLegalDocs(locale: Locale) {
  return localized(locale, legalDocsZh, legalDocsEn);
}
