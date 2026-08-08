"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

type CardItem = {
  key: string;
  zh: string;
  en: string;
  src: string;
  description: Record<Locale, string>;
};

type InformationBlock = {
  key: string;
  src: string;
  label: string;
};

type ScoreTable = {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

const lowInformationBlocks: InformationBlock[] = [
  { key: "low-1223", src: "/images/cdn/low-1223.1sfqv0ir8v.webp", label: "Low-level information block" },
  { key: "low-1224", src: "/images/cdn/low-1224.1ow4xapoj2.webp", label: "Low-level information block" },
  { key: "low-1227", src: "/images/cdn/low-1227.9ddnz7pkdm.webp", label: "Low-level information block" },
  { key: "low-1228", src: "/images/cdn/low-1228.3d5huhfyp8.webp", label: "Low-level information block" },
  { key: "low-1234", src: "/images/cdn/low-1234.51euro68vf.webp", label: "Low-level information block" },
  { key: "low-1235", src: "/images/cdn/low-1235.6wrfkaioh4.webp", label: "Low-level information block" },
  { key: "low-1236", src: "/images/cdn/low-1236.8okef721d1.webp", label: "Low-level information block" },
  { key: "low-1237", src: "/images/cdn/low-1237.45idc7wkfd.webp", label: "Low-level information block" },
];

const highInformationBlocks: InformationBlock[] = [
  { key: "high-1225", src: "/images/cdn/high-1225.8hh6jreqv6.webp", label: "High-level information block" },
  { key: "high-1226", src: "/images/cdn/high-1226.9gx9wxhi15.webp", label: "High-level information block" },
  { key: "high-1229", src: "/images/cdn/high-1229.96ag3s29vl.webp", label: "High-level information block" },
  { key: "high-1233", src: "/images/cdn/high-1233.lwfmespkw.webp", label: "High-level information block" },
  { key: "high-1238", src: "/images/cdn/high-1238.7ehh8viwzj.webp", label: "High-level information block" },
];

const scoreTables: ScoreTable[] = [
  {
    key: "credit-score-table",
    src: "/images/cdn/credit-score-table.60uy4ty9iz.webp",
    width: 1094,
    height: 1094,
    alt: { zh: "Credit score table", en: "Credit score table" },
    title: { zh: "Credit score table", en: "Credit score table" },
    description: {
      zh: "由中立角色 Wisdom Brain 负责记录玩家的信用变化与回合状态。",
      en: "Used by the neutral Wisdom Brain role to track credit changes and round state.",
    },
  },
  {
    key: "information-value-score-table",
    src: "/images/cdn/information-value-score-table.2dpehb2h1b.webp",
    width: 1341,
    height: 493,
    alt: { zh: "Information value score table", en: "Information value score table" },
    title: { zh: "Information value score table", en: "Information value score table" },
    description: {
      zh: "用于记录信息点变化，方便主持人快速核对每位玩家的分值。",
      en: "Tracks information point changes so the host can quickly verify each player's score.",
    },
  },
];

const roleCards: CardItem[] = [
  {
    key: "hacker",
    zh: "黑客",
    en: "Hacker",
    src: "/images/cdn/cyber-character-hacker.64ek2hpqlq.webp",
    description: {
      zh: "窃取用户信息、攻击公司系统，并在不被发现的前提下扩大影响。",
      en: "Steal user information, attack company systems, and expand influence without being discovered.",
    },
  },
  {
    key: "user",
    zh: "网民",
    en: "User",
    src: "/images/cdn/cyber-character-user.4cll7l6dpl.webp",
    description: {
      zh: "选择公司获取信息点，识别隐藏的黑客，并通过举报追回信息。",
      en: "Choose companies for information points, identify hidden hackers, and recover data through reporting.",
    },
  },
  {
    key: "company",
    zh: "公司",
    en: "Company",
    src: "/images/cdn/cyber-character-company.pg1k2al7z.webp",
    description: {
      zh: "提交信息块、累积信任值，并在关键回合开启防火墙抵御攻击。",
      en: "Submit information blocks, build trust, and activate firewall skills in key rounds.",
    },
  },
  {
    key: "brain",
    zh: "智慧大脑",
    en: "Wisdom Brain",
    src: "/images/cdn/cyber-character-brain.9kgvukzdo0.webp",
    description: {
      zh: "负责主持与计分，整理信息流程，不加入任何阵营。",
      en: "Host and score the game, organize information flow, and stay outside any faction.",
    },
  },
];

const roleSkillCards: CardItem[] = [
  {
    key: "company-firewall",
    zh: "防火墙卡",
    en: "Firewall card",
    src: "/images/cdn/cyber-ability-firewall.3yf5gpehvw.webp",
    description: {
      zh: "公司在第四回合仍然存活时获得，可建立防火墙抵挡一次攻击。",
      en: "Granted when the company survives to round four; it can build a firewall to block one attack.",
    },
  },
  {
    key: "hacker-attack",
    zh: "攻击卡",
    en: "Attack cards",
    src: "/images/cdn/cyber-ability-attack.3d5huf3mk6.webp",
    description: {
      zh: "黑客在第三回合仍然存活时获得，可突破防火墙并发动攻击。",
      en: "Granted when the hacker survives to round three; it can breach firewalls and launch attacks.",
    },
  },
  {
    key: "user-hearsay",
    zh: "小道消息卡",
    en: "Hearsay",
    src: "/images/cdn/cyber-ability-hearsay.1e9b42y48k.webp",
    description: {
      zh: "网民在第五回合仍然存活时获得，可根据线索推断在场身份。",
      en: "Granted when the user survives to round five; it helps infer identities from clues.",
    },
  },
];

const privacyCards: CardItem[] = [
  {
    key: "privacy-browsing-history",
    zh: "获取浏览历史",
    en: "Get browsing history",
    src: "/images/cdn/cyber-privacy-low-browsing-history.1app6dtv18.webp",
    description: {
      zh: "低等级隐私协议卡。用户提供低等级信息，计 1 个信息点。",
      en: "Lower-level privacy agreement card. The user provides low-level information worth 1 information point.",
    },
  },
  {
    key: "privacy-network-info",
    zh: "获取网络信息",
    en: "Obtain network information",
    src: "/images/cdn/cyber-privacy-low-network-info.et7qxk6l7.webp",
    description: {
      zh: "低等级隐私协议卡。用户提供低等级信息，计 1 个信息点。",
      en: "Lower-level privacy agreement card. The user provides low-level information worth 1 information point.",
    },
  },
  {
    key: "privacy-address",
    zh: "提供具体地址信息",
    en: "Provide specific address information",
    src: "/images/cdn/cyber-privacy-high-address.32io1ad7xc.webp",
    description: {
      zh: "高等级隐私协议卡。用户提供高等级信息，计 2 个信息点。",
      en: "Higher-level privacy agreement card. The user provides high-level information worth 2 information points.",
    },
  },
  {
    key: "privacy-identity",
    zh: "提供身份验证信息",
    en: "Provide personal information for verification of identity",
    src: "/images/cdn/cyber-privacy-high-identity.2ksmcpbuca.webp",
    description: {
      zh: "高等级隐私协议卡。内容涉及身份证等敏感个人信息，计 2 个信息点。",
      en: "Higher-level privacy agreement card involving sensitive personal information such as ID cards, worth 2 information points.",
    },
  },
];

const ordinaryCards: CardItem[] = [
  {
    key: "same-attribution",
    zh: "同归于尽卡",
    en: "Same Attribution Card",
    src: "/images/cdn/cyber-skill-perish-together.8dxkm04qdj.webp",
    description: {
      zh: "清空对方与自己的数值；当场上只剩黑客和另一名玩家时，黑客可凭此获得胜利。",
      en: "Zeros the value of the other party and oneself; when only the hacker and one other player remain, the hacker can win with this card.",
    },
  },
  {
    key: "average-information",
    zh: "平均信息卡",
    en: "Average Information",
    src: "/images/cdn/cyber-skill-average-info.83aqsupi89.webp",
    description: {
      zh: "所有网民的信息点会被平均分配。",
      en: "All users share the information points equally.",
    },
  },
  {
    key: "firewall",
    zh: "防火墙卡",
    en: "Firewall card",
    src: "/images/cdn/cyber-skill-firewall.2oc8afacui.webp",
    description: {
      zh: "无论哪一方抽到这张卡，公司都可以建立一次防火墙，抵挡单次攻击。",
      en: "Regardless of who draws it, the company can set up a firewall to block a single attack.",
    },
  },
  {
    key: "replace",
    zh: "替换卡",
    en: "Replace card",
    src: "/images/cdn/cyber-skill-replace.2vfg5uwia0.webp",
    description: {
      zh: "可以和另一位网民交换手中全部卡牌。",
      en: "You can exchange all cards in hand with another user.",
    },
  },
];

const eventCards: CardItem[] = [
  {
    key: "event-security-vulnerability",
    zh: "安全漏洞攻击",
    en: "Security vulnerability attack",
    src: "/images/cdn/cyber-event-security-vulnerability.1e9b43d08m.webp",
    description: {
      zh: "黑客利用系统安全漏洞发动攻击，用户信息泄露，黑客信息值 +1，用户信息值 -1，公司信任值 -1。",
      en: "A hacker attack caused by security system vulnerabilities leaks user information. Hacker information value +1, user information value -1, company trust value -1.",
    },
  },
  {
    key: "event-photo-leak",
    zh: "私人照片泄露",
    en: "Private photo leak",
    src: "/images/cdn/cyber-event-photo-leak.9rk3q10f3r.webp",
    description: {
      zh: "公司因软件漏洞泄露用户私人照片，用户信息值 -1，公司信任值 -1。",
      en: "The company leaks the user's private photos due to software vulnerabilities. User information value -1, company trust value -1.",
    },
  },
  {
    key: "event-privacy-law",
    zh: "隐私保护法完善",
    en: "Privacy protection law improved",
    src: "/images/cdn/cyber-event-privacy-law.7axvb3tj78.webp",
    description: {
      zh: "网络隐私保护法律完善，平台监管加强，所有玩家本轮不能前往信息泄露盒抽取信息点。",
      en: "Network privacy protection law is improved and platform supervision increases. All players cannot go to the information disclosure box to draw information points this round.",
    },
  },
  {
    key: "event-awareness",
    zh: "隐私保护意识增强",
    en: "Privacy awareness strengthened",
    src: "/images/cdn/cyber-event-awareness.99u21fz1iw.webp",
    description: {
      zh: "用户增强隐私保护意识，下一轮市民不需要提供信息点。",
      en: "Users strengthen their awareness of privacy protection, and citizens do not need to provide information points in the next round.",
    },
  },
];

const finalShowcaseImages = [
  {
    key: "board",
    src: "/images/cdn/cyber-showcase-board.99u21hatxl.webp",
    alt: {
      zh: "CYBER WARFARE 棋盘与卡牌实物展示",
      en: "CYBER WARFARE board and cards physical showcase",
    },
  },
  {
    key: "cards",
    src: "/images/cdn/cyber-showcase-cards.2h90f0kmiv.webp",
    alt: {
      zh: "CYBER WARFARE 技能卡与事件卡实物展示",
      en: "CYBER WARFARE skill and event cards physical showcase",
    },
  },
  {
    key: "tokens",
    src: "/images/cyber-showcase-tokens.png",
    alt: {
      zh: "CYBER WARFARE 信息块实物展示",
      en: "CYBER WARFARE information blocks physical showcase",
    },
  },
  {
    key: "hands",
    src: "/images/cdn/cyber-showcase-hands.4xv8txrifc.webp",
    alt: {
      zh: "玩家手中的 CYBER WARFARE 信息块",
      en: "CYBER WARFARE information blocks in a player's hands",
    },
  },
  {
    key: "manual",
    src: "/images/cdn/cyber-showcase-manual.2h90f0kmiu.webp",
    alt: {
      zh: "CYBER WARFARE 说明书与角色卡实物展示",
      en: "CYBER WARFARE manual and character cards physical showcase",
    },
  },
];

const roleTone = {
  border: "#f2b13f",
  borderSoft: "rgba(242, 177, 63, 0.34)",
  glow: "rgba(242, 177, 63, 0.42)",
  title: "#f2b13f",
};

const skillTone = {
  border: "#9fdfff",
  borderSoft: "rgba(159, 223, 255, 0.34)",
  glow: "rgba(159, 223, 255, 0.42)",
  title: "#9fdfff",
};

const privacyTone = {
  border: "#9a4dff",
  borderSoft: "rgba(154, 77, 255, 0.34)",
  glow: "rgba(154, 77, 255, 0.42)",
  title: "#9a4dff",
};

const eventTone = {
  border: "#ff3f82",
  borderSoft: "rgba(255, 63, 130, 0.34)",
  glow: "rgba(255, 63, 130, 0.42)",
  title: "#ff3f82",
};

const blockPositions = [
  { left: "6%", top: "12%", rotate: "-12deg", scale: 0.92 },
  { left: "28%", top: "2%", rotate: "8deg", scale: 1.04 },
  { left: "56%", top: "11%", rotate: "-5deg", scale: 0.95 },
  { left: "16%", top: "44%", rotate: "13deg", scale: 1 },
  { left: "45%", top: "38%", rotate: "-14deg", scale: 1.08 },
  { left: "69%", top: "43%", rotate: "9deg", scale: 0.9 },
  { left: "36%", top: "67%", rotate: "3deg", scale: 0.94 },
  { left: "78%", top: "5%", rotate: "15deg", scale: 0.82 },
  { left: "3%", top: "70%", rotate: "-8deg", scale: 0.84 },
  { left: "62%", top: "70%", rotate: "-12deg", scale: 0.88 },
  { left: "83%", top: "69%", rotate: "10deg", scale: 0.8 },
  { left: "3%", top: "37%", rotate: "7deg", scale: 0.78 },
  { left: "80%", top: "32%", rotate: "-4deg", scale: 0.78 },
];

function modulo(index: number, length: number) {
  return ((index % length) + length) % length;
}

function shortestDelta(index: number, activeIndex: number, length: number) {
  let delta = index - activeIndex;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

function CardTypeTag({
  count,
  locale,
}: {
  count: number;
  locale: Locale;
}) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-line bg-white px-3 py-1.5 font-sans text-xs font-semibold text-fg">
      {locale === "zh" ? `共 ${count} 种卡` : `${count} card types total`}
    </span>
  );
}

