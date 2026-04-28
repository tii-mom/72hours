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
const publicJsonUrl = "/contracts/72h-v2-mainnet.json";
const metadataUrl = "https://gateway.pinata.cloud/ipfs/QmZkjBvKmHhsh56bPbbnwgPL8844eP5Btke6edbRGjPZNw";
const logoUrl = "https://gateway.pinata.cloud/ipfs/QmNzFgWkVCxuJJBym1hoDq5tG4PwFBT8mUMMXdPefb23S4";

const coreContracts = [
  ["V2 Jetton Master", "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg"],
  ["SeasonVault", "EQCdSSWPVbwh9zIzhF5pnxwRKw-I8xc4bS1iyiVcbXKfnWe-"],
  ["SeasonClaim", "EQCYvg-_oFE8q8cweVScna-WDRzDYol-FBwHKuTcAjcFGonS"],
  ["FundVesting", "EQDO0AMsITst5rWGcabJ8OF7Ys079UMPGNOq9H8WtiJakID4"],
  ["DevelopmentFund", "EQAPkdB1YJDEsVixATzfDjf--yl0frlKRkLPYHHUv6nVFkEU"],
  ["PresaleVault", "EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9"],
  ["EcosystemTreasury", "EQARGC33uqypROhxiJMVOeKPYbYRgAEhXUkTxkrK7CrKDP3O"],
  ["TeamVesting", "EQD5PnUEuEUYBt1XktTPlvN7HE5n-AIBI4XiAyd4qUgHasrK"],
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

function AddressRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-line/70 px-4 py-4 last:border-b-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:px-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <code className="break-all rounded-sm border border-line/70 bg-background/55 px-3 py-2 text-xs leading-6 text-foreground sm:text-sm">
        {value}
      </code>
    </div>
  );
}

export default function Contracts() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";

  const copy = {
    kicker: isEnglish ? "Official contracts" : "官方合约",
    title: isEnglish ? "72H V2 is fixed-supply on TON." : "72H V2 已在 TON 固定发行。",
    lead: isEnglish
      ? "The mainnet Jetton master and tokenomics contracts are deployed, verified, and published with open source evidence."
      : "主网 Jetton Master 和代币经济学合约已部署、验收并公开源码证据。",
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
                {isEnglish ? "Core mainnet contracts" : "核心主网合约"}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground">
                {isEnglish ? "Published addresses" : "已公开地址"}
              </h2>
            </div>
            <div>
              {coreContracts.map(([label, value]) => (
                <AddressRow key={label} label={label} value={value} />
              ))}
            </div>
          </SpotlightCard>

          <div className="grid gap-5">
            <SpotlightCard className="page-card flex flex-col gap-4 border-line/70 bg-surface/72 p-5">
              <div className="flex items-center gap-3 text-primary">
                <FileJson className="h-5 w-5" />
                <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
                  {isEnglish ? "Machine readable" : "机器可读"}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                /contracts/72h-v2-mainnet.json
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
                  {isEnglish ? "Source evidence" : "源码证据"}
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
              ? "Wallets and exchanges should verify total supply, mintable=0, admin=null, metadata URI, and public source evidence."
              : "钱包和交易所应核验 total supply、mintable=0、admin=null、metadata URI 和公开源码证据。"}
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
