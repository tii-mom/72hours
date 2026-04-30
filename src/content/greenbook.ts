import type { Locale } from "../lib/locale";
import { localizePath } from "../lib/routes";

const SITE_URL = "https://72h.lol";

const greenbookContentZh = {
  hero: {
    eyebrow: "72H 绿皮书 / 行动版",
    title: "别再围观，上场",
    lead: "加密世界真正的门槛，不只是波动，而是很多人以为自己在参与，其实仍停留在旁观。72H 把固定供应、赛季机制、72 小时冲刺、战队协作、真实服务入口与建设者路径放在同一张地图里：先理解规则，再决定如何参与。",
    ctaPrimary: { label: "加入社区", href: "/join" },
    ctaSecondary: { label: "查看链上证据", href: "/contracts" },
  },
  manifesto: {
    kicker: "看客 -> 玩家 -> 队员 -> 贡献者 -> 建设者",
    title: "72H 不是让用户继续停留在场外的代币。",
    body: "72H 是一套围绕行动设计的参与系统：固定供应提供边界，赛季机制提供节奏，72 小时轮次提供窗口，战队与排行榜让协作变得可见，WAN 与建设者路径把参与延伸到真实服务和长期生态。",
    ctaLabel: "先了解规则，再进入下一步。",
  },
  quickFacts: [
    {
      label: "固定供应",
      value: "1000 亿 72H",
      body: "总供应 100,000,000,000 72H；供应边界与权限状态以链上记录和官方合约页面为准。",
    },
    {
      label: "赛季引擎",
      value: "900 亿玩法池",
      body: "90,000,000,000 72H 被规划为赛季玩法池，用于最多 10 个赛季、每季 18 轮的参与机制。",
    },
    {
      label: "倒计时",
      value: "72 小时冲刺",
      body: "每一轮都是一个 72 小时窗口：了解规则、完成动作、留下记录。",
    },
    {
      label: "路径",
      value: "通行证 / 战队 / WAN / 建设者",
      body: "从冲刺通行证、有效存入与锁定、战队协作，到 WAN 服务入口和建设者路径。",
    },
  ],
  chapters: [
    {
      id: "watchers",
      title: "先从旁观者身份中醒来",
      eyebrow: "01 / 身份冲突",
      summary: "72H 先处理一个现实问题：很多用户以为自己已经参与项目，其实只是看见了信息，并没有留下可验证的行动记录。",
      defaultOpen: true,
      paragraphs: [
        "你可以每天看行情、进群、等公告、等别人给方向；也可以看见别人交互、组队、获得身份、参与生态。但看见，不等于参与。",
        "在大多数项目里，普通用户往往只是一个地址、一次点击、一个数据点。72H 希望改变这个位置：让用户通过清晰规则、链上动作、战队协作和持续学习，逐步从旁观者走向参与者，再走向贡献者。",
        "这不是要求每个人都成为开发者，而是给普通用户一条更清楚的路径：理解规则、完成动作、组织协作、积累记录，最终有机会进入建设者网络。",
      ],
      bullets: ["看客 -> 玩家", "队员 -> 贡献者", "贡献者 -> 建设者"],
    },
    {
      id: "what-is-72h",
      title: "72H 是什么",
      eyebrow: "02 / 固定供应",
      summary: "72H 是一枚固定供应代币，也是一套围绕赛季、协作和真实服务设计的参与系统。",
      defaultOpen: true,
      paragraphs: [
        "72H V2 已在 TON 主网发行。核心链上事实包括：总供应 100,000,000,000 72H，供应边界固定；关键权限状态以链上记录和官方合约页面为准。",
        "固定供应不是全部故事，它只是规则的地基。72H 更重要的设计，是把 90,000,000,000 72H 规划进赛季玩法池，让参与不只停留在持有，而是进入轮次、战队、锁定、榜单、服务和建设者路径。",
        "因此，72H 更像一个行动系统：用户不是只看价格，而是在公开规则下完成动作、留下记录，并在生态中找到自己的位置。",
      ],
      bullets: ["1000 亿固定供应", "权限状态链上可查", "900 亿进入赛季系统"],
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
        "这意味着 72H 不想只制造一次热度，而是用一轮又一轮 72 小时窗口，让用户反复进入规则、组织战队、完成动作、刷新记录。",
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
      title: "从看见到参与：72H 行动路径",
      eyebrow: "05 / 行动路径",
      summary: "这不是收益承诺，而是一张参与地图：了解规则、获得入场信号、完成有效动作、加入战队、形成公开记录。",
      defaultOpen: false,
      paragraphs: [
        "72H 的行动路径不是对结果的承诺，而是对参与过程的说明。它告诉用户从哪里理解规则，如何进入轮次，哪些动作会被记录，以及如何通过战队和排行榜形成可见身份。",
        "冲刺通行证是入场信号；有效存入与锁定是链上动作；战队让个人行动变成协作；排行榜让参与记录变得公开可见。是否参与、如何参与，始终应由用户在理解规则和风险后自行决定。",
      ],
      bullets: ["先拿到入场信号", "再用链上动作说话", "最后用战队和排行榜形成身份"],
    },
    {
      id: "wan",
      title: "WAN：真实服务入口",
      eyebrow: "06 / 真实使用",
      summary: "如果一个代币只能被交易，它很容易只依赖市场情绪。WAN 让 72H 有机会从钱包数字延伸到具体服务入口。",
      defaultOpen: false,
      paragraphs: [
        "WAN 是 72H 生态中的真实服务入口之一，以网页体验为主，并围绕网络连接服务、流量卡、充值路径和钱包权益等能力展开。",
        "在 WAN 中，72H 可以与服务访问、权益识别、充值路径和持有规则发生连接。具体能力、开放地区、服务条款和可用范围，应以 WAN 页面和官方公告为准。",
        "这让 72H 不只停留在叙事层面。它试图把用户参与连接到真实产品、真实服务和持续使用场景。",
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
        "赛季战场负责展示当前赛季、轮次状态、倒计时、战队排行榜、领取机制提示、入口跳转和下一步行动。",
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
        "加密行业真正的上层位置，从来不属于只会等消息的人。它属于会理解规则的人，会组织社区的人，会设计产品的人，会把想法快速做成可用产品的人。",
        "线上学习、线下训练营、应用模板、任务系统、生态项目实践，这些不是周边业务，而是 72H 的长期护城河。",
        "如果一个项目只能让用户买，它的天花板很低。如果一个项目能把用户训练成建设者，它才可能长出生态。",
      ],
      bullets: ["理解规则", "学习产品", "做出应用", "成为生态贡献者"],
    },
  ],
  economyTable: {
    title: "90% 给赛季，故事才有重量",
    summary: "72H 总供应固定为 100,000,000,000 72H。900 亿被规划为赛季玩法池；成功轮次不是立刻、自动、无条件发放，而是在赛季结算、名单发布、领取窗口和机制阈值等条件满足后进入分批领取。",
    allocationTitle: "总供应分配",
    roundTitle: "每轮 5 亿四条战线",
    allocations: [
      { name: "赛季玩法池", amount: "90,000,000,000 72H", share: "90%", role: "72H 的核心赛季储备" },
      { name: "预售池", amount: "4,500,000,000 72H", share: "4.5%", role: "早期发行与市场启动" },
      { name: "生态池", amount: "4,500,000,000 72H", share: "4.5%", role: "生态应用、合作、后续激励" },
      { name: "建设基金", amount: "500,000,000 72H", share: "0.5%", role: "产品、工具、基础设施和学习支持" },
      { name: "团队释放", amount: "300,000,000 72H", share: "0.3%", role: "团队阶段释放" },
      { name: "早期用户与运营", amount: "200,000,000 72H", share: "0.2%", role: "早期用户和运营活动" },
    ],
    roundAllocations: [
      { lane: "个人有效存入", share: "50%", amount: "250,000,000 72H", meaning: "你自己是否完成有效动作" },
      { lane: "战队存入", share: "25%", amount: "125,000,000 72H", meaning: "你的队伍是否形成合力" },
      { lane: "邀请 / 新用户", share: "15%", amount: "75,000,000 72H", meaning: "你是否带来真实新参与者" },
      { lane: "排行榜", share: "10%", amount: "50,000,000 72H", meaning: "你是否在公开竞争里冲到前面" },
    ],
  },
  claimUnlock: {
    title: "成功轮次如何领取",
    summary: "本节只解释机制，不代表当前已开放领取，也不代表任何地址一定获得分配。每轮 500,000,000 72H 只有在该轮成功并完成后续确认后，才会进入用户领取路径；平台发布本赛季领取名单并开启领取窗口后，符合条件的用户才可能按规则分批领取。",
    routeTitle: "链上路径",
    route: "赛季金库 -> 领取合约 -> 用户钱包",
    timingTitle: "领取时间",
    timing: "领取窗口开启后，用户有 60 天领取时间。超过窗口仍未领取的部分，还要等待 72 小时链上转账确认缓冲期，并确认没有待处理领取转账后，才可能被扫回赛季金库。",
    scheduleTitle: "按机制阈值分批解锁",
    scheduleNotice: "以下价格仅为领取机制中的阶段阈值，用于判断已分配额度的解锁比例；不代表价格预测、价格目标、上市安排或收益承诺。",
    schedule: [
      { price: "$0.01", unlock: "累计 20%", detail: "达到该机制阈值并连续满足 72 小时后，最多可领取已分配额度的 20%" },
      { price: "$0.03", unlock: "累计 40%", detail: "第二档机制阈值连续满足 72 小时后，累计最多可领取 40%" },
      { price: "$0.05", unlock: "累计 60%", detail: "第三档机制阈值连续满足 72 小时后，累计最多可领取 60%" },
      { price: "$0.07", unlock: "累计 80%", detail: "第四档机制阈值连续满足 72 小时后，累计最多可领取 80%" },
      { price: "$0.10", unlock: "累计 100%", detail: "第五档机制阈值连续满足 72 小时后，累计最多可领取 100%" },
    ],
    note: "本节仅解释机制，不代表当前已开放领取，也不代表任何地址一定获得分配。价格档位仅为领取机制中的阶段阈值，不构成价格目标、价格预测、上市安排或收益承诺。实际可领取额度取决于官方名单、有效证明、领取窗口、链上状态、已领取记录和网络手续费等条件。",
  },
  pathSteps: {
    title: "从看见到参与：72H 行动路径",
    summary: "四步不是保证结果，而是帮助普通用户理解规则、完成动作、加入协作并留下公开记录。",
    steps: [
      { title: "冲刺通行证", kicker: "01", body: "拿到入场信号。它不是资产，不是分发凭证，不是收益证明，而是你开始进入某一轮 72 小时窗口。" },
      { title: "有效存入并锁定", kicker: "02", body: "72H 不相信口嗨。真正有意义的是完成有效存入并锁定，用链上动作证明你在场。" },
      { title: "加入战队", kicker: "03", body: "别做孤狼。战队把个人行动变成集体压力，是行动氛围的放大器，也是普通用户坚持下去的理由。" },
      { title: "冲排行榜", kicker: "04", body: "排行榜让你第一次在项目里拥有可见位置。你不再只是一个地址，你有轮次、战队、邀请、记录和名次。" },
    ],
  },
  closing: {
    title: "别再围观，开始理解并参与。",
    body: "72H 把固定供应、900 亿赛季玩法池、72 小时轮次、冲刺通行证、战队协作、WAN 服务入口、赛季战场和建设者路径放在同一张公开地图上。真正重要的不是一句口号，而是用户能否看懂规则、判断风险，并用行动留下记录。",
    bullets: ["先理解规则", "再判断是否参与", "用可验证行动留下记录"],
    footerNote: "本页为公开说明，不构成投资建议、购买建议、收益承诺、价格预测或领取保证。72H 相关玩法规则、领取资格、产品能力、服务范围和时间安排，以正式公告、链上记录、平台核验和适用条款为准。用户应自行理解规则、评估风险，并承担自己的参与决策。",
  },
  share: {
    title: "别再围观，上场",
    subtitle: "900 亿赛季玩法池。72 小时冲刺。从用户到建设者。",
    bullets: ["别再围观，上场", "900 亿赛季玩法池", "72 小时冲刺", "从用户到建设者"],
    footerNote: "公开说明，不构成投资建议、收益承诺、价格预测或领取保证。",
  },
} as const;

