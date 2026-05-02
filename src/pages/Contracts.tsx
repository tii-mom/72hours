import {
  BadgeCheck,
  Coins,
  ExternalLink,
  FileJson,
  Github,
  ShieldCheck,
} from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { SpotlightCard } from "../components/SpotlightCard";
import { useLocale } from "../lib/locale";

const githubUrl = "https://github.com/tii-mom/72h-capital-contracts";
const publicJsonUrl = "/contracts/72h-v3-mainnet.json";
const metadataUrl = "https://gateway.pinata.cloud/ipfs/QmSzB37bf7BWRLhssq3RxaEdHQgLWb1RqdwGDkaGidFSmC";
const logoUrl = "https://gateway.pinata.cloud/ipfs/QmNzFgWkVCxuJJBym1hoDq5tG4PwFBT8mUMMXdPefb23S4";

const coreContracts = [
  {
    label: "V3 Jetton Master",
    value: "EQAm0twD5SYndyrdIvWyNZ_7oUXlrlGOhUf6iiA7q1ph-GI3",
    statusEn: "Live / fixed supply",
    statusZh: "已上线 / 固定供应",
  },
  {
    label: "SeasonVault",
    value: "EQCkI1atYYWN-2cnJJASJ1nKsu0ZbvCd_EVZQ61KcoIW-13l",
    statusEn: "Deployed / season operations not automatically open",
    statusZh: "已部署 / 赛季运营不自动开放",
  },
  {
    label: "SeasonClaimV2",
    value: "EQDBwNs-eQSUbl0XISsd9b9g-RvaZ-XWDa-PIVoG-wtMsf4b",
    statusEn: "Deployed / claims require official list + window",
    statusZh: "已部署 / 领取需官方名单和窗口",
  },
  {
    label: "FundVesting",
    value: "EQBKuIRplvhYzL9Gbm6GpZqCxMTHApVOZMVs9T1HzXcP7inb",
    statusEn: "Deployed / failed-round vesting custody",
    statusZh: "已部署 / 失败轮锁仓托管",
  },
  {
    label: "DevelopmentFund",
    value: "EQBbRZQj_VJU2r-DAtQcHoDngRC9EBvUHFg4LoB5HXLBv1Yh",
    statusEn: "Deployed / builder fund custody",
    statusZh: "已部署 / 建设基金托管",
  },
  {
    label: "PresaleVault",
    value: "EQDHSwsiQtB3sdoAaOdJi4kCu32GIHM4BtXd-_EtpE96EYXy",
    statusEn: "Deployed / reservation custody",
    statusZh: "已部署 / 预约额度托管",
  },
  {
    label: "EcosystemTreasury",
    value: "EQCy7YpjZJuQAwjCQvQK55dv4p89c5pJUR9vi8nAwoW4a_w7",
    statusEn: "Deployed / ecosystem custody",
    statusZh: "已部署 / 生态资金托管",
  },
  {
    label: "TeamVesting",
    value: "EQC3pNoWZHNmbcazxJV7lzcQH05Zewjl5w1KJhA4OfIPM6cy",
    statusEn: "Deployed / team vesting custody",
    statusZh: "已部署 / 团队锁仓托管",
  },
] as const;

const allocations = [
  ["SeasonVault", "90,000,000,000 72H"],
  ["PresaleVault", "4,500,000,000 72H"],
  ["EcosystemTreasury", "4,500,000,000 72H"],
  ["DevelopmentFund", "500,000,000 72H"],
  ["TeamVesting", "300,000,000 72H"],
  ["Early users / operations", "200,000,000 72H"],
] as const;

function ExternalAction({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={primary ? "page-action" : "page-action-muted"}
    >
      {label}
      <ExternalLink className="ml-2 h-4 w-4" />
    </a>
  );
}

function AddressRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="grid gap-2 border-b border-line/70 px-4 py-4 last:border-b-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:px-5">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 inline-flex rounded-sm border border-primary/20 bg-primary/8 px-2 py-1 text-[11px] font-semibold leading-5 text-primary">
          {status}
        </div>
      </div>
      <a href={`https://tonviewer.com/${value}`} target="_blank" rel="noreferrer" className="group block">
        <code className="block break-all rounded-sm border border-line/70 bg-background/55 px-3 py-2 text-xs leading-6 text-foreground transition-colors group-hover:border-primary/30 sm:text-sm">
          {value}
        </code>
      </a>
    </div>
  );
}

