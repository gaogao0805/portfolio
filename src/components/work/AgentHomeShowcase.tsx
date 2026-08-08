"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import type { Locale } from "@/i18n/config";
import { getAgentByKey } from "./agentsData";
import { useAgentSelection } from "./AgentSelectionContext";

/**
 * 「就绪」App 首页核心切片的网页复刻（1:1）。
 * 视觉参数与图标均来自 frontend-app-demo：
 * - HomeScreen.tsx（#FAFAFA 底、问候区、skewX(-4deg) 装饰文字）
 * - DelegateTabSwitch.tsx（薄荷绿 #8FEACC 斜切指示条 + 果冻形变、星形/三点圆弧图标）
 * - DelegateCard.tsx（152×145 卡、找工作蓝 #3C7A94 / 招人才棕 #A48341 双色主题、
 *   呼吸四角星、磨砂双星「持续寻访中」、shimmer 扫光、飞入动画）
 * - DelegateCreateCard.tsx（白底虚线卡 + 28px 星形图标）
 * - AppNavigator.tsx（悬浮胶囊 TabBar：白 60% + 毛玻璃 + 圆角 99）
 * TabBar 图标取自 src/icons/ 与 src/assets/icons/tabbar/ 原文件。
 */

const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';

const TEXT_SECONDARY = "#7B838D";
const TEXT_GRAY_MEDIUM = "#9EA7B3";
const TEXT_TERTIARY = "#BBC1C9";
const INDICATOR = "#8FEACC";

/* ---------------- App 原版小图标 ---------------- */

/** App: DelegateCard StarIcon（呼吸四角星原路径） */
function StarIcon({ size = 6, color = "#3C7A94" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8.34298 4.51422C8.35221 4.63571 8.35683 4.69646 8.36358 4.75525C8.4382 5.40531 8.71811 6.01465 9.16266 6.49477C9.20286 6.5382 9.24594 6.58128 9.3321 6.66743C9.41824 6.75358 9.46131 6.79665 9.50473 6.83685C9.98479 7.28134 10.594 7.56123 11.244 7.63591C11.3028 7.64266 11.3635 7.64728 11.485 7.65652L16 8L11.4816 8.34363C11.3617 8.35274 11.3018 8.3573 11.2438 8.36393C10.5927 8.43838 9.98238 8.71877 9.50174 9.16425C9.45892 9.20394 9.41642 9.24644 9.33143 9.33143C9.24644 9.41642 9.20394 9.45892 9.16425 9.50174C8.71877 9.98238 8.43838 10.5927 8.36393 11.2438C8.3573 11.3018 8.35274 11.3617 8.34363 11.4816L8 16L7.65589 11.4815C7.64676 11.3615 7.64219 11.3016 7.63555 11.2435C7.56103 10.5926 7.28069 9.98246 6.83533 9.50193C6.79562 9.45908 6.75309 9.41655 6.66803 9.3315C6.58297 9.24643 6.54043 9.20389 6.49757 9.16417C6.01698 8.71876 5.40673 8.43841 4.75572 8.36394C4.69766 8.3573 4.63768 8.35274 4.51772 8.34361L0 8L4.51432 7.65654C4.6359 7.64729 4.69669 7.64266 4.75553 7.6359C5.40541 7.56121 6.01457 7.28135 6.49458 6.83693C6.53804 6.79669 6.58115 6.75359 6.66737 6.66737C6.75359 6.58115 6.79669 6.53804 6.83693 6.49458C7.28135 6.01457 7.56121 5.40541 7.6359 4.75553C7.64266 4.69669 7.64729 4.6359 7.65654 4.51432L8 0L8.34298 4.51422Z"
        fill={color}
      />
    </svg>
  );
}

/** App: DelegateTabSwitch 新建委托图标（四角星 + 圆弧） */
function CreateDelegateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 17 17" fill="none">
      <path
        d="M8.40344 4.85863C8.43 4.75996 8.56999 4.75996 8.59656 4.85863L9.33356 7.59588C9.34283 7.63029 9.36971 7.65717 9.40412 7.66644L12.1414 8.40344C12.24 8.43 12.24 8.56999 12.1414 8.59656L9.40412 9.33356C9.36971 9.34283 9.34283 9.36971 9.33356 9.40412L8.59656 12.1414C8.56999 12.24 8.43001 12.24 8.40344 12.1414L7.66644 9.40412C7.65717 9.36971 7.63029 9.34283 7.59588 9.33356L4.85863 8.59656C4.75996 8.56999 4.75996 8.43001 4.85863 8.40344L7.59588 7.66644C7.63029 7.65717 7.65717 7.63029 7.66644 7.59588L8.40344 4.85863Z"
        fill="#BBC1C9"
      />
      <path
        d="M15.5192 4.65875C16.1444 5.79888 16.5 7.10792 16.5 8.5C16.5 12.9183 12.9183 16.5 8.5 16.5C3.70156 16.5 0.5 12.6992 0.5 8.5C0.5 4.08172 4.08172 0.5 8.5 0.5C10.3012 0.5 11.9635 1.0953 13.3006 2.09988"
        stroke="#BBC1C9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** App: DelegateTabSwitch 查看全部图标（星 + 双点 + 圆弧） */