const greenbookContentEn = {
  hero: {
    eyebrow: "72H Green Book / Action edition",
    title: "Stop Watching. Start Participating.",
    lead: "The real barrier in crypto is not only volatility. It is mistaking attention for participation. 72H brings fixed supply, season mechanics, 72-hour rounds, squad coordination, real service entry points, and a builder path into one public map: understand the rules first, then decide how to participate.",
    ctaPrimary: { label: "Join community", href: "/join" },
    ctaSecondary: { label: "View on-chain evidence", href: "/contracts" },
  },
  manifesto: {
    kicker: "Observer -> Player -> Squad member -> Contributor -> Builder",
    title: "72H is not a token for staying on the sidelines.",
    body: "72H is an action-oriented participation system. Fixed supply defines the boundary. Seasons define the rhythm. 72-hour rounds create clear windows. Squads and leaderboards make coordination visible. WAN and the builder path extend participation into real services and long-term ecosystem work.",
    ctaLabel: "Understand the rules first, then decide the next step.",
  },
  quickFacts: [
    {
      label: "Fixed supply",
      value: "100B 72H",
      body: "Total supply is 100,000,000,000 72H. Supply boundary and authority status should be verified through on-chain records and official contract pages.",
    },
    {
      label: "Season engine",
      value: "90B season pool",
      body: "90,000,000,000 72H is assigned to up to 10 seasons and 18 rounds per season.",
    },
    {
      label: "Countdown",
      value: "72-hour sprint",
      body: "Each round is a 72-hour window: understand the rules, complete actions, and leave records.",
    },
    {
      label: "Path",
      value: "Pass / Squads / WAN / Builders",
      body: "From Rush Pass, valid deposit and lock, and squad coordination to WAN service entry points and the builder path.",
    },
  ],
  chapters: [
    {
      id: "watchers",
      title: "This is not for spectators",
      eyebrow: "01 / Identity shift",
      summary: "72H starts with a practical problem: many users think they are participating, while they have only seen information and left no verifiable action record.",
      defaultOpen: true,
      paragraphs: [
        "You watch charts, enter groups, wait for announcements, and wait for someone else to tell you what to do. You see other people interact on-chain, earn identities, enter allowlists, ship products, and build ecosystems.",
        "In many projects, ordinary users become an address, a click, or a data point. 72H tries to change that position through clear rules, on-chain actions, squad coordination, and public records.",
        "It is not asking everyone to become a developer. It gives ordinary users a clearer path: understand the rules, complete actions, coordinate with others, accumulate records, and potentially enter the builder network.",
      ],
      bullets: ["Observer -> player", "Squad member -> contributor", "Contributor -> builder"],
    },
    {
      id: "what-is-72h",
      title: "What 72H is",
      eyebrow: "02 / Fixed supply",
      summary: "72H is a fixed-supply token and a participation system built around seasons, coordination, and real service entry points.",
      defaultOpen: true,
      paragraphs: [
        "72H V2 is live on TON mainnet. Core on-chain facts include 100,000,000,000 72H total supply and a fixed supply boundary; authority status should be verified through on-chain records and official contract pages.",
        "Fixed supply is not the whole story. It is the rule base. The more important design is that 90,000,000,000 72H is planned into the season gameplay pool.",
        "72H is therefore closer to an action system: users do not only watch price; they complete actions under public rules, leave records, and find their place in the ecosystem.",
      ],
      bullets: ["100B fixed supply", "Authority status is on-chain", "90B enters the season system"],
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
      title: "From Watching to Participation",
      eyebrow: "05 / Action route",
      summary: "This is not a promise of outcomes. It is a participation map: understand the rules, enter a round, complete valid actions, join a squad, and build a public record.",
      defaultOpen: false,
      paragraphs: [
        "This is not a promise of outcomes. It is a participation map: understand the rules, enter a round, complete valid actions, join a squad, and build a public record.",
        "Rush Pass is the entry signal. A valid deposit and lock is the dividing line. Squads turn individual action into group pressure. The leaderboard makes identity visible.",
      ],
      bullets: ["Start with an entry signal", "Prove presence with an on-chain action", "Turn teams and leaderboards into identity"],
    },
    {
      id: "wan",
      title: "WAN: real service entry",
      eyebrow: "06 / Real usage",
      summary: "If a token can only be traded, it can become dependent on market emotion. WAN gives 72H a path from wallet number to concrete service entry point.",
      defaultOpen: false,
      paragraphs: [
        "WAN is one of the real service entry points in the 72H ecosystem, centered on web experience and connected to network access, traffic cards, recharge paths, and wallet benefits.",
        "Specific capabilities, supported regions, service terms, and availability should follow the WAN page and official announcements.",
        "This keeps 72H from staying only at the narrative layer. It tries to connect user participation with real products, services, and usage contexts.",
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
        "Season War shows the current season, round status, countdown, squad leaderboard, claim-mechanism prompts, entry links, and next action.",
        "This is the product philosophy of 72H: make rules clearer, state more transparent, and action paths more visible.",
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
        "The upper levels of crypto rarely belong to people who only wait for news. They belong to people who understand rules, organize communities, design products, and turn ideas into usable products quickly.",
        "Online learning, offline training, templates, task systems, and ecosystem practice are not side businesses. They are part of the long-term moat.",
        "If a project can only make users buy, its ceiling is low. If it can train users into builders, it can grow an ecosystem.",
      ],
      bullets: ["Understand rules", "Learn development", "Ship applications", "Become ecosystem contributors"],
    },
  ],
  economyTable: {
    title: "90% goes into seasons",
    summary: "Total supply is fixed at 100,000,000,000 72H. 90B is planned as the season gameplay pool. Successful rounds are not automatic or unconditional distributions; they can enter staged claim only after season finalization, list publication, an active claim window, and mechanism-threshold conditions.",
    allocationTitle: "Total supply allocation",
    roundTitle: "Each 500M round across four lanes",
    allocations: [
      { name: "Season gameplay pool", amount: "90,000,000,000 72H", share: "90%", role: "Core season inventory for 72H" },
      { name: "Presale pool", amount: "4,500,000,000 72H", share: "4.5%", role: "Early issuance and market start" },
      { name: "Ecosystem pool", amount: "4,500,000,000 72H", share: "4.5%", role: "Ecosystem apps, partners, and later incentives" },
      { name: "Builder fund", amount: "500,000,000 72H", share: "0.5%", role: "Products, tools, infrastructure, and learning support" },
      { name: "Team release", amount: "300,000,000 72H", share: "0.3%", role: "Stage-based team release" },
      { name: "Early users and operations", amount: "200,000,000 72H", share: "0.2%", role: "Early users and operational activities" },
    ],
    roundAllocations: [
      { lane: "Individual valid deposit", share: "50%", amount: "250,000,000 72H", meaning: "Whether you completed a valid action" },
      { lane: "Squad deposit", share: "25%", amount: "125,000,000 72H", meaning: "Whether your team forms real force" },
      { lane: "Invites / new users", share: "15%", amount: "75,000,000 72H", meaning: "Whether you bring real new participants" },
      { lane: "Leaderboard", share: "10%", amount: "50,000,000 72H", meaning: "Whether you can be seen in public competition" },
    ],
  },
  claimUnlock: {
    title: "How successful rounds are claimed",
    summary: "This section explains the mechanism only. It does not mean claims are currently open or that any address is guaranteed an allocation. Each 500,000,000 72H round can enter the claim path only after the round succeeds and later confirmations are complete; eligible users may claim in stages only after the official list and claim window are published.",
    routeTitle: "On-chain route",
    route: "SeasonVault -> SeasonClaim -> user wallet",
    timingTitle: "Claim window",
    timing: "The claim window stays open for 60 days after it is officially opened. Unclaimed allocations can only be swept back after that window plus a 72-hour on-chain transfer confirmation buffer, and only after pending claim transfers are settled.",
    scheduleTitle: "Mechanism-threshold staged unlocks",
    scheduleNotice: "The price levels below are mechanism thresholds for staged claim availability only. They are not price targets, forecasts, listing plans, or return promises.",
    schedule: [
      { price: "$0.01", unlock: "20% cumulative", detail: "If this mechanism threshold is continuously satisfied for 72 hours, up to 20% of the allocation may be claimable" },
      { price: "$0.03", unlock: "40% cumulative", detail: "If the second mechanism threshold is continuously satisfied for 72 hours, up to 40% may be claimable" },
      { price: "$0.05", unlock: "60% cumulative", detail: "If the third mechanism threshold is continuously satisfied for 72 hours, up to 60% may be claimable" },
      { price: "$0.07", unlock: "80% cumulative", detail: "If the fourth mechanism threshold is continuously satisfied for 72 hours, up to 80% may be claimable" },
      { price: "$0.10", unlock: "100% cumulative", detail: "If the fifth mechanism threshold is continuously satisfied for 72 hours, up to 100% may be claimable" },
    ],
    note: "This section explains the mechanism only. It does not mean claims are currently open, that any address is guaranteed an allocation, or that any price level will be reached. Price levels are mechanism thresholds for staged claim availability only, not price targets, forecasts, listing plans, or return promises. Actual claimable amounts depend on official lists, valid proofs, active windows, on-chain state, prior claims, and network fees.",
  },
  pathSteps: {
    title: "From Watching to Participation",
    summary: "This is not a promise of outcomes. It is a participation map: understand the rules, enter a round, complete valid actions, join a squad, and build a public record.",
    steps: [
      { title: "Rush Pass", kicker: "01", body: "Get the entry signal. It is not an asset, an airdrop voucher, or proof of yield. It means you have entered a 72-hour window." },
      { title: "Valid deposit and lock", kicker: "02", body: "72H does not count empty talk. A valid deposit and lock is how you prove presence through an on-chain action." },
      { title: "Join a squad", kicker: "03", body: "Do not play alone. A squad turns individual action into group pressure and gives ordinary users a reason to keep moving." },
      { title: "Push the leaderboard", kicker: "04", body: "The leaderboard gives you a visible position. You are no longer only an address. You have a round, squad, invite record, and rank." },
    ],
  },
  closing: {
    title: "Understand the rules. Decide your role.",
    body: "72H brings fixed supply, a 90B season gameplay pool, 72-hour rounds, Rush Pass, squads, WAN, Season War, and the builder path into one public map. The point is not a slogan; it is whether users can understand the rules, evaluate the risks, and leave verifiable records through action.",
    bullets: ["Understand the rules", "Decide whether to participate", "Leave records through verifiable action"],
    footerNote: "Public information only. Not investment advice, not a purchase recommendation, not a return promise, not a price forecast, and not a claim guarantee. Gameplay rules, claim eligibility, product capabilities, service availability, and timelines depend on official announcements, on-chain records, platform verification, and applicable terms. Users should understand the rules, evaluate risks, and make their own decisions.",
  },
  share: {
    title: "Stop Watching. Start Participating.",
    subtitle: "90B season gameplay pool. 72-hour sprint. From user to builder.",
    bullets: ["Stop Watching. Start Participating.", "90B season gameplay pool", "72-hour sprint", "From user to builder"],
    footerNote: "Public information only. Not investment advice, not a return promise, not a price forecast, and not a claim guarantee.",
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