export default function Contracts() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";

  const copy = {
    kicker: isEnglish ? "On-chain evidence" : "链上证据",
    title: isEnglish ? "72H V3 on-chain facts." : "72H V3 的链上事实。",
    lead: isEnglish
      ? "This page collects the Green Book on-chain facts: mainnet Jetton master, supply checks, tokenomics contract addresses, and source evidence."
      : "绿皮书引用的主网 Jetton Master、供应核验、合约地址与源码证据集中在这里。",
    noteLabel: isEnglish ? "Supply verification" : "供应验证",
    noteTitle: isEnglish ? "No mint authority remains." : "不存在剩余增发权限。",
    noteBody: isEnglish
      ? "Mainnet getter verification confirmed total supply 100B 72H, mintable=0, and admin=null."
      : "主网 getter 已确认总供应 1000 亿 72H，mintable=0，admin=null。",
    status: isEnglish ? "Mainnet verified" : "主网已验收",
    fixedSupply: isEnglish ? "Fixed supply" : "固定供应",
    noAdmin: isEnglish ? "admin = null" : "admin = null",
  };

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={copy.kicker}
        icon={<ShieldCheck size={30} />}
        title={copy.title}
        lead={copy.lead}
        noteLabel={copy.noteLabel}
        noteTitle={copy.noteTitle}
        noteBody={copy.noteBody}
        titleClassName="max-w-[16ch]"
        chips={[copy.status, copy.fixedSupply, copy.noAdmin].map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs"
          >
            {chip}
          </span>
        ))}
      />

      <section className="page-section-tight">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: <Coins className="h-5 w-5" />,
              label: isEnglish ? "Total supply" : "总供应",
              value: "100,000,000,000 72H",
              body: "100000000000000000000 raw",
            },
            {
              icon: <BadgeCheck className="h-5 w-5" />,
              label: isEnglish ? "Mint status" : "铸造状态",
              value: "mintable = 0",
              body: isEnglish ? "Mint authority removed." : "增发权限已移除。",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              label: isEnglish ? "Admin" : "管理员",
              value: "admin = null",
              body: isEnglish ? "No admin address remains on the Jetton master." : "Jetton Master 上不存在管理员地址。",
            },
          ].map((item) => (
            <SpotlightCard key={item.label} className="page-card flex h-full flex-col gap-3 border-line/70 bg-surface/72 p-5">
              <div className="flex items-center gap-3 text-primary">
                {item.icon}
                <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
                  {item.label}
                </span>
              </div>
              <div className="text-2xl font-black tracking-normal text-foreground sm:text-3xl">
                {item.value}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className="page-section-tight pt-0">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.72fr)]">
          <SpotlightCard className="page-card overflow-hidden border-line/70 bg-surface/72">
            <div className="border-b border-line/70 px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
                {isEnglish ? "Core on-chain records" : "核心链上记录"}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground">
                {isEnglish ? "Published addresses" : "已公开地址"}
              </h2>
            </div>
            <div>
              {coreContracts.map((contract) => (
                <AddressRow
                  key={contract.label}
                  label={contract.label}
                  value={contract.value}
                  status={isEnglish ? contract.statusEn : contract.statusZh}
                />
              ))}
            </div>
          </SpotlightCard>

          <div className="grid gap-5">
            <SpotlightCard className="page-card flex flex-col gap-4 border-line/70 bg-surface/72 p-5">
              <div className="flex items-center gap-3 text-primary">
                <FileJson className="h-5 w-5" />
                <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
                  {isEnglish ? "Official record" : "官网记录"}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                /contracts/72h-v3-mainnet.json
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {isEnglish
                  ? "Wallets, exchanges, and apps can read the public JSON from the official site."
                  : "钱包、交易所和应用可以从官网读取这份公开 JSON。"}
              </p>
              <div className="page-chip-row">
                <ExternalAction href={publicJsonUrl} label={isEnglish ? "Open JSON" : "打开 JSON"} primary />
              </div>
            </SpotlightCard>

            <SpotlightCard className="page-card flex flex-col gap-4 border-line/70 bg-surface/72 p-5">
              <div className="flex items-center gap-3 text-primary">
                <Github className="h-5 w-5" />
                <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
                  {isEnglish ? "Public source" : "公开源码"}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                tii-mom/72h-capital-contracts
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {isEnglish
                  ? "The public repository contains source code, deployment plans, audit artifacts, and final mainnet evidence."
                  : "公开仓库包含源码、部署计划、审计产物和最终主网证据。"}
              </p>
              <div className="page-chip-row">
                <ExternalAction href={githubUrl} label="GitHub" primary />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <section className="page-section-tight pt-0">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <SpotlightCard className="page-card flex flex-col gap-4 border-line/70 bg-surface/72 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
              {isEnglish ? "Metadata" : "元数据"}
            </p>
            <h2 className="text-2xl font-black tracking-normal text-foreground">
              {isEnglish ? "Token display assets" : "代币展示资料"}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {isEnglish
                ? "The metadata and logo are pinned to IPFS and referenced by the Jetton master."
                : "元数据和 logo 已固定到 IPFS，并由 Jetton Master 引用。"}
            </p>
            <div className="page-chip-row">
              <ExternalAction href={metadataUrl} label={isEnglish ? "Metadata" : "元数据"} />
              <ExternalAction href={logoUrl} label="Logo" />
            </div>
          </SpotlightCard>

          <SpotlightCard className="page-card overflow-hidden border-line/70 bg-surface/72">
            <div className="border-b border-line/70 px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
                {isEnglish ? "Allocation" : "分配"}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground">
                {isEnglish ? "Verified supply split" : "已验收供应分配"}
              </h2>
            </div>
            <div>
              {allocations.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-2 border-b border-line/70 px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center sm:px-5"
                >
                  <div className="font-semibold text-foreground">{label}</div>
                  <div className="font-mono text-xs text-primary sm:text-right">{value}</div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </section>

      <section className="page-section-tight pb-20 sm:pb-28">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "Verification" : "核验"}
            title={isEnglish ? "Use the Jetton master, not screenshots." : "请以 Jetton Master 为准，不以截图为准。"}
            body={isEnglish
              ? "Wallets and exchanges should verify supply, mint authority, admin status, metadata URI, and public source records."
              : "钱包和交易所应核验供应量、增发权限、管理员状态、metadata URI 与公开源码记录。"}
            actions={[
              { label: isEnglish ? "Open public JSON" : "打开公开 JSON", href: publicJsonUrl, external: true, variant: "primary" },
              { label: "GitHub", href: githubUrl, external: true },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
