import type { LegalDocMeta } from "../lib/content-types";

export const legalDocs: Array<
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
    summary: "说明 72hours 官网在访问、联系与跳转过程中如何收集、使用和最小化处理数据。",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["terms", "disclaimer"],
    intro: "本站仅收集完成社区入口和页面稳定性所必需的最少信息。",
    icon: "shield",
    sections: [
      {
        heading: "我们会收集什么",
        body: "只记录维持站点运行、访问稳定和入口跳转所必需的基础数据，不做超出业务需要的收集。",
      },
      {
        heading: "我们如何使用",
        body: "这些信息仅用于页面可用性、社区入口识别和安全性判断，不用于与站点目标无关的跟踪。",
      },
      {
        heading: "如何联系",
        body: "如需说明，请优先通过 Telegram、X 或 Contact 页面提供的官方路径联系。",
      },
    ],
  },
  {
    slug: "terms",
    title: "服务条款",
    summary: "说明 72hours 官网和官方入口的使用边界、内容更新方式和责任范围。",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "disclaimer"],
    intro: "使用本站和相关入口时，请先确认你理解其定位、边界与参与方式。",
    icon: "file",
    sections: [
      {
        heading: "站点定位",
        body: "72hours 是社区和生态入口，不是课程售卖页，也不是收益承诺页。",
      },
      {
        heading: "使用边界",
        body: "用户应通过官方入口查看生态、参与社区并按页面说明完成下一步，不要把站外相似名字节点视为官方来源。",
      },
      {
        heading: "内容更新",
        body: "页面上的项目、入口和说明会随着真实业务变化而更新；如果有改动，请以当前页面为准。",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "免责声明",
    summary: "明确 72hours 官网内容仅用于说明社区、生态和参与路径，不构成投资建议或收益承诺。",
    effectiveDate: "2026-04-21",
    owner: "72hours",
    version: "v1",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "terms"],
    intro: "站点内容仅用于说明社区、生态和参与路径，不构成投资建议或收益承诺。",
    icon: "scale",
    sections: [
      {
        heading: "非收益承诺",
        body: "本站不会承诺收益、回报、涨幅或任何形式的金融结果。",
      },
      {
        heading: "非投资建议",
        body: "hours、生态应用和社区参与路径都应被理解为业务说明，不应被当成投资建议。",
      },
      {
        heading: "风险自担",
        body: "参与前请自行判断信息来源、入口真假与适合程度，必要时先通过官方社区进一步确认。",
      },
    ],
  },
];
