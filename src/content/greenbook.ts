import type { Locale } from "../lib/locale";
import { localizePath } from "../lib/routes";

const SITE_URL = "https://72h.lol";

const greenbookContentZh = {
  hero: {
    eyebrow: "72H 绿皮书 / 行动版",
    title: "别再围观，上场",
    lead: "加密世界真正的门槛，不只是波动，而是很多人以为自己在参与，其实仍停留在围观。72H 把真实产品、1000 亿固定供应、900 亿赛季玩法池、72 小时冲刺、冲刺通行证、战队、WAN 真实业务和建设者路径放到同一张地图里。",
    ctaPrimary: { label: "加入社区", href: "/join" },
    ctaSecondary: { label: "查看合约", href: "/contracts" },
  },
  manifesto: {
    kicker: "看客 -> 玩家 -> 队员 -> 贡献者 -> 建设者",
    title: "72H 不是让你继续看项目的代币。",
    body: "它是一套把普通加密用户推上场的系统：真实产品、72 小时赛季、900 亿玩法池、战队协作、有效锁定、邀请传播、排行榜冲刺、线上线下学习，最终把一部分用户训练成建设者。",
    ctaLabel: "你的 72 小时已经开始。",
  },
  quickFacts: [
    {
      label: "固定供应",
      value: "1000 亿 72H",
      body: "总量 100,000,000,000 72H，固定供应，不能再增发。",
    },
    {
      label: "赛季引擎",
      value: "900 亿玩法池",
      body: "90,000,000,000 72H 被放进最多 10 个赛季、18 轮冲刺。",
    },
    {
      label: "倒计时",
      value: "72 小时冲刺",
      body: "每一轮都是一个窗口。你要么上场，要么继续看别人上场。",
    },
    {
      label: "路径",
      value: "通行证 / 战队 / WAN / 建设者",
      body: "从冲刺通行证、有效存入、战队冲榜，到真实业务和建设者路径。",
    },
  ],
  chapters: [
    {
      id: "watchers",
      title: "这不是给旁观者看的",
      eyebrow: "01 / 身份冲突",
      summary: "72H 先处理一个现实问题：很多人以为自己在参与，其实只是项目报表里的一个数字。",
      defaultOpen: true,
      paragraphs: [
        "你每天看 K 线，进群，等公告，等内幕，等大佬给方向。你看别人链上交互，看别人拿到身份，看别人进白名单，看别人做产品，看别人构建自己的生态。",
        "你也在场，但你没有真正上场。你只是一个用户，一个点击量，一个活跃地址，一个被别人统计进报表里的数字。",
        "72H 要打破这件事。它不是让你继续看价格、等消息、猜涨跌，而是把普通人推上场：用起来、组队、冲刺、学习，最后走向建设者。",
      ],
      bullets: ["看客 -> 玩家", "队员 -> 贡献者", "贡献者 -> 建设者"],
    },
    {
      id: "what-is-72h",
      title: "72H 是什么",
      eyebrow: "02 / 固定供应",
      summary: "一枚固定供应代币，一套上场系统。固定供应只是地基，真正的差异在于 900 亿进入赛季玩法池。",
      defaultOpen: true,
      paragraphs: [
        "72H V2 已在 TON 主网发行。链上事实很直接：总量 100,000,000,000 72H，增发开关已关闭，管理员权限已移除。",
        "翻译成人话：1000 亿枚，固定供应，不能再增发，没有管理员后门。这不是一句宣传语，而是 72H 叙事的地基。",
        "但固定供应只是开始。真正让 72H 不一样的，是这 1000 亿枚里有 900 亿被放进赛季玩法池。72H 不是只让你持有，而是给你一条可以真实参与的路径。",
      ],
      bullets: ["1000 亿固定供应", "不能再增发", "900 亿进入赛季系统"],
    },
    {
      id: "season-pool",
      title: "900 亿玩法池",
      eyebrow: "03 / 主引擎",
      summary: "900 亿不是海报数字，而是 72H 的赛季引擎：最多 10 个赛季 x 18 轮 x 每轮 5 亿。",
      defaultOpen: true,
      paragraphs: [
        "72H 的经济模型，最核心的数字只有一个：90,000,000,000 72H。900 亿。",
        "它不是随手写出来的活动数字，也不是一次性发完的分发池。900 亿占总供应的 90%，被设计成最多 10 个赛季、每季 18 轮、每轮 500,000,000 72H 的玩法库存。",
        "这意味着 72H 不想做一波流。它要做的是一轮又一轮的 72 小时冲刺，一次又一次让用户上场，一次又一次让战队集结，一次又一次让排行榜刷新。",
      ],
      bullets: ["90,000,000,000 72H", "10 个赛季 x 18 轮", "每轮 500,000,000 72H"],
    },
    {
      id: "economy",
      title: "经济模型",
      eyebrow: "04 / 分配与战线",
      summary: "90% 给赛季，故事才有重量。每个成功轮次的 5 亿再拆成个人、战队、邀请、榜单四条战线。",
      defaultOpen: true,
      paragraphs: [
        "72H 把最大筹码放在用户参与的战场里，而不是放在一张 PPT 里。900 亿的存在，让 72H 的叙事有重量；固定供应，让 72H 的规则有边界。",
        "每一轮 5 亿 72H，不是开了就发，不是来了就有，不是点一下就进钱包。成功轮次进入用户领取路径；失败轮次不会进入用户领取池，而是进入后续规则处理路径。",
      ],
      bullets: ["不记录空动作", "不记录虚假热度", "只认可按规则完成的动作"],
    },
    {
      id: "path",
      title: "通往财富自由之路",
      eyebrow: "05 / 上场路线",
      summary: "这不是结果承诺，而是一张参与地图：冲刺通行证、有效存入并锁定、战队、排行榜。",
      defaultOpen: false,
      paragraphs: [
        "通往财富自由之路不是收益承诺，更像一张参与地图：告诉普通用户从哪里入场，靠什么留下记录，如何组队冲刺，如何被系统识别。",
        "一个人最难的不是成功，而是开始。冲刺通行证是入场信号，有效存入并锁定是分水岭，战队是行动催化剂，排行榜把身份打出来。",
      ],
      bullets: ["先拿到入场信号", "再用链上动作说话", "最后用战队和排行榜形成身份"],
    },
    {
      id: "wan",
      title: "WAN：真实业务入口",
      eyebrow: "06 / 真实使用",
      summary: "一个代币如果只能交易，最终只能靠情绪续命。WAN 让 72H 从钱包里的数字变成真实服务入口。",
      defaultOpen: false,
      paragraphs: [
        "WAN 是 72H 的真实使用场景之一。它以网页控制台为主，移动端保留网络连接服务和 72H 充值等关键能力。",
        "在 WAN 里，72H 可以关联网络连接服务、流量卡、充值路径、钱包权益、每月基础流量权益，以及持有 72H 对应流量卡权益规则。",
        "这就是 72H 和很多纯叙事项目的区别。它不只问你信不信，它要让你用起来。",
      ],
      bullets: ["网络连接服务", "流量卡与充值路径", "钱包权益与服务入口"],
    },
    {
      id: "season-war",
      title: "赛季战场：把战场摆到你面前",
      eyebrow: "07 / 可视化战场",
      summary: "赛季战场是赛季玩法的展示与导航层，让复杂机制变成用户可感知的战场。",
      defaultOpen: false,
      paragraphs: [
        "用户不应该在文档里迷路。用户应该打开界面就知道：我在哪一轮，我的战队在哪，我离前面差多少，我下一步该做什么。",
        "赛季战场负责让用户看见当前赛季、当前轮次、倒计时、轮次状态、战队排行榜、可领取估算、入口跳转和下一步行动。",
        "这就是 72H 的产品哲学：让行动变得可见，让参与路径更清楚。",
      ],
      bullets: ["当前赛季与轮次", "倒计时与状态", "战队排行榜与下一步行动"],
    },
    {
      id: "builders",
      title: "从用户到建设者",
      eyebrow: "08 / 长期路径",
      summary: "72H 更长期的一点，不是 900 亿玩法池，而是它没有把用户终点设成继续买币。",
      defaultOpen: false,
      paragraphs: [
        "加密行业真正的上层位置，从来不属于只会等消息的人。它属于会理解规则的人，会组织社区的人，会设计产品的人，会写代码的人，会用 AI 工具快速做出应用原型的人。",
        "线上学习、线下训练营、AI 辅助开发、应用模板、任务系统、生态项目实践，这些不是周边业务，而是 72H 的长期护城河。",
        "如果一个项目只能让用户买，它的天花板很低。如果一个项目能把用户训练成建设者，它才可能长出生态。",
      ],
      bullets: ["理解规则", "学习开发", "做出应用", "成为生态贡献者"],
    },
  ],
  economyTable: {
    title: "90% 给赛季，故事才有重量",
    summary: "72H 总供应固定为 100,000,000,000 72H。900 亿进入赛季玩法池；成功轮次不是立刻全额发放，而是在赛季结算、领取名单发布、价格达标并维持后分批解锁。",
    allocationTitle: "总供应分配",
    roundTitle: "每轮 5 亿四条战线",
    allocations: [
      { name: "赛季玩法池", amount: "90,000,000,000 72H", share: "90%", role: "72H 的核心赛季储备" },
      { name: "预售池", amount: "4,500,000,000 72H", share: "4.5%", role: "早期发行与市场启动" },
      { name: "生态池", amount: "4,500,000,000 72H", share: "4.5%", role: "生态应用、合作、后续激励" },
      { name: "开发基金", amount: "500,000,000 72H", share: "0.5%", role: "产品、工具、基础设施和学习支持" },
      { name: "团队释放", amount: "300,000,000 72H", share: "0.3%", role: "团队阶段释放" },
      { name: "早期用户与运营", amount: "200,000,000 72H", share: "0.2%", role: "早期用户和运营活动" },
    ],
    roundAllocations: [
      { lane: "个人有效存入", share: "50%", amount: "250,000,000 72H", meaning: "你自己是否真正上场" },
      { lane: "战队存入", share: "25%", amount: "125,000,000 72H", meaning: "你的队伍是否形成合力" },
      { lane: "邀请 / 新用户", share: "15%", amount: "75,000,000 72H", meaning: "你是否带来真实新参与者" },
      { lane: "排行榜", share: "10%", amount: "50,000,000 72H", meaning: "你是否在公开竞争里冲到前面" },
    ],
  },
  claimUnlock: {
    title: "成功轮次如何领取",
    summary: "每轮 500,000,000 72H 只有在该轮成功后才会进入用户领取路径。一个赛季 18 轮完成并最终确认后，赛季金库会把该赛季所有成功轮次的累计额度转入领取合约；平台发布本赛季领取名单后，用户在领取窗口内按价格分批领取。",
    routeTitle: "链上路径",
    route: "赛季金库 -> 领取合约 -> 用户钱包",
    timingTitle: "领取时间",
    timing: "领取合约开启后，用户有 60 天领取时间。超过窗口仍未领取的部分，还要等待 72 小时转账回滚缓冲期，并确认没有待处理领取转账后，才可能被扫回赛季金库。",
    scheduleTitle: "按价格分批解锁",
    schedule: [
      { price: "$0.01", unlock: "累计 20%", detail: "72H 价格达到并连续保持 72 小时后，最多可领取已分配额度的 20%" },
      { price: "$0.03", unlock: "累计 40%", detail: "第二档价格达标并连续保持 72 小时后，累计可领取 40%" },
      { price: "$0.05", unlock: "累计 60%", detail: "第三档价格达标并连续保持 72 小时后，累计可领取 60%" },
      { price: "$0.07", unlock: "累计 80%", detail: "第四档价格达标并连续保持 72 小时后，累计可领取 80%" },
      { price: "$0.10", unlock: "累计 100%", detail: "第五档价格达标并连续保持 72 小时后，累计可领取 100%" },
    ],
    note: "SeasonClaim 未因合约部署而自动开放；只有官方发布赛季领取名单并开启领取窗口后，用户才可能领取。本节是机制说明，不代表当前可领。也就是说，进入领取名单不等于一次性全部到账。用户每次领取的是当前已解锁额度，扣除此前已领取部分；同时需要有效的领取证明、仍在领取窗口内、链上转账成功，并由用户支付网络手续费。",
  },
  pathSteps: {
    title: "通往财富自由之路",
    summary: "四步不是保证结果，而是把普通用户从看客推向真实参与。",
    steps: [
      { title: "冲刺通行证", kicker: "01", body: "拿到入场信号。它不是资产，不是分发凭证，不是收益证明，而是你开始进入某一轮 72 小时窗口。" },
      { title: "有效存入并锁定", kicker: "02", body: "72H 不相信口嗨。真正有意义的是完成有效存入并锁定，用链上动作证明你在场。" },
      { title: "加入战队", kicker: "03", body: "别做孤狼。战队把个人行动变成集体压力，是行动氛围的放大器，也是普通用户坚持下去的理由。" },
      { title: "冲排行榜", kicker: "04", body: "排行榜让你第一次在项目里拥有可见位置。你不再只是一个地址，你有轮次、战队、邀请、记录和名次。" },
    ],
  },
  closing: {
    title: "别再围观，开始建设。",
    body: "72H 已经把 1000 亿固定供应、900 亿赛季玩法池、72 小时轮次冲刺、通往财富自由之路、冲刺通行证、战队、WAN、赛季战场和建设者路径放在桌面上。",
    bullets: ["别再等消息", "别再只看别人上场", "你的 72 小时已经开始"],
    footerNote: "公开说明，不构成投资建议。玩法规则、领取资格和产品能力以正式公告、链上记录和平台核对为准。",
  },
  share: {
    title: "别再围观，上场",
    subtitle: "900 亿赛季玩法池。72 小时冲刺。从用户到建设者。",
    bullets: ["别再围观，上场", "900 亿赛季玩法池", "72 小时冲刺", "从用户到建设者"],
    footerNote: "公开说明，不构成投资建议。",
  },
} as const;