function ViewAllIcon() {
  return (
    <svg width="20" height="20" viewBox="1.5 1.5 17 17" fill="none">
      <path
        d="M13.9034 8.35863C13.93 8.25996 14.07 8.25996 14.0966 8.35863L14.4093 9.52014C14.4186 9.55456 14.4454 9.58144 14.4799 9.5907L15.6414 9.90344C15.74 9.93 15.74 10.07 15.6414 10.0966L14.4799 10.4093C14.4454 10.4186 14.4186 10.4454 14.4093 10.4799L14.0966 11.6414C14.07 11.74 13.93 11.74 13.9034 11.6414L13.5907 10.4799C13.5814 10.4454 13.5546 10.4186 13.5201 10.4093L12.3586 10.0966C12.26 10.07 12.26 9.93001 12.3586 9.90344L13.5201 9.5907C13.5546 9.58144 13.5814 9.55456 13.5907 9.52014L13.9034 8.35863Z"
        fill="#BBC1C9"
      />
      <circle cx="10" cy="10" r="1" fill="#BBC1C9" />
      <circle cx="6" cy="10" r="1" fill="#BBC1C9" />
      <path
        d="M17.0192 6.15875C17.6444 7.29888 18 8.60792 18 10C18 14.4183 14.4183 18 10 18C5.20156 18 2 14.1992 2 10C2 5.58172 5.58172 2 10 2C11.8012 2 13.4635 2.5953 14.8006 3.59988"
        stroke="#BBC1C9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------- 数据 ---------------- */

type CardType = "job" | "talent";

/** 新版委托卡：大标题 + 静态副标题 + 单个统计（大数字 + 标签） */
type DelegateCardData = {
  type: CardType;
  title: string;
  /** 缺省表示暂无数据，底部显示磨砂双星「持续寻访中」 */
  stat?: { value: number; label: string };
};

const CARD_THEMES: Record<
  CardType,
  { label: string; primary: string; pillBg: string; cardTo: string; searchingStar: string }
> = {
  job: { label: "找工作", primary: "#3D8CA6", pillBg: "#E4F0F5", cardTo: "#EFF8FF", searchingStar: "#A0C2D1" },
  talent: { label: "招人才", primary: "#B08D3F", pillBg: "#F7EFD8", cardTo: "#FBF8E9", searchingStar: "#D1BAA0" },
};

/** 全部委托卡（App「我的委托」tab 混排，卡片各自带主题色；stat 缺省 = 持续寻访中） */
const ALL_CARDS: DelegateCardData[] = [
  { type: "job", title: "资深产品设计师（AI 方向）", stat: { value: 12, label: "岗位更新" } },
  { type: "job", title: "高级前端工程师", stat: { value: 3, label: "岗位更新" } },
  { type: "job", title: "体验设计师" },
  { type: "talent", title: "高级前端工程师", stat: { value: 3, label: "人才更新" } },
];

type DelegateTab = {
  key: "all" | CardType;
  label: string;
  createLabel: string;
};

/** App HomeScreen：双身份用户显示三个 tab（我的委托 / 找工作 / 招人才） */
const TABS: DelegateTab[] = [
  { key: "all", label: "我的委托", createLabel: "新建委托" },
  { key: "job", label: "找工作", createLabel: "新建找工作委托" },
  { key: "talent", label: "招人才", createLabel: "新建招人才委托" },
];

/* ---------------- 磨砂双星「持续寻访中」（App DelegateCard SearchingIcon） ---------------- */

const FRONT_STAR_D =
  "M13.9928 0.993446C13.5935 -0.164482 12.9547 -0.164482 12.5554 0.993446L10.346 7.51511C9.96002 8.67304 8.6823 9.93745 7.53768 10.3367L1.05595 12.5461C-0.101982 12.9454 -0.101982 13.5843 1.05595 13.9835L7.49776 16.2195C8.65568 16.6188 9.92009 17.8965 10.3194 19.0412L12.5687 25.5761C12.968 26.7341 13.6068 26.7341 14.0061 25.5761L16.2022 19.0811C16.5882 17.9232 17.8526 16.6588 19.0105 16.2595L25.5854 14.0102C26.7433 13.6109 26.7433 12.972 25.5854 12.586L19.117 10.4033C17.959 10.0173 16.6946 8.7529 16.2954 7.59497C16.2554 7.58166 13.9928 0.993446 13.9928 0.993446Z";
const BACK_STAR_D =
  "M21.1569 4.06767C20.7576 2.90974 20.1187 2.90974 19.7194 4.06767L17.5101 10.5893C17.1241 11.7473 15.8464 13.0117 14.7017 13.411L8.22001 15.6203C7.06208 16.0196 7.06208 16.6585 8.22001 17.0578L14.6618 19.2938C15.8197 19.693 17.0842 20.9708 17.4834 22.1154L19.7327 28.6504C20.132 29.8083 20.7709 29.8083 21.1702 28.6504L23.3662 22.1553C23.7522 20.9974 25.0166 19.733 26.1746 19.3337L32.7495 17.0844C33.9074 16.6851 33.9074 16.0462 32.7495 15.6603L26.281 13.4775C26.2642 13.4719 26.2473 13.4661 26.2303 13.4601C23.8284 12.6089 22.95 9.26414 22.1175 6.85561C21.612 5.39277 21.1569 4.06767 21.1569 4.06767Z";

function SearchingIcon({ color }: { color: string }) {
  // App 原逻辑：实星/玻璃星各前后两层拷贝，反向平移并交叉淡入淡出交换层级，互相穿过
  const T = 2.1;
  const moveTimes = [0, 0.2857, 0.4286, 0.7143, 1];
  const fadeTimes = [0, 0.12, 0.1657, 0.5486, 0.5943, 1];
  const move = (dx: number, dy: number) => ({
    x: { duration: T, times: moveTimes, repeat: Infinity, ease: "easeInOut" as const },
    y: { duration: T, times: moveTimes, repeat: Infinity, ease: "easeInOut" as const },
  });
  const moveKeyframes = (dx: number, dy: number) => ({ x: [0, dx, dx, 0, 0], y: [0, dy, dy, 0, 0] });
  const fade = (fromVisible: boolean) => ({
    duration: T,
    times: fadeTimes,
    repeat: Infinity,
    ease: "easeInOut" as const,
  });
  const fadeKeyframes = (fromVisible: boolean) =>
    fromVisible ? [1, 1, 0, 0, 1, 1] : [0, 0, 1, 1, 0, 0];

  const SolidStar = () => (
    <svg width="28" height="24" viewBox="0 0 34 30" fill="none" className="absolute inset-0">
      <path d={FRONT_STAR_D} fill={color} />
    </svg>
  );
  const GlassStar = () => (
    <svg width="28" height="24" viewBox="0 0 34 30" fill="none" className="absolute inset-0">
      <path d={BACK_STAR_D} fill={color} opacity={0.32} />
      <path d={BACK_STAR_D} stroke="#FFFFFF" strokeWidth={0.9} strokeLinejoin="round" fill="none" opacity={0.55} />
      <path d={BACK_STAR_D} stroke={color} strokeWidth={0.6} strokeLinejoin="round" fill="none" opacity={0.36} />
    </svg>
  );

  return (
    <span className="relative block h-6 w-7">
      <motion.span
        className="absolute inset-0 z-20"
        animate={{ ...moveKeyframes(5.9, 2.4), opacity: fadeKeyframes(true) }}
        transition={{ ...move(5.9, 2.4), opacity: fade(true) }}
      >
        <SolidStar />
      </motion.span>
      <motion.span
        className="absolute inset-0 z-10"
        animate={{ ...moveKeyframes(5.9, 2.4), opacity: fadeKeyframes(false) }}
        transition={{ ...move(5.9, 2.4), opacity: fade(false) }}
      >
        <SolidStar />
      </motion.span>
      <motion.span
        className="absolute inset-0 z-10"
        animate={{ ...moveKeyframes(-5.9, -2.4), opacity: fadeKeyframes(true) }}
        transition={{ ...move(-5.9, -2.4), opacity: fade(true) }}
      >
        <GlassStar />
      </motion.span>
      <motion.span
        className="absolute inset-0 z-20"
        animate={{ ...moveKeyframes(-5.9, -2.4), opacity: fadeKeyframes(false) }}
        transition={{ ...move(-5.9, -2.4), opacity: fade(false) }}
      >
        <GlassStar />
      </motion.span>
    </span>
  );
}

/* ---------------- 委托卡（新版样式：大标题 + 分割线 + 单统计） ---------------- */

function DelegateCardView({
  card,
  index,
}: {
  card: DelegateCardData;
  index: number;
}) {
  const theme = CARD_THEMES[card.type];
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        x: { delay: index * 0.08, type: "spring", stiffness: 50, damping: 8 },
        opacity: { delay: index * 0.08, duration: 0.4, times: [0, 0.5, 1] },
      }}
      className="relative h-[145px] w-[152px] shrink-0 overflow-hidden rounded-xl bg-white"
    >
      {/* 渐变层：0–50% 白 → 底部主题色 */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, #FFFFFF 50%, ${theme.cardTo} 100%)` }}
      />

      <div className="relative flex h-full flex-col px-3 py-3.5">
        {/* 顶行：类型 + 状态胶囊（小加号 + 委托中） */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold leading-[18px]" style={{ color: theme.primary }}>
            {theme.label}
          </span>
          <span
            className="flex h-[18px] items-center gap-0.5 rounded-full px-1 py-0.5"
            style={{ backgroundColor: theme.pillBg }}
          >
            {/* App 原版：呼吸四角星（1→1.5→1，1.2s 循环） */}
            <motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <StarIcon size={6} color={theme.primary} />
            </motion.span>
            <span className="text-[10px] leading-none tracking-[0.5px]" style={{ color: theme.primary }}>
              委托中
            </span>
          </span>
        </div>

        {/* 大标题 + 副标题（灰星 + 扫光，App 原样式） */}
        <p className="mt-2.5 truncate text-[16px] font-semibold leading-[21px] text-black">{card.title}</p>
        <span className="relative mt-1 inline-flex items-center gap-1 self-start overflow-hidden">
          {/* App: 副标题 8×8 小星（原路径） */}
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M3.61877 0.0734767C3.64534 -0.0251914 3.78533 -0.0251918 3.81189 0.0734763L4.54889 2.81072C4.55816 2.84514 4.58504 2.87202 4.61945 2.88128L7.3567 3.61828C7.45537 3.64485 7.45537 3.78484 7.3567 3.8114L4.61945 4.5484C4.58504 4.55767 4.55816 4.58455 4.54889 4.61897L3.81189 7.35621C3.78533 7.45488 3.64534 7.45488 3.61877 7.35621L2.88177 4.61897C2.87251 4.58455 2.84562 4.55767 2.81121 4.5484L0.073965 3.81141C-0.0247031 3.78484 -0.0247035 3.64485 0.0739646 3.61828L2.81121 2.88128C2.84562 2.87202 2.87251 2.84514 2.88177 2.81072L3.61877 0.0734767Z"
              fill="#9EA7B3"
            />
          </svg>
          <span className="text-[10px] leading-4" style={{ color: TEXT_GRAY_MEDIUM }}>
            {card.type === "job" ? "发现合适岗位，尽快投递" : "发现合适人才，尽快联系"}
          </span>
          {/* App ShinyText 扫光（3.5s 循环、白色高光带） */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)",
              skewX: "-20deg",
            }}
            animate={{ x: ["-120%", "280%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>

        {/* 分割线 */}
        <div className="my-2.5 h-px w-full" style={{ backgroundColor: "#F1F2F4" }} />

        {/* 底部：有大数字显示统计；没有数据显示磨砂双星「持续寻访中」（左对齐） */}
        {card.stat ? (
          <div className="mt-auto flex items-baseline gap-1.5">
            <span className="text-[22px] font-semibold leading-none" style={{ color: theme.primary }}>
              {card.stat.value}
            </span>
            <span className="text-[11px]" style={{ color: TEXT_GRAY_MEDIUM }}>
              {card.stat.label}
            </span>
          </div>
        ) : (
          <div className="mt-auto flex items-center gap-1.5">
            <SearchingIcon color={theme.searchingStar} />
            <span className="text-[10px] tracking-[0.5px]" style={{ color: TEXT_GRAY_MEDIUM }}>
              持续寻访中
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ---------------- 「为你精选」 ---------------- */

/** App: quote-mark.svg（经纪人说的引号） */
function QuoteMark() {
  return (
    <svg width="20" height="15" viewBox="0 0 20.2268 14.8043" fill="none" className="absolute -left-1.5 -top-1.5">
      <path
        opacity="0.5"
        d="M16.2675 0L18.118 1.76446L15.7941 4.26053C16.3105 5.00649 16.9274 5.78113 17.6446 6.58446C18.3906 7.38779 19.2513 8.23416 20.2268 9.12357C19.4808 9.9269 18.6488 10.7302 17.7307 11.5336C16.8126 12.3082 15.9662 12.9681 15.1916 13.5132C14.1874 12.2221 13.2407 10.9167 12.3512 9.59696C11.4618 8.24851 10.6442 6.9144 9.89821 5.59464C10.9024 4.79131 11.9496 3.9019 13.0398 2.92643C14.1587 1.95095 15.2346 0.975475 16.2675 0ZM6.36928 1.29107L8.21982 3.05553L5.89589 5.55161C6.41232 6.29756 7.02916 7.0722 7.74643 7.87553C8.49238 8.67887 9.35309 9.52524 10.3286 10.4146C9.58262 11.218 8.75059 12.0213 7.8325 12.8246C6.9144 13.5993 6.06803 14.2592 5.29339 14.8043C4.28923 13.5132 3.34244 12.2078 2.45304 10.888C1.56363 9.53958 0.745952 8.20547 0 6.88571C1.00417 6.08238 2.05137 5.19297 3.14161 4.2175C4.26053 3.24202 5.33643 2.26655 6.36928 1.29107Z"
        fill="#DDE2E8"
      />
    </svg>
  );
}

/** App: VoiceWaveAnimation（5 根竖条往复 + 右上四角星呼吸） */
const WAVE_BARS = [
  { max: 28, opacity: 0.4, duration: 600, delay: 0 },
  { max: 40, opacity: 0.7, duration: 800, delay: 120 },
  { max: 20, opacity: 1, duration: 700, delay: 240 },
  { max: 36, opacity: 0.6, duration: 900, delay: 80 },
  { max: 24, opacity: 0.85, duration: 750, delay: 200 },
];

function VoiceWaveAnimation() {
  return (
    <span className="relative flex h-14 w-14 items-center justify-center">
      <span className="flex items-center">
        {WAVE_BARS.map((bar, i) => (
          <motion.span
            key={i}
            className="mx-[2.5px] w-1 rounded-full bg-white"
            style={{ opacity: bar.opacity }}
            animate={{ height: [8, bar.max, 8] }}
            transition={{
              duration: bar.duration / 1000,
              delay: bar.delay / 1000,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
      <motion.span
        className="absolute right-0.5 top-0.5"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <StarIcon size={14} color="rgba(255,255,255,0.9)" />
      </motion.span>
    </span>
  );
}

/** 语音横幅（懂你卡） */
function VoiceBanner() {
  return (
    <div
      className="flex items-center justify-between overflow-hidden rounded-xl px-4 py-2"
      style={{ background: "linear-gradient(90deg, #EBF5FA 0%, #CEF2EF 100%)" }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-semibold" style={{ color: "#2EA289" }}>
          懂你，才能更好帮你
        </span>
        <span className="text-[12px] tracking-[0.5px]" style={{ color: TEXT_GRAY_MEDIUM }}>
          经纪人会根据<u>你的画像</u>，帮你找到更合适的选择
        </span>
      </div>
      <VoiceWaveAnimation />
    </div>
  );
}

/** App: chevronRight.svg */
function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M5.24219 2L9.41584 6.17366C9.45394 6.21176 9.45394 6.27353 9.41584 6.31163L5.24219 10.4853"
        stroke="#8C8C8C"
        strokeWidth="1.05417"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** App: CaseFilled.svg / UserFilled.svg（分组头图标） */
function CaseFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 6.42871C2.89543 6.42871 2 7.32414 2 8.42871V10.0835C2 10.9667 2.57934 11.7453 3.42531 11.9991L10.8506 14.2267C11.6004 14.4516 12.3996 14.4516 13.1494 14.2267L20.5747 11.9991C21.4207 11.7453 22 10.9667 22 10.0835V8.42871C22 7.32414 21.1046 6.42871 20 6.42871H4ZM12.75 9.85742C12.75 9.44321 12.4142 9.10742 12 9.10742C11.5858 9.10742 11.25 9.44321 11.25 9.85742V11.5717C11.25 11.9859 11.5858 12.3217 12 12.3217C12.4142 12.3217 12.75 11.9859 12.75 11.5717V9.85742Z"
        fill="#3C7A94"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.0835 13.0128V17.0001C2.0835 19.6235 4.21015 21.7501 6.8335 21.7501H17.1668C19.7902 21.7501 21.9168 19.6235 21.9168 17.0001V13.0126C21.6401 13.1937 21.3344 13.3376 21.0057 13.4362L13.5804 15.6638C12.5495 15.973 11.4505 15.973 10.4196 15.6638L2.99429 13.4362C2.66571 13.3376 2.36012 13.1938 2.0835 13.0128ZM2.14511 10.832L12.0002 12.5003L21.8549 10.8321C21.6323 11.3832 21.1694 11.821 20.5747 11.9994L13.1494 14.227C12.3996 14.4519 11.6004 14.4519 10.8506 14.227L3.42531 11.9994C2.83058 11.821 2.36763 11.3832 2.14511 10.832ZM11.9995 14.0002L12.0001 14.0003L12 14.0003L11.9995 14.0002Z"
        fill="#3C7A94"
      />
      <path d="M15.3332 6.42855V5C15.3332 3.89543 14.4377 3 13.3332 3H10.6665C9.56193 3 8.6665 3.89543 8.6665 5L8.6665 6.42855" stroke="#3C7A94" strokeWidth="1.5" />
    </svg>
  );
}

function UserFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="4" cy="4" r="4" transform="matrix(-1 0 0 1 16 3)" fill="#A48341" stroke="#A48341" strokeWidth="1.5" />
      <path
        d="M5 16.9347C5 16.0743 5.54085 15.3068 6.35109 15.0175C10.004 13.7128 13.996 13.7128 17.6489 15.0175C18.4591 15.3068 19 16.0743 19 16.9347V18.2502C19 19.4376 17.9483 20.3498 16.7728 20.1818L15.8184 20.0455C13.2856 19.6837 10.7144 19.6837 8.18162 20.0455L7.22721 20.1818C6.0517 20.3498 5 19.4376 5 18.2502V16.9347Z"
        fill="#A48341"
        stroke="#A48341"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** 「经纪人说」行（岗位卡/人才卡共用） */
function AgentCommentRow({ text, avatar, textColor }: { text: string; avatar: string; textColor: string }) {
  return (
    <div className="flex items-start gap-1.5 border-t pt-2.5" style={{ borderColor: "#F1F2F4" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatar} alt="经纪人" className="h-5 w-5 rounded-full object-cover" />
      <div className="relative flex-1">
        <QuoteMark />
        <p className="line-clamp-2 text-[13px] leading-[18px]" style={{ color: textColor }}>
          {text}
        </p>
      </div>
    </div>
  );
}

/** 结尾「查看全部」进度环：随拖拽滚动填充，满了变实心、箭头变白 */
function ViewAllRing({
  color,
  label,
  progress,
}: {
  color: string;
  label: string;
  progress: number;
}) {
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const full = progress >= 0.99;

  return (
    <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-2">
      <span className="relative block h-10 w-10">
        <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
          <circle cx="20" cy="20" r={r} stroke="#E8ECF0" strokeWidth="2.5" fill="none" />
          <circle
            cx="20"
            cy="20"
            r={r}
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
          {full ? <circle cx="20" cy="20" r={r} fill={color} /> : null}
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center transition-colors"
          style={{ color: full ? "#FFFFFF" : "#E8ECF0" }}
        >
          <svg width="26" height="26" viewBox="-1 0 24 24" fill="none">
            <path
              d="M16.9503 9.52164C16.9889 9.37813 17.1925 9.37813 17.2312 9.52164L17.686 11.2111C17.6995 11.2612 17.7386 11.3003 17.7887 11.3137L19.4781 11.7686C19.6217 11.8073 19.6217 12.0109 19.4781 12.0495L17.7887 12.5044C17.7386 12.5179 17.6995 12.557 17.686 12.607L17.2312 14.2965C17.1925 14.44 16.9889 14.44 16.9503 14.2965L16.4954 12.607C16.4819 12.557 16.4428 12.5179 16.3927 12.5044L14.7033 12.0495C14.5598 12.0109 14.5598 11.8073 14.7033 11.7686L16.3927 11.3137C16.4428 11.3003 16.4819 11.2612 16.4954 11.2111L16.9503 9.52164Z"
              fill="currentColor"
            />
            <circle cx="11.2724" cy="11.9091" r="1.45454" fill="currentColor" />
            <circle cx="5.45454" cy="11.9091" r="1.45454" fill="currentColor" />
          </svg>
        </span>
      </span>
      <span className="whitespace-nowrap text-[12px] leading-[18px]" style={{ color: TEXT_SECONDARY }}>
        {label}
      </span>
    </div>
  );
}

type JobCardData = {
  companyInitial: string;
  companyName: string;
  title: string;
  salary: string;
  tags: string[];
  comment: string;
};

const JOB_CARDS: JobCardData[] = [
  {
    companyInitial: "字",
    companyName: "字节跳动",
    title: "资深产品设计师（AI 方向）",
    salary: "25-40K·16薪",
    tags: ["3-5年", "本科", "AI 应用"],
    comment: "这个岗位和你的作品集方向很匹配，建议优先投递。",
  },
  {
    companyInitial: "月",
    companyName: "月之暗面",
    title: "AI 对话产品设计专家",
    salary: "30-50K",
    tags: ["1-3年", "本科", "LLM"],
    comment: "团队氛围好，设计师的话语权很高。",
  },
];

function JobPreviewCard({ job, agentAvatar }: { job: JobCardData; agentAvatar: string }) {
  return (
    <div
      className="w-[289px] shrink-0 rounded-xl bg-white px-3.5 py-4 transition-transform duration-200 hover:-translate-y-1"
      style={{ border: "1px solid #EBF5FA" }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded text-[14px] font-bold"
          style={{ backgroundColor: "#D7E8D4", color: "#35514A" }}
        >
          {job.companyInitial}
        </span>
        <span className="truncate text-[13px] font-medium text-black">{job.companyName}</span>
      </div>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="flex-1 truncate text-[16px] font-semibold leading-[22px] text-black">
          {job.title}
        </span>
        <span className="shrink-0 text-[16px] font-semibold" style={{ color: "#3C7A94" }}>
          {job.salary}
        </span>
      </div>
      <div className="mb-2.5 flex gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 text-[12px] leading-[18px]"
            style={{ backgroundColor: "#F8FAFC", color: TEXT_GRAY_MEDIUM }}
          >
            {tag}
          </span>
        ))}
      </div>
      <AgentCommentRow text={job.comment} avatar={agentAvatar} textColor={TEXT_SECONDARY} />
    </div>
  );
}

function TalentPreviewCard({ agentAvatar }: { agentAvatar: string }) {
  return (
    <div
      className="w-[289px] shrink-0 rounded-xl bg-white px-3.5 py-4 transition-transform duration-200 hover:-translate-y-1"
      style={{ border: "1px solid #FAF9EB", minHeight: 174 }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-bold"
          style={{ backgroundColor: "#FBF5E9", color: "#9B824A" }}
        >
          张
        </span>
        <span className="truncate text-[13px] font-medium text-black">张小姐</span>
      </div>
      <p className="mb-2.5 truncate text-[16px] font-semibold leading-[22px] text-black">
        字节跳动 · 3年经验
      </p>
      <div className="mb-2.5 flex gap-2">
        {["产品设计", "B 端", "作品集完备"].map((tag) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 text-[12px] leading-[18px]"
            style={{ backgroundColor: "#F8FAFC", color: TEXT_GRAY_MEDIUM }}
          >
            {tag}
          </span>
        ))}
      </div>
      <AgentCommentRow text="候选人近期活跃度高，建议尽快约聊。" avatar={agentAvatar} textColor="#929BA6" />
    </div>
  );
}

/** 可拖拽横滑的行：鼠标/触摸拖动滚动，并向子组件回传滚动进度（喂给进度环） */
function DraggableRow({ children }: { children: (progress: number) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.65); // 内容不溢出时保持静态 65%

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    setProgress(Math.min(1, Math.max(0, el.scrollLeft / max)));
  };

  return (
    <div
      ref={ref}
      className="flex cursor-grab select-none gap-3 overflow-x-auto active:cursor-grabbing [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      onScroll={update}
      onPointerDown={(e) => {
        const startX = e.clientX;
        const startLeft = ref.current?.scrollLeft ?? 0;
        const move = (ev: PointerEvent) => {
          if (ref.current) ref.current.scrollLeft = startLeft - (ev.clientX - startX);
        };
        const up = () => window.removeEventListener("pointermove", move);
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up, { once: true });
      }}
    >
      {children(progress)}
    </div>
  );
}

/** 「适合你的岗位」/「人才行情报告」分组卡 */
function FeatureGroup({
  theme,
  agentAvatar,
}: {
  theme: "job" | "talent";
  agentAvatar: string;
}) {
  const isJob = theme === "job";
  const primary = isJob ? "#3C7A94" : "#A48341";
  const paleBg = isJob ? "#EBF5FA" : "#FAF9EB";

  return (
    <div className="relative flex flex-col gap-3 rounded-xl bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded" style={{ backgroundColor: paleBg }}>
            {isJob ? <CaseFilledIcon /> : <UserFilledIcon />}
          </span>
          <span className="text-[14px] font-medium leading-5 text-black">
            {isJob ? "适合你的岗位" : "人才行情报告"}
          </span>
          {isJob ? (
            <span
              className="rounded-[10px] px-1.5 py-0.5 text-[11px] leading-[15px]"
              style={{ backgroundColor: paleBg, color: primary }}
            >
              更新 3 个
            </span>
          ) : null}
        </div>
        <span className="flex items-center text-[12px] leading-[17px]" style={{ color: TEXT_SECONDARY }}>
          {isJob ? "查看全部" : "阅读完整报告"}
          <ChevronRight />
        </span>
      </div>

      <DraggableRow>
        {(progress) => (
          <>
            {isJob ? (
              <>
                {JOB_CARDS.map((job) => (
                  <JobPreviewCard key={job.title} job={job} agentAvatar={agentAvatar} />
                ))}
                <ViewAllRing color={primary} label="查看全部" progress={progress} />
              </>
            ) : (
              <>
                <TalentPreviewCard agentAvatar={agentAvatar} />
                <ViewAllRing color={primary} label="阅读完整报告" progress={progress} />
              </>
            )}
          </>
        )}
      </DraggableRow>
    </div>
  );
}

/** 批注标记：◎ 同心圆小图标，嵌在标题块行首 */
function NoteMarker() {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-black/60 bg-white/80">
      <span className="h-1 w-1 rounded-full bg-black/60" />
    </span>
  );
}

/* ---------------- 悬浮委托舞台（coverflow 3D 持续滚动 + 悬停暂停） ---------------- */

const COVER_SCALE = 1.3;
const COVER_W = 152 * COVER_SCALE;
const COVER_GAP = 20;

function CoverflowItem({
  card,
  index,
  offset,
  track,
}: {
  card: DelegateCardData;
  index: number;
  offset: MotionValue<number>;
  track: number;
}) {
  // 卡片在无限轨道上的横向位置（相对舞台中心）
  const x = useTransform(offset, (o) => {
    const raw = (((index * (COVER_W + COVER_GAP) + o) % track) + track) % track;
    return raw - track / 2;
  });
  const rotateY = useTransform(x, (v) => Math.max(-50, Math.min(50, -v * 0.12)));
  const z = useTransform(x, (v) => -Math.abs(v) * 0.35);
  const scale = useTransform(x, (v) => 1 - Math.min(Math.abs(v) / 1400, 0.22));
  // 接近舞台边缘（约手机屏幕边缘）时渐隐，避免被硬裁
  const opacity = useTransform(x, (v) => {
    const a = Math.abs(v);
    if (a <= 190) return 1;
    return Math.max(0, 1 - (a - 190) / 70);
  });
  const zIndex = useTransform(x, (v) => 100 - Math.round(Math.abs(v) / 5));

  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{ x, rotateY, z, scale, opacity, zIndex, marginLeft: -COVER_W / 2 }}
    >
      <div
        className="rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.14)]"
        style={{ width: 152, height: 145, transform: `scale(${COVER_SCALE})`, transformOrigin: "center" }}
      >
        <DelegateCardView card={card} index={0} />
      </div>
    </motion.div>
  );
}

function DelegateCoverflow({ cards, tabKey }: { cards: DelegateCardData[]; tabKey: string }) {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "100px" });
  const offset = useMotionValue(0);
  // 卡组重复到至少 8 张：轨道上始终有卡进出，避免视觉稀疏
  const repeat = Math.max(2, Math.ceil(8 / cards.length));
  const items = Array.from({ length: repeat }, () => cards).flat();
  const track = items.length * (COVER_W + COVER_GAP);

  // 持续滚动（45px/s），悬停或滚出视口时暂停
  useAnimationFrame((_, delta) => {
    if (!paused && inView) {
      offset.set((((offset.get() - delta * 0.045) % track) + track) % track);
    }
  });

  // 切换 tab 时回到起点
  useEffect(() => {
    offset.set(0);
  }, [tabKey, offset]);

  return (
    <div
      ref={containerRef}
      className="relative h-[200px]"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((card, i) => (
        <CoverflowItem key={`${tabKey}-${card.title}-${i}`} card={card} index={i} offset={offset} track={track} />
      ))}
    </div>
  );
}

/* ---------------- 首页切片 ---------------- */

function greetingByHour(hour: number) {
  if (hour >= 5 && hour < 12) return "早上好";
  if (hour >= 12 && hour < 14) return "中午好";
  if (hour >= 14 && hour < 18) return "下午好";
  return "晚上好";
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function HomeScreenPlay({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];
  const visibleCards = tab.key === "all" ? ALL_CARDS : ALL_CARDS.filter((c) => c.type === tab.key);
  const { agentKey } = useAgentSelection();
  const agentAvatar = getAgentByKey(agentKey).avatar.selected;
  const now = new Date();

  return (
    <div className="w-full" style={{ fontFamily: SYSTEM_FONT }}>
      {/* 无手机框无底色：内容直接融进页面 */}

      {/* 顶部问候区（padding 16/12/16/20） */}
      <div className="flex flex-col gap-2 pb-4 pl-5 pr-3 pt-4">
        <span
          className="inline-block text-[14px] leading-[21px]"
          style={{ color: TEXT_TERTIARY, transform: "skewX(-4deg)" }}
        >
          {now.getMonth() + 1}月{now.getDate()}日 星期{WEEKDAYS[now.getDay()]}
        </span>
        <span className="text-[20px] font-semibold leading-6 tracking-[0.5px] text-black">
          {greetingByHour(now.getHours())}，Zoey
        </span>
      </div>

      {/* 委托 Tab 切换（与其他内容对齐） */}
      <div className="mb-3 flex h-8 items-center justify-between px-4">
          <div className="flex items-end gap-4">
            {TABS.map((t, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className="relative pb-1"
                >
                  <motion.span
                    animate={{
                      scale: active ? 1 : 16 / 18,
                      color: active ? "#000000" : TEXT_SECONDARY,
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 block origin-bottom-left text-[18px] font-semibold"
                  >
                    {t.label}
                  </motion.span>
                  {active ? (
                    <motion.span
                      layoutId="homeTabIndicator"
                      className="absolute -bottom-0.5 left-0 right-0 z-0 mx-auto h-2.5 w-6"
                      transition={{ type: "spring", stiffness: 50, damping: 7 }}
                    >
                      {/* 果冻形变：150ms 拉宽压扁，再弹簧回弹 */}
                      <motion.span
                        className="block h-full w-full rounded-[2px]"
                        style={{ backgroundColor: INDICATOR, skewY: "-8deg" }}
                        animate={{ scaleX: [1, 1.6, 1], scaleY: [1, 0.6, 1] }}
                        transition={{ duration: 0.45, times: [0, 0.45, 1] }}
                      />
                    </motion.span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {/* 右侧：新建委托 / 查看全部（App 原图标） */}
          <div className="flex items-center gap-2">
            <span className="p-0.5">
              <CreateDelegateIcon />
            </span>
            <span className="p-0.5">
              <ViewAllIcon />
            </span>
          </div>
        </div>

      {/* 悬浮委托卡 coverflow：单独拎出来出血，持续滚动、悬停暂停 */}
      <div className="relative z-20 -mx-14 mt-6 sm:-mx-20">
        <DelegateCoverflow cards={visibleCards} tabKey={tab.key} />
      </div>

      {/* 为你精选（滚动入场 stagger） */}
      <div className="mt-2 flex flex-col gap-3 px-4">
        <h3 className="text-[18px] font-semibold leading-6 tracking-[0.5px] text-black">为你精选</h3>
        {[
          <VoiceBanner key="voice" />,
          <FeatureGroup key="job" theme="job" agentAvatar={agentAvatar} />,
          <FeatureGroup key="talent" theme="talent" agentAvatar={agentAvatar} />,
        ].map((node, i) => (
          <motion.div
            key={node.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
          >
            {node}
          </motion.div>
        ))}
      </div>

      {/* 推荐内容与底部 TabBar 按需求收起不展示 */}
    </div>
  );
}

/* ---------------- 区块 ---------------- */

export function AgentHomeShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";

  return (
    <section data-nav-theme="light" className="theme-light bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
        {/* portfolio 层：标题 + 概括 + 两处批注（与复刻层分离） */}
        <div className="max-w-3xl">
          <motion.h2
            data-journey-anchor
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-4 text-3xl leading-[1.15] sm:text-5xl"
          >
            {isZh ? "求职不海投，招聘不海选" : "No mass-applying. No mass-screening."}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
          >
            {isZh
              ? "「就绪」是一款 AI 求职招聘产品：六位经纪人分守求职与招聘两端，帮你完成双向匹配。下面是对首页核心区域的一比一交互复刻。"
              : "Ready is an AI recruitment product: six agents serving both job seekers and recruiters, matching both sides. Below is a pixel-faithful interactive recreation of the home screen."}
          </motion.p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3 lg:hidden">
            {[
              {
                title: isZh ? "委托 · 双向精准匹配" : "Delegate · precise matching",
                desc: isZh
                  ? "经纪人先吃透你的需求，再替两端完成匹配——出现在委托里的岗位和候选人，都已经是筛选后的结果：不用海投，也不用反复比对。"
                  : "Your agent learns your needs first, then matches both sides — everything in your delegate list is already pre-screened.",
              },
              {
                title: isZh ? "适合你的岗位 · 传统岗位池" : "Job feed · traditional browsing",
                desc: isZh
                  ? "想自己看看市场行情时，用熟悉的方式浏览全量岗位，是委托之外的补充入口。"
                  : "A traditional pool for browsing the full market the familiar way, complementing delegates.",
              },
              {
                title: isZh ? "人才行情报告 · 招聘方的市场参照" : "Talent report · market reference",
                desc: isZh
                  ? "同行在招什么岗位、开到什么薪资一目了然，方便招聘方对照调整待遇策略，更快锁定优秀人才。"
                  : "See what peers are hiring for and at what salary, so recruiters can tune their offers and win better talent.",
              },
            ].map((note, i) => (
              <motion.div
                key={note.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-2"
              >
                <NoteMarker />
                <div>
                  <p className="text-sm font-semibold text-fg">{note.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{note.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 font-sans text-xs text-muted">
            {isZh
              ? "点击 Tab 切换找工作 / 招人才 · 复刻自 App 真实首页"
              : "Tap the tabs to switch roles · recreated from the real app home"}
          </p>
        </div>

        {/* 复刻层：纯 App 内容；桌面端两侧批注 + 虚线指向 */}
        <div className="mt-12 flex justify-center">
          {/* 宽度上限 440（桌面批注锚定此列），窄屏收缩为全宽，避免内容被裁 */}
          <div className="relative w-full max-w-[440px]">
            {/* 左侧批注 → 委托卡（锚定复刻列左缘，虚线止于卡片出血边） */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-full top-[220px] mr-[24px] hidden items-center lg:flex"
            >
              <div className="w-[200px] text-right">
                <p className="text-sm font-semibold text-fg">
                  {isZh ? "委托 · 双向精准匹配" : "Delegate · precise matching"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {isZh
                    ? "经纪人先吃透需求，再替两端完成匹配——出现的都是筛选后的结果，不用海投也不用反复比对。"
                    : "Your agent learns your needs first, then matches both sides — everything is pre-screened."}
                </p>
              </div>
              <span className="ml-3 w-10 border-t border-dashed border-black/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
            </motion.div>

            {/* 右侧批注 → 岗位池（锚定复刻列右缘） */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-full top-[560px] ml-[24px] hidden items-center lg:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
              <span className="mr-3 w-10 border-t border-dashed border-black/25" />
              <div className="w-[200px]">
                <p className="text-sm font-semibold text-fg">
                  {isZh ? "适合你的岗位 · 传统岗位池" : "Job feed · traditional browsing"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {isZh
                    ? "想自己看看市场行情时，用熟悉的方式浏览全量岗位，是委托之外的补充入口。"
                    : "A traditional pool for browsing the full market, complementing delegates."}
                </p>
              </div>
            </motion.div>

            {/* 右侧批注② → 人才行情报告（招聘方市场参照） */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-full top-[840px] ml-[24px] hidden items-center lg:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
              <span className="mr-3 w-10 border-t border-dashed border-black/25" />
              <div className="w-[200px]">
                <p className="text-sm font-semibold text-fg">
                  {isZh ? "人才行情报告 · 招聘方的市场参照" : "Talent report · market reference"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {isZh
                    ? "同行在招什么岗位、开到什么薪资一目了然，方便招聘方对照调整待遇策略，更快锁定优秀人才。"
                    : "See what peers are hiring for and at what salary, so recruiters can tune their offers and win better talent."}
                </p>
              </div>
            </motion.div>

            <HomeScreenPlay locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