function CardCarousel({
  cards,
  locale,
  tone,
}: {
  cards: CardItem[];
  locale: Locale;
  tone: typeof roleTone;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => modulo(current + 1, cards.length));
    }, 3400);

    return () => window.clearInterval(timer);
  }, [cards.length]);

  const activeCard = cards[activeIndex];

  return (
    <div>
      <div className="relative h-[430px] overflow-visible sm:h-[590px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(72vw,290px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(30vw,350px)]"
        >
          <span
            className="block aspect-[412/577] rounded-[14px]"
            style={{
              border: `5px solid ${tone.border}`,
              boxShadow: `0 0 0 1px ${tone.borderSoft}, 0 0 34px ${tone.glow}, 0 20px 48px rgba(0,0,0,0.16)`,
            }}
          />
        </div>

        {cards.map((card, index) => {
          const delta = shortestDelta(index, activeIndex, cards.length);
          if (Math.abs(delta) > 1) return null;

          const isActive = delta === 0;
          const x = `${delta * 86}%`;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={isActive}
              className="absolute left-1/2 top-1/2 w-[min(64vw,270px)] transition-[transform,opacity,filter] duration-500 ease-[0.22,1,0.36,1] sm:w-[min(28vw,320px)]"
              style={{
                transform: `translate(-50%, -50%) translateX(${x}) scale(${isActive ? 1 : 0.84})`,
                opacity: isActive ? 1 : 0.36,
                zIndex: isActive ? 3 : 2,
                filter: isActive ? "saturate(1) brightness(1)" : "saturate(0.35) brightness(0.76)",
              }}
            >
              <span className="sr-only">{card.zh}</span>
              <span className="relative block aspect-[412/577] overflow-hidden rounded-[8px]">
                <span className="relative block h-full w-full overflow-hidden rounded-[8px]">
                  <Image
                    src={card.src}
                    alt={card.zh}
                    fill
                    sizes="(max-width: 767px) 58vw, 320px"
                    className="object-contain"
                    unoptimized
                    priority={index === activeIndex}
                  />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5 sm:gap-4">
        <span className="font-sans text-xs font-semibold text-muted">
          {activeIndex + 1} / {cards.length}
        </span>
        <div className="flex items-center gap-2">
          {cards.map((card, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={
                  locale === "zh"
                    ? `切换到第 ${index + 1} 种卡`
                    : `Show card type ${index + 1}`
                }
                aria-current={isActive}
                className="h-2.5 rounded-full transition-[width,background-color,opacity] duration-300"
                style={{
                  width: isActive ? 22 : 10,
                  backgroundColor: isActive ? tone.title : "rgba(0,0,0,0.22)",
                  opacity: isActive ? 1 : 0.58,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-2xl text-center sm:mt-5">
        <h4 className="display text-xl sm:text-3xl" style={{ color: tone.title }}>
          {activeCard.zh}
        </h4>
        <p className="mt-1 text-xs font-semibold text-muted sm:text-sm">{activeCard.en}</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
          {activeCard.description[locale]}
        </p>
      </div>
    </div>
  );
}

function InformationBlockTray({
  title,
  subtitle,
  blocks,
  emptyLabel,
  high,
}: {
  title: string;
  subtitle: string;
  blocks: InformationBlock[];
  emptyLabel?: string;
  high?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="display text-xl sm:text-3xl">{title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full border border-line px-3 py-1.5 font-sans text-[11px] font-semibold text-fg">
          {high ? "2 pts" : "1 pt"}
        </span>
      </div>

      <div className="relative mt-4 h-[220px] rounded-2xl bg-bg-gray sm:mt-5 sm:h-[310px]">
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_center,rgba(0,0,0,0.13)_1px,transparent_1px)] [background-size:18px_18px]" />
        {blocks.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs leading-relaxed text-muted sm:text-sm">
            {emptyLabel}
          </div>
        ) : null}
        {blocks.map((block, index) => {
          const position = blockPositions[index % blockPositions.length];

          return (
            <span
              key={block.key}
              className="absolute block rounded-full shadow-[0_14px_24px_rgba(0,0,0,0.14)]"
              style={{
                left: position.left,
                top: position.top,
                transform: `rotate(${position.rotate}) scale(${position.scale})`,
              }}
            >
              <Image
                src={block.src}
                alt={block.label}
                width={96}
                height={96}
                className="h-16 w-16 rounded-full object-contain sm:h-24 sm:w-24"
                unoptimized
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ScoreTableShowcase({ locale }: { locale: Locale }) {
  const creditLabel = locale === "zh" ? "信用分计分表" : "Credit score table";
  const informationLabel =
    locale === "zh" ? "信息点计分表" : "Information value score table";

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <div className="grid gap-5 lg:hidden">
        {scoreTables.map((table, index) => {
          const isCredit = index === 0;
          const label = isCredit ? creditLabel : informationLabel;
          const arrowSrc = isCredit
            ? "/images/cyber-score-tables/arrow-credit.svg"
            : "/images/cyber-score-tables/arrow-information.svg";

          return (
            <div key={table.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={arrowSrc}
                  alt=""
                  width={isCredit ? 251 : 328}
                  height={isCredit ? 183 : 120}
                  className="h-auto w-10 shrink-0 opacity-95"
                  unoptimized
                />
                <span className="text-sm font-medium leading-tight tracking-[-0.01em] text-black">
                  {label}
                </span>
              </div>
              <div className="overflow-hidden rounded-[18px] border border-line bg-white p-2 shadow-sm">
                <Image
                  src={table.src}
                  alt={table.alt[locale]}
                  width={table.width}
                  height={table.height}
                  sizes="100vw"
                  className="h-auto w-full object-contain"
                  unoptimized
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="relative hidden overflow-visible lg:block"
        style={{ aspectRatio: "658 / 375.458" }}
      >
        <div
          className="absolute left-0 top-[10.6%] z-10"
          style={{ width: "55.55%", transform: "rotate(-5.07deg)" }}
        >
          <Image
            src={scoreTables[0].src}
            alt={scoreTables[0].alt[locale]}
            width={scoreTables[0].width}
            height={scoreTables[0].height}
            sizes="(max-width: 1023px) 56vw, 720px"
            className="h-auto w-full object-contain"
            unoptimized
          />
        </div>

        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: "71.7%",
            top: "10.6%",
            width: "11.8%",
            transform: "rotate(-21deg)",
          }}
        >
          <Image
            src="/images/cyber-score-tables/arrow-information.svg"
            alt=""
            width={328}
            height={120}
            className="h-auto w-full opacity-95"
            unoptimized
          />
        </div>

        <div
          className="pointer-events-none absolute z-30 whitespace-nowrap text-[28px] font-normal leading-[1.2] tracking-[-0.01em] text-black"
          style={{ left: "83.8%", top: "2.0%" }}
        >
          {informationLabel}
        </div>

        <div
          className="absolute left-[45.0%] top-[15.7%] z-20"
          style={{ width: "52.84%", transform: "rotate(6.94deg)" }}
        >
          <Image
            src={scoreTables[1].src}
            alt={scoreTables[1].alt[locale]}
            width={scoreTables[1].width}
            height={scoreTables[1].height}
            sizes="(max-width: 1023px) 53vw, 620px"
            className="h-auto w-full object-contain"
            unoptimized
          />
        </div>

        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: "43.4%",
            top: "82.7%",
            width: "16.8%",
            transform: "rotate(0deg)",
          }}
        >
          <Image
            src="/images/cyber-score-tables/arrow-credit.svg"
            alt=""
            width={251}
            height={183}
            className="h-auto w-full opacity-95"
            unoptimized
          />
        </div>

        <div
          className="pointer-events-none absolute z-30 whitespace-nowrap text-[28px] font-normal leading-[1.2] tracking-[-0.01em] text-black"
          style={{ left: "61.6%", top: "84.0%" }}
        >
          {creditLabel}
        </div>
      </div>
    </div>
  );
}

function FinalShowcaseCarousel({ locale }: { locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => modulo(current + 1, finalShowcaseImages.length));
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] border border-line bg-black">
        {finalShowcaseImages.map((image, index) => (
          <Image
            key={image.key}
            src={image.src}
            alt={image.alt[locale]}
            fill
            sizes="(max-width: 767px) 100vw, 1152px"
            className={`object-cover transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
            unoptimized
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <span className="font-sans text-xs font-semibold text-muted">
          {activeIndex + 1} / {finalShowcaseImages.length}
        </span>
        <div className="flex items-center gap-2">
          {finalShowcaseImages.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={image.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={
                  locale === "zh"
                    ? `切换到第 ${index + 1} 张展示图`
                    : `Show showcase image ${index + 1}`
                }
                aria-current={isActive}
                className="h-2.5 rounded-full transition-[width,background-color,opacity] duration-300"
                style={{
                  width: isActive ? 22 : 10,
                  backgroundColor: isActive ? "#111111" : "rgba(0,0,0,0.22)",
                  opacity: isActive ? 1 : 0.58,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CyberGameComponents({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";

  return (
    <section data-nav-theme="light" className="theme-light bg-bg-gray">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="max-w-[260px]">
            <p className="kicker">{isZh ? "GAME COMPONENTS" : "GAME COMPONENTS"}</p>
            <h2 className="display mt-4 max-w-[10ch] text-3xl leading-[1.15] sm:text-5xl">
              {isZh ? "游戏组成" : "Game components"}
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-lg lg:pt-6">
            {isZh
              ? "游戏由多个功能不同的卡组和配件共同构成，包括角色卡、隐私协议卡、技能卡、事件卡与信息块。卡组用轮播展示，信息块则以散落的配件形式呈现。"
              : "The game is built from card sets and physical components, including character cards, privacy agreement cards, skill cards, event cards, and information blocks. Card sets use carousel displays, while information blocks are shown as scattered game pieces."}
          </p>
        </div>

        <div className="mt-10 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="font-sans text-xs text-muted">01</span>
              <h3 className="display mt-2 text-xl sm:text-3xl">
                {isZh ? "角色卡" : "Character cards"}
              </h3>
            </div>
            <CardTypeTag count={roleCards.length} locale={locale} />
          </div>

          <p className="mt-3 max-w-5xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
            {isZh
              ? "卡片在发光框中自动轮播，点击任意一张也可以直接切换，只有中间高亮的那张会显示详细说明。"
              : "Cards auto-rotate inside the glowing frame. You can also click any card to switch immediately, and only the centered highlighted card shows detailed information."}
          </p>

          <div className="mt-7">
            <CardCarousel cards={roleCards} locale={locale} tone={roleTone} />
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="font-sans text-xs text-muted">02</span>
              <h3 className="display mt-2 text-xl sm:text-3xl">
                {isZh ? "隐私协议卡" : "Privacy agreement cards"}
              </h3>
            </div>
            <CardTypeTag count={privacyCards.length} locale={locale} />
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
            {isZh
              ? "公司玩家每天抽取自己的隐私协议卡。卡牌内容会要求用户提供高等级信息点（2 点）或低等级信息点（1 点）；前两张为低等级信息，后两张为高等级信息。"
              : "Company players draw their own privacy agreement cards daily. The card content may require users to provide higher-level information points (2 points) or lower-level information points (1 point); the first two cards are lower-level and the last two are higher-level."}
          </p>

          <div className="mt-7">
            <CardCarousel cards={privacyCards} locale={locale} tone={privacyTone} />
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="font-sans text-xs text-muted">03</span>
              <h3 className="display mt-2 text-xl sm:text-3xl">
                {isZh ? "技能卡" : "Skill cards"}
              </h3>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
            {isZh
              ? "角色技能卡代表每位玩家的增益技能。普通技能卡需要玩家先抽取事件卡，之后才有机会抽到技能卡。"
              : "Character skill cards represent each player's buffer skills. Normal skill cards require players to draw an event card before they have a chance to draw a skill card."}
          </p>

          <div className="mt-8 space-y-8 sm:space-y-10">
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
                <h4 className="display text-lg sm:text-2xl">
                  {isZh ? "角色技能卡" : "Role skill cards"}
                </h4>
                <CardTypeTag count={roleSkillCards.length} locale={locale} />
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {isZh
                  ? "这组卡同样使用轮播框，颜色沿用角色卡的黄色。"
                  : "This set also uses the carousel frame and keeps the same yellow tone as the character cards."}
              </p>
              <div className="mt-6">
                <CardCarousel cards={roleSkillCards} locale={locale} tone={roleTone} />
              </div>
            </section>

            <div className="border-t border-line" />

            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
                <h4 className="display text-lg sm:text-2xl">
                  {isZh ? "普通技能卡" : "Normal skill cards"}
                </h4>
                <CardTypeTag count={ordinaryCards.length} locale={locale} />
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {isZh
                  ? "普通技能卡也使用同样的卡片轮播方式，切换逻辑与上面一致。"
                  : "Ordinary skill cards use the same carousel pattern, with the same switching logic as the set above."}
              </p>
              <div className="mt-6">
                <CardCarousel cards={ordinaryCards} locale={locale} tone={skillTone} />
              </div>
            </section>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="font-sans text-xs text-muted">04</span>
              <h3 className="display mt-2 text-xl sm:text-3xl">
                {isZh ? "事件卡" : "Event cards"}
              </h3>
            </div>
            <CardTypeTag count={eventCards.length} locale={locale} />
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">
            {isZh
              ? "事件卡内容由真实网络信息泄露事件改编，效果可能对不同玩家有利或不利；其中部分事件卡会帮助玩家获得抽取技能卡的机会。"
              : "The content in the event cards is adapted from real network information leakage events. Effects can be favorable or unfavorable to different players, and several cards can help players get a chance to draw skill cards."}
          </p>

          <div className="mt-7">
            <CardCarousel cards={eventCards} locale={locale} tone={eventTone} />
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
          <div className="max-w-3xl">
            <span className="font-sans text-xs text-muted">05</span>
            <h3 className="display mt-2 text-xl sm:text-3xl">
              {isZh ? "信息块" : "Information blocks"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {isZh
                ? "信息块用于记录玩家在游戏过程中提供、获得或损失的信息点。不同颜色代表信息块归属的玩家，图案代表玩家身份；其中带黑色外圈的是高级信息块，计 2 分。"
                : "Information blocks record the information points players provide, gain, or lose during the game. One color represents the player the information block belongs to, and the pattern represents the player's identity. High-level information blocks are surrounded by black circles and count as 2 points."}
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <InformationBlockTray
              title={isZh ? "低级信息块" : "Lower-level blocks"}
              subtitle={isZh ? "无黑色外圈，单个信息块计 1 分。" : "No black ring. Each block counts as 1 point."}
              blocks={lowInformationBlocks}
              emptyLabel={isZh ? "等待放入低级信息块。" : "Ready for lower-level information blocks."}
            />
            <InformationBlockTray
              title={isZh ? "高级信息块" : "Higher-level blocks"}
              subtitle={isZh ? "带黑色外圈，单个信息块计 2 分。" : "Black ring included. Each block counts as 2 points."}
              blocks={highInformationBlocks}
              emptyLabel={isZh ? "等待放入高级信息块。" : "Ready for higher-level information blocks."}
              high
            />
          </div>

          <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2 lg:grid-cols-3">
            <p className="rounded-2xl border border-line bg-white px-4 py-3">
              {isZh
                ? "颜色区分信息块归属的玩家，图案区分玩家身份。"
                : "Color shows which player the block belongs to, and the pattern shows the player's identity."}
            </p>
            <p className="rounded-2xl border border-line bg-white px-4 py-3">
              {isZh ? "黑色外圈表示高级信息，计 2 分。" : "A black ring marks high-level information worth 2 points."}
            </p>
            <p className="rounded-2xl border border-line bg-white px-4 py-3">
              {isZh
                ? "公司角色没有自身信息块，只通过收取他人信息块获得信息；公司图案仅用于身份区分。"
                : "Company roles do not have their own information blocks. They gain information by collecting other players' blocks; the company pattern only identifies the role."}
            </p>
          </div>
        </div>

          <div className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
            <div className="max-w-3xl">
              <span className="font-sans text-xs text-muted">06</span>
              <h3 className="display mt-2 text-xl sm:text-3xl">
                {isZh ? "计分表" : "Score tables"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {isZh
                  ? "这两张表由中立角色 Wisdom Brain 使用，分别记录信用分和信息点变化。"
                  : "These tables are used by the neutral Wisdom Brain role to track credit scores and information value changes."}
              </p>
            </div>

            <div className="mt-8">
              <ScoreTableShowcase locale={locale} />
            </div>
          </div>

          <div className="mt-12 border-t border-line pt-8 sm:mt-16 sm:pt-10">
            <div className="max-w-3xl">
              <span className="font-sans text-xs text-muted">07</span>
              <h3 className="display mt-2 text-xl sm:text-3xl">
                {isZh ? "最终展示图" : "Final showcase"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {isZh
                  ? "实体棋盘、卡牌、信息块与说明书共同构成最终成品。"
                  : "The final physical set includes the board, cards, information blocks, and instruction manual."}
              </p>
            </div>

            <div className="mt-8">
              <FinalShowcaseCarousel locale={locale} />
            </div>
          </div>
        </div>
    </section>
  );
}
