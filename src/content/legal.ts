import type { LegalDocMeta } from "../lib/content-types";
import type { Locale } from "../lib/locale";

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
    summary: "说明官网最少化数据处理、第三方请求和联系边界。",
    effectiveDate: "2026-04-22",
    owner: "72hours",
    version: "v2",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["terms", "disclaimer"],
    intro: "官网只处理维持访问、展示和基础可用性所需的最少信息。",
    icon: "shield",
    sections: [
      {
        heading: "最少化数据原则",
        body: "本站不要求创建账户，也不要求提交身份信息才能阅读公开页面。我们尽量把数据处理控制在页面访问、静态资源加载、错误排查和基础安全判断所需的最小范围内。",
      },
      {
        heading: "第三方资源请求",
        body: "当前站点会请求第三方字体与相关静态资源，例如 Google Fonts 及其配套的字体分发域名。访问这些资源时，第三方服务可能会基于你的网络请求处理常规技术信息，例如 IP 地址、设备类型、请求时间和请求头。",
      },
      {
        heading: "运行日志与可用性数据",
        body: "为保证页面可访问、可排错和可维护，我们可能保留最少量的运行日志、错误信息、基础性能信号和访问记录。这些信息仅用于稳定性、安全性与服务维护，不用于对外出售，也不用于与公开身份信息做画像绑定。",
      },
      {
        heading: "官方联系与说明渠道",
        body: "如果你通过 Telegram、X、微信说明页或 Contact 页面进一步联系 72hours，后续消息内容、用户名和时间戳会受对应平台自身规则约束。你应同时阅读相关第三方平台的隐私政策与使用规则。",
      },
      {
        heading: "更新与适用边界",
        body: "我们会随着站点行为、外部资源和维护方式变化更新本政策。若没有额外声明，站内当前版本即为有效版本；继续访问站点，表示你理解并接受更新后的公开说明。",
      },
    ],
  },
  {
    slug: "terms",
    title: "服务条款",
    summary: "说明官网用途、官方入口边界、内容更新与使用责任。",
    effectiveDate: "2026-04-22",
    owner: "72hours",
    version: "v2",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "disclaimer"],
    intro: "本站是 72hours 的公开入口，不是对任何结果、额度或收益的承诺工具。",
    icon: "file",
    sections: [
      {
        heading: "站点定位",
        body: "72hours 官网用于说明官方入口、生态应用、绿皮书、72H 用途、学习路径和公开联系信息。它首先是信息入口与说明层，而不是托管账户、收益后台或保证性结算界面。",
      },
      {
        heading: "官方入口与验证",
        body: "你应优先通过本站、站内链接、绿皮书、Contact 页面以及明确标记的官方渠道进入后续页面。任何站外截图、二次转述、非官方镜像或未标记来源的信息，都不应自动被视为官方内容。",
      },
      {
        heading: "内容更新原则",
        body: "生态应用状态、参与方式、说明文案、外链地址和展示顺序可能随真实业务推进而更新。除非另有明确说明，当前页面展示内容优先于历史版本、截图或外部转载内容。",
      },
      {
        heading: "用户使用责任",
        body: "你需要自行判断信息来源、链接目标、参与边界、设备安全和网络环境。你不应把本站内容理解为保证你适合某项应用、服务、活动或第三方平台，也不应把公开说明替代为专业法律、税务、财务或安全建议。",
      },
      {
        heading: "服务可用性与变更",
        body: "本站、站内链接或外部生态应用可能因维护、迭代、第三方依赖、地区网络环境或不可控因素而发生中断、延迟、替换或下线。72hours 保留调整、暂停或移除公开页面及其内容的权利。",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "免责声明",
    summary: "说明非投资建议、非收益承诺与风险自担边界。",
    effectiveDate: "2026-04-22",
    owner: "72hours",
    version: "v2",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "terms"],
    intro: "本站只提供关于入口、生态、72H 用途和公开路径的说明，不构成回报承诺。",
    icon: "scale",
    sections: [
      {
        heading: "非投资建议",
        body: "站内关于 72H、生态应用、学习路径、公开活动和参与方式的内容仅用于信息说明与路径介绍，不构成投资建议、财务建议、证券推介、税务建议或法律意见。",
      },
      {
        heading: "非收益承诺",
        body: "本站不承诺涨幅、回报、收益、空投、分红、额度、资格或结果。页面中出现的产品、场景、阶段、参与路径和公开用语，不应被理解为对未来结果的保证。",
      },
      {
        heading: "阶段变化与不确定性",
        body: "生态应用、外部工具、分发渠道、合作关系和公开入口可能处于测试、试点、上线初期或持续调整中。任何参与都可能面临可用性变化、规则变化、链接调整、功能下线、沟通延迟和外部平台风险。",
      },
      {
        heading: "风险自担",
        body: "你应自行评估是否访问站内外链接、是否参与相关应用或社区，以及是否继续基于公开材料做出任何决定。包括但不限于网络风险、设备风险、第三方平台风险、误读风险和地域可访问性风险，均由你自行承担。",
      },
      {
        heading: "信息边界",
        body: "若你需要正式的法律、财务、税务、合规或安全意见，应寻求具备相应资质的专业顾问。72hours 官网、绿皮书和公开页面不替代专业服务。",
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
    summary: "Explains minimal data handling, third-party requests, and contact boundaries.",
    effectiveDate: "2026-04-22",
    owner: "72hours",
    version: "v2",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["terms", "disclaimer"],
    intro: "This site aims to process only the minimum information required to deliver the public experience.",
    icon: "shield",
    sections: [
      {
        heading: "Minimum-data principle",
        body: "This site does not require an account or identity submission to read public pages. We try to keep data handling limited to what is necessary for page delivery, static asset loading, troubleshooting, and basic security checks.",
      },
      {
        heading: "Third-party resource requests",
        body: "The current site loads third-party font resources, including Google Fonts and related font-delivery domains. When those assets are requested, the third-party service may process ordinary technical request data such as IP address, device type, request time, and request headers.",
      },
      {
        heading: "Runtime logs and usability signals",
        body: "To keep the site available, debuggable, and maintainable, we may retain minimal runtime logs, error traces, basic performance signals, and access records. That information is used for stability, security, and maintenance only, not for sale or identity profiling.",
      },
      {
        heading: "Official contact channels",
        body: "If you continue through Telegram, X, WeChat notes, or the Contact page, your follow-up messages, usernames, and timestamps are subject to the rules of those platforms. You should also review the privacy policies and rules of the relevant third-party services.",
      },
      {
        heading: "Updates and scope",
        body: "We may update this policy as the site, external resources, or maintenance model changes. Unless stated otherwise, the current on-site version is the effective version; continuing to use the site means you accept the updated public notes.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "Explains site purpose, official entry boundaries, content updates, and user responsibility.",
    effectiveDate: "2026-04-22",
    owner: "72hours",
    version: "v2",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "disclaimer"],
    intro: "This site is a public entry for 72hours, not a promise of outcome, allocation, or return.",
    icon: "file",
    sections: [
      {
        heading: "Site positioning",
        body: "The 72hours site explains official entry points, ecosystem apps, Green Book, 72H Use, learning paths, and public contact routes. It is an information and navigation surface first, not a custody account, return dashboard, or guaranteed settlement interface.",
      },
      {
        heading: "Official entry and verification",
        body: "You should prioritize this site, on-site links, Green Book, the Contact page, and clearly marked official channels when entering related properties. Off-site screenshots, reposts, mirrors, and unverified copies should not automatically be treated as official content.",
      },
      {
        heading: "Content update policy",
        body: "App status, participation paths, explanatory text, external links, and presentation order may change as real operations evolve. Unless stated otherwise, the currently published page takes precedence over older copies, screenshots, or third-party reposts.",
      },
      {
        heading: "User responsibility",
        body: "You are responsible for judging source quality, destination links, participation boundaries, device security, and network conditions. Nothing on this site should be treated as confirmation that any app, service, event, or platform is suitable for you.",
      },
      {
        heading: "Availability and change",
        body: "This site, its linked resources, or ecosystem apps may be interrupted, delayed, replaced, or removed due to maintenance, iteration, third-party dependencies, regional network conditions, or other external factors. 72hours may revise, pause, or remove public pages at any time.",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary: "Explains non-investment, non-return, and risk-assumption boundaries.",
    effectiveDate: "2026-04-22",
    owner: "72hours",
    version: "v2",
    contentSource: "Markdown / page source",
    requiresTopNotice: true,
    relatedDocs: ["privacy", "terms"],
    intro: "This site explains entry points, ecosystem context, 72H Use, and public paths only. It does not promise outcomes.",
    icon: "scale",
    sections: [
      {
        heading: "Not investment advice",
        body: "Any content about 72H, ecosystem apps, learning paths, public activities, or participation routes is provided for informational and navigational purposes only. It is not investment advice, financial advice, securities solicitation, tax advice, or legal advice.",
      },
      {
        heading: "No return promise",
        body: "This site does not promise appreciation, yield, return, airdrops, allocations, eligibility, or outcomes. Product language, participation paths, stages, and public descriptions should not be interpreted as guarantees of future results.",
      },
      {
        heading: "Stage changes and uncertainty",
        body: "Ecosystem apps, external tools, distribution channels, partnerships, and public entry points may be in testing, pilot, early launch, or ongoing revision. Participation may be affected by availability changes, rule changes, link updates, feature removals, communication delays, and third-party platform risk.",
      },
      {
        heading: "Risk is yours",
        body: "You are responsible for deciding whether to visit linked sites, participate in related apps or communities, or rely on public materials for any further action. Network risk, device risk, third-party platform risk, interpretation risk, and regional accessibility risk are all yours to evaluate.",
      },
      {
        heading: "Professional advice boundary",
        body: "If you need formal legal, financial, tax, compliance, or security advice, you should seek qualified professionals. The 72hours site, Green Book, and public pages do not replace professional services.",
      },
    ],
  },
];

export const legalDocs = legalDocsZh;

export function getLegalDocs(locale: Locale) {
  return locale === "en-US" ? legalDocsEn : legalDocsZh;
}