const greenbookContentEn = {
  hero: {
    eyebrow: "72H Green Book / Action edition",
    title: "Stop Watching. Start Building.",
    lead: "The hard part of crypto is not only volatility. It is believing you are participating while you are still watching from the sidelines. 72H puts real products, fixed 100B supply, a 90B season gameplay pool, 72-hour rounds, Rush Pass, squads, WAN, and the builder path into one map.",
    ctaPrimary: { label: "Join community", href: "/join" },
    ctaSecondary: { label: "View contracts", href: "/contracts" },
  },
  manifesto: {
    kicker: "Observer -> Player -> Squad member -> Contributor -> Builder",
    title: "72H is not a token for staying on the sidelines.",
    body: "It is a system that moves ordinary crypto users into action: real products, 72-hour seasons, a 90B season gameplay pool, squad coordination, valid locks, invitations, leaderboards, online and offline learning, and eventually a path for some users to become builders.",
    ctaLabel: "Your 72 hours have started.",
  },
  quickFacts: [
    {
      label: "Fixed supply",
      value: "100B 72H",
      body: "Total supply is 100,000,000,000 72H. No more 72H can be created.",
    },
    {
      label: "Season engine",
      value: "90B season pool",
      body: "90,000,000,000 72H is assigned to up to 10 seasons and 18 rounds per season.",
    },
    {
      label: "Countdown",
      value: "72-hour sprint",
      body: "Each round is a window. Enter the field or keep watching others enter.",
    },
    {
      label: "Path",
      value: "Pass / Squads / WAN / Builders",
      body: "From Rush Pass and valid deposit to squad races, real usage, and builder learning.",
    },
  ],
  chapters: [
    {
      id: "watchers",
      title: "This is not for spectators",
      eyebrow: "01 / Identity shift",
      summary: "72H starts with a simple conflict: many users think they are participating, while they remain only a metric in someone else's dashboard.",
      defaultOpen: true,
      paragraphs: [
        "You watch charts, enter groups, wait for announcements, and wait for someone else to tell you what to do. You see other people interact on-chain, earn identities, enter allowlists, ship products, and build ecosystems.",
        "You are present, but you are not really on the field. You are a user, a click, an active address, and a number in someone else's report.",
        "72H is designed to break that pattern. It is not about waiting for prices or guessing news. It pushes users to use, team up, sprint, learn, and eventually move toward building.",
      ],
      bullets: ["Observer -> player", "Squad member -> contributor", "Contributor -> builder"],
    },
    {
      id: "what-is-72h",
      title: "What 72H is",
      eyebrow: "02 / Fixed supply",
      summary: "A fixed-supply token and an action system. Fixed supply is the base. The difference is that 90B enters the season gameplay pool.",
      defaultOpen: true,
      paragraphs: [
        "72H V2 is live on TON mainnet. The chain facts are direct: 100,000,000,000 72H total supply, minting disabled, and admin control removed.",
        "In plain language: 100B tokens, fixed supply, no new minting, and no admin backdoor. This is not just a slogan. It is the base layer of the 72H story.",
        "But fixed supply is only the start. What makes 72H different is that 90B of the 100B supply is placed into the season gameplay pool. 72H is not only something to hold. It is designed to move users into action.",
      ],
      bullets: ["100B fixed supply", "No new minting", "90B enters the season system"],
    },
    {
      id: "season-pool",
      title: "The 90B season pool",
      eyebrow: "03 / Main engine",
      summary: "90B is not a poster number. It is the season engine: up to 10 seasons x 18 rounds x 500M per round.",
      defaultOpen: true,
      paragraphs: [
        "The core number in the 72H economic model is 90,000,000,000 72H. 90B.",
        "It is not a random rewards number and not a one-time airdrop. The 90B pool is 90% of total supply and is designed as inventory for up to 10 seasons, 18 rounds per season, and 500,000,000 72H per round.",
        "That means 72H is not built as a one-wave story. It creates repeated 72-hour sprints, repeated squad formation, and repeated leaderboard moments.",
      ],
      bullets: ["90,000,000,000 72H", "10 seasons x 18 rounds", "500,000,000 72H per round"],
    },
    {
      id: "economy",
      title: "Economic model",
      eyebrow: "04 / Allocation and lanes",
      summary: "90% goes to seasons, which gives the story weight. Each successful 500M round is split across individual, squad, invite, and leaderboard lanes.",
      defaultOpen: true,
      paragraphs: [
        "72H puts the largest inventory into user participation instead of leaving it as a vague reserve. The 90B pool gives the story weight. Fixed supply gives the rules a boundary.",
        "Each 500M round is not automatically distributed to everyone. Successful rounds move into user claim paths. Failed rounds do not enter the user claim pool and are handled by later rules.",
      ],
      bullets: ["No reward for empty activity", "No reward for fake heat", "Rewards depend on completed actions and public rules"],
    },
    {
      id: "path",
      title: "Road to Financial Freedom",
      eyebrow: "05 / Action route",
      summary: "This is not a promise of outcome. It is a participation map: Rush Pass, valid deposit and lock, squads, and leaderboard.",
      defaultOpen: false,
      paragraphs: [
        "Road to Financial Freedom is not a guaranteed outcome. It is a map that shows users where to enter, how to leave verifiable records, how to participate with a team, and how the system recognizes participation.",
        "Rush Pass is the entry signal. A valid deposit and lock is the dividing line. Squads turn individual action into group pressure. The leaderboard makes identity visible.",
      ],
      bullets: ["Start with an entry signal", "Prove presence with an on-chain action", "Turn teams and leaderboards into identity"],
    },
    {
      id: "wan",
      title: "WAN: real business entry",
      eyebrow: "06 / Real usage",
      summary: "If a token can only be traded, it depends on emotion. WAN turns 72H from a wallet number into a service entry.",
      defaultOpen: false,
      paragraphs: [
        "WAN is one of the real usage surfaces for 72H. It is a web-first service console, while native clients keep network access service and 72H recharge as key capabilities.",
        "Inside WAN, 72H can connect to network access service, traffic cards, recharge paths, wallet benefits, monthly base traffic, and token-holding benefit rules.",
        "This is the difference between 72H and pure narrative projects. It does not only ask users to believe. It gives them something to use.",
      ],
      bullets: ["Network access service", "Traffic cards and recharge paths", "Wallet benefits and service entry"],
    },
    {
      id: "season-war",
      title: "Season War: show the field clearly",
      eyebrow: "07 / Visual battlefield",
      summary: "Season War is the display and navigation layer for season gameplay. It turns complex mechanics into a field users can read.",
      defaultOpen: false,
      paragraphs: [
        "Users should not get lost in documents. They should open the interface and know: which round am I in, where is my squad, how far am I from the front, and what should I do next.",
        "Season War shows the current season, current round, countdown, round status, squad leaderboard, estimated claim view, entry links, and next action.",
        "This is the product philosophy of 72H: make action visible and participation compelling.",
      ],
      bullets: ["Current season and round", "Countdown and state", "Squad leaderboard and next action"],
    },
    {
      id: "builders",
      title: "From user to builder",
      eyebrow: "08 / Long-term path",
      summary: "The strongest part of 72H is not only the 90B season pool. It is that the endpoint is not just buying more tokens.",
      defaultOpen: false,
      paragraphs: [
        "The upper levels of crypto rarely belong to people who only wait for news. They belong to people who understand rules, organize communities, design products, write code, and use AI tools to ship prototypes quickly.",
        "Online learning, offline training, AI-assisted development, templates, task systems, and ecosystem practice are not side businesses. They are part of the long-term moat.",
        "If a project can only make users buy, its ceiling is low. If it can train users into builders, it can grow an ecosystem.",
      ],
      bullets: ["Understand rules", "Learn development", "Ship applications", "Become ecosystem contributors"],
    },
  ],
  economyTable: {
    title: "90% goes into seasons",
    summary: "Total supply is fixed at 100,000,000,000 72H. 90B goes into the season gameplay pool. Successful rounds are not paid out all at once; they unlock in price-based stages after season finalization and claim-list publication.",
    allocationTitle: "Total supply allocation",
    roundTitle: "Each 500M round across four lanes",
    allocations: [
      { name: "Season gameplay pool", amount: "90,000,000,000 72H", share: "90%", role: "Core season inventory for 72H" },
      { name: "Presale pool", amount: "4,500,000,000 72H", share: "4.5%", role: "Early issuance and market start" },
      { name: "Ecosystem pool", amount: "4,500,000,000 72H", share: "4.5%", role: "Ecosystem apps, partners, and later incentives" },
      { name: "Development fund", amount: "500,000,000 72H", share: "0.5%", role: "Products, tools, infrastructure, and learning support" },
      { name: "Team release", amount: "300,000,000 72H", share: "0.3%", role: "Stage-based team release" },
      { name: "Early users and operations", amount: "200,000,000 72H", share: "0.2%", role: "Early users and operational activities" },
    ],
    roundAllocations: [
      { lane: "Individual valid deposit", share: "50%", amount: "250,000,000 72H", meaning: "Whether you personally entered the field" },
      { lane: "Squad deposit", share: "25%", amount: "125,000,000 72H", meaning: "Whether your team forms real force" },
      { lane: "Invites / new users", share: "15%", amount: "75,000,000 72H", meaning: "Whether you bring real new participants" },
      { lane: "Leaderboard", share: "10%", amount: "50,000,000 72H", meaning: "Whether you can be seen in public competition" },
    ],
  },
  claimUnlock: {
    title: "How successful rounds are claimed",
    summary: "Each 500,000,000 72H round enters the user claim path only if the round succeeds. After all 18 rounds in a season are recorded and finalized, the SeasonVault contract transfers the season's accumulated successful-round amount into the SeasonClaim contract. Once the season claim list is registered, users claim in price-based stages.",
    routeTitle: "On-chain route",
    route: "SeasonVault -> SeasonClaim -> user wallet",
    timingTitle: "Claim window",
    timing: "The SeasonClaim window stays open for 60 days. Unclaimed rewards can only be swept back after that window plus a 72-hour transfer-bounce buffer, and only after pending claim transfers are bounced or settled.",
    scheduleTitle: "Price-based staged unlocks",
    schedule: [
      { price: "$0.01", unlock: "20% cumulative", detail: "After the 72H price reaches this level and holds for 72 hours, up to 20% of the allocation is claimable" },
      { price: "$0.03", unlock: "40% cumulative", detail: "After the second price level holds for 72 hours, up to 40% is claimable" },
      { price: "$0.05", unlock: "60% cumulative", detail: "After the third price level holds for 72 hours, up to 60% is claimable" },
      { price: "$0.07", unlock: "80% cumulative", detail: "After the fourth price level holds for 72 hours, up to 80% is claimable" },
      { price: "$0.10", unlock: "100% cumulative", detail: "After the fifth price level holds for 72 hours, up to 100% is claimable" },
    ],
    note: "SeasonClaim is not open unless an official season claim list and claim window are published. This section explains the mechanism, not current eligibility. Being included in the claim list does not mean the full allocation is immediately paid. Each claim pays the currently unlocked amount minus what was already claimed, and still requires a valid proof, an active claim window, a successful chain transfer, and user-paid network fees.",
  },
  pathSteps: {
    title: "Road to Financial Freedom",
    summary: "Four steps do not guarantee an outcome. They move ordinary users from watching to real participation.",
    steps: [
      { title: "Rush Pass", kicker: "01", body: "Get the entry signal. It is not an asset, an airdrop voucher, or proof of yield. It means you have entered a 72-hour window." },
      { title: "Valid deposit and lock", kicker: "02", body: "72H does not count empty talk. A valid deposit and lock is how you prove presence through an on-chain action." },
      { title: "Join a squad", kicker: "03", body: "Do not play alone. A squad turns individual action into group pressure and gives ordinary users a reason to keep moving." },
      { title: "Push the leaderboard", kicker: "04", body: "The leaderboard gives you a visible position. You are no longer only an address. You have a round, squad, invite record, and rank." },
    ],
  },
  closing: {
    title: "Stop Watching. Start Building.",
    body: "72H puts fixed 100B supply, a 90B season gameplay pool, 72-hour rounds, Road to Financial Freedom, Rush Pass, squads, WAN, Season War, and the builder path on the table.",
    bullets: ["Stop waiting for signals", "Stop only watching others enter", "Your 72 hours have started"],
    footerNote: "Public notes only; not investment advice. Gameplay rules, claim eligibility, and product capabilities depend on official announcements, on-chain records, and platform checks.",
  },
  share: {
    title: "Stop Watching. Start Building.",
    subtitle: "90B season gameplay pool. 72-hour sprint. From user to builder.",
    bullets: ["Stop Watching. Start Building.", "90B season gameplay pool", "72-hour sprint", "From user to builder"],
    footerNote: "Public notes only; not investment advice.",
  },
} as const;

type GreenBookContent = typeof greenbookContentZh | typeof greenbookContentEn;

function withShareMeta(content: GreenBookContent, locale: Locale) {
  return {
    ...content,
    share: {
      ...content.share,
      canonicalUrl: `${SITE_URL}${localizePath("/greenbook", locale)}`,
      shareText: `${content.share.title}: ${content.share.subtitle}`,
    },
  };
}

export const greenbookContent = withShareMeta(greenbookContentZh, "zh-CN");

export function getGreenBookContent(locale: Locale) {
  return locale === "en-US"
    ? withShareMeta(greenbookContentEn, locale)
    : withShareMeta(greenbookContentZh, locale);
}
