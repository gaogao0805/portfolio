"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import type { Locale } from "@/i18n/config";

/**
 * 「匿名简历」：对外展示区 1:1 复刻（卡片 + 隐私滑块 + 按住对比）。
 * 视觉与交互参数全部来自 frontend-app-demo 主分支：
 * - ResumePreviewScreen.tsx + ResumePreviewHeader.tsx（ segmented 头部）
 * - ResumePreviewExternalCardPanel.tsx（卡片容器 / 滑切换档动效）
 * - AnonymizedPreviewCard.tsx + PeekableAnonymizedPreviewCard.tsx + DiffText.tsx（卡片内容与差异高亮）
 * - PrivacySlider.tsx（滑块轨道 / 拖拽吸附 / 圆点弹跳 / 气泡滑动）
 */

const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

/* App Colors（constants/colors.ts） */
const PRIMARY = "#008B68";
const PRIMARY_SOFT = "#6FCDAE";
const PRIMARY_SOFT_FAINT = "rgba(111, 205, 174, 0.25)";
const PRIMARY_BG_MUTED = "rgba(0, 139, 104, 0.08)";
const ACCENT_AMBER_LIGHT = "rgba(251, 191, 36, 0.18)";
const TEXT_NEAR_BLACK = "#1a1a1a";
const TEXT_SECONDARY = "#7B838D";
const TEXT_COOL_GRAY_600 = "#6B7280";
const TEXT_GRAY = "#656D76";
const TEXT_GRAY_MEDIUM = "#9EA7B3";
const TEXT_TERTIARY = "#BBC1C9";
const RAW_D1D5DB = "#D1D5DB";
const BG_CLOUD = "#F8FAFC";
const BG_GRAY = "rgba(241, 242, 244, 1)";
const BG_OFF_WHITE = "rgba(250, 251, 250, 1)";
const MASKED_GRAY_OVERLAY = "rgba(200, 200, 200, 0.25)";
const SLIDER_START = "rgba(77, 201, 160, 1)";
const SLIDER_END = "rgba(200, 240, 222, 1)";
const OVERLAY_BLACK = "rgba(0, 0, 0, 0.5)";
const DIVIDER_DARK = "#E5E5E5";
const BG_SECONDARY = "#FAFAFA";
const BG_NEUTRAL_LIGHT = "rgba(245, 245, 245, 1)";
const TEXT_GRAY_LIGHT = "#999";

/* 可编辑字段（App: FieldEditModal 的 FIELD_LABELS / FIELD_PLACEHOLDERS） */
const FIELD_META: Record<string, { label: string; placeholder: string }> = {
  name: { label: "姓名", placeholder: "如：张**" },
  contact_0: { label: "电话", placeholder: "如：138****1234" },
  contact_1: { label: "邮箱", placeholder: "如：z**@example.com" },
  school: { label: "学校名称", placeholder: "如：某985高校" },
  company: { label: "公司名称", placeholder: "如：某知名企业" },
  workPeriod: { label: "工作时间", placeholder: "如：2020年-2023年" },
  eduPeriod: { label: "教育时间", placeholder: "如：2020年-2023年" },
};

const metaFor = (key: string) => FIELD_META[key] || FIELD_META[key.slice(0, key.lastIndexOf("_"))];

const AVATAR_URL = "https://static.go2ready.com/app/asset/avatar.png";

/* ---------------- 数据模型与 Mock（对外展示四档） ---------------- */

type Level = "REAL_NAME" | "LIGHT_ANON" | "HEAVY_ANON" | "INVISIBLE";
const LEVELS: Level[] = ["REAL_NAME", "LIGHT_ANON", "HEAVY_ANON", "INVISIBLE"];

/** App: PRIVACY_LEVEL_CONFIGS（types/privacy.ts） */
const LEVEL_CONFIGS: Record<Level, { label: string; desc: string }> = {
  REAL_NAME: { label: "实名", desc: "展示完整简历信息" },
  LIGHT_ANON: { label: "轻度匿名", desc: "隐藏身份信息，学校用标签替代" },
  HEAVY_ANON: { label: "深度匿名", desc: "公司学校用类别替代，时间模糊" },
  INVISIBLE: { label: "隐身", desc: "完全隐藏简历" },
};

interface WorkItem {
  company: string;
  period: string;
  position: string;
  desc: string[];
}
interface EduItem {
  school: string;
  period: string;
  degree: string;
}
interface ResumeView {
  name: string;
  contacts: string[];
  summary: string;
  work: WorkItem[];
  education: EduItem[];
  skills: string;
}

const ORIGINAL: ResumeView = {
  name: "陈晓",
  contacts: ["138 1234 5678", "chenxiao@163.com"],
  summary:
    "5 年产品设计经验，主导过内容社区与交易类产品从 0 到 1 的体验搭建，擅长把复杂业务目标拆成可落地的设计方案。关注数据与用户反馈，主导过两次大型改版，核心转化率平均提升 20%+。",
  work: [
    {
      company: "字节跳动",
      period: "2021.04-至今",
      position: "高级产品设计师",
      desc: [
        "负责内容社区产品的体验设计，主导信息流与互动链路改版，核心页面留存提升 15%",
        "搭建设计规范与组件库，覆盖 30+ 业务场景，设计交付效率提升一倍",
      ],
    },
    {
      company: "美团",
      period: "2019.07-2021.03",
      position: "产品设计师",
      desc: ["负责到店交易链路设计，从 0 到 1 搭建拼团玩法，上线后月订单量突破百万"],
    },
  ],
  education: [
    { school: "清华大学", period: "2016.09-2019.06", degree: "硕士 · 工业设计" },
    { school: "江南大学", period: "2012.09-2016.06", degree: "本科 · 工业设计" },
  ],
  skills: "Figma / Principle / 用户研究 / 数据分析 / 设计系统",
};

/** 轻度匿名：隐藏身份信息，学校用标签替代 */
const LIGHT_ANON: ResumeView = {
  ...ORIGINAL,
  name: "陈*",
  contacts: ["138****5678", "c***@163.com"],
  education: [
    { ...ORIGINAL.education[0], school: "985 高校" },
    { ...ORIGINAL.education[1], school: "211 高校" },
  ],
};

/** 深度匿名：公司学校用类别替代，时间模糊 */
const HEAVY_ANON: ResumeView = {
  ...LIGHT_ANON,
  work: [
    { ...ORIGINAL.work[0], company: "某头部互联网公司", period: "2021 年-至今" },
    { ...ORIGINAL.work[1], company: "某本地生活平台", period: "2019 年-2021 年" },
  ],
  education: [
    { school: "某重点高校", period: "2016 年-2019 年", degree: "硕士 · 工业设计" },
    { school: "某重点高校", period: "2012 年-2016 年", degree: "本科 · 工业设计" },
  ],
};

const VIEW_BY_LEVEL: Record<Exclude<Level, "INVISIBLE">, ResumeView> = {
  REAL_NAME: ORIGINAL,
  LIGHT_ANON: LIGHT_ANON,
  HEAVY_ANON: HEAVY_ANON,
};

/* ---------------- 手机屏 ---------------- */

const DESIGN_W = 390;
const DESIGN_H = 800;

function PhoneScreen({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-[24px] border border-line bg-[#FBFBFB] shadow-[0_24px_48px_rgba(0,0,0,0.10)]"
      style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}`, fontFamily: SYSTEM_FONT }}
    >
      <div
        className="relative h-full w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: DESIGN_W, height: DESIGN_H }}
      >
        {children}
      </div>
    </div>
  );
}

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TEXT_NEAR_BLACK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/** App: DiffText —— 当前值与原始值不一致时琥珀色高亮 */
function DiffText({
  original,
  current,
  className,
  style,
  inline,
  center,
}: {
  original: string;
  current: string;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
  center?: boolean;
}) {
  const isDiff = original.trim() !== "" && current.trim() !== "" && original !== current;
  if (!isDiff) {
    return (
      <span className={className} style={style}>
        {current}
      </span>
    );
  }
  const highlight: React.CSSProperties = inline
    ? { backgroundColor: ACCENT_AMBER_LIGHT, borderRadius: 3, paddingLeft: 3, paddingRight: 3 }
    : { backgroundColor: ACCENT_AMBER_LIGHT, borderRadius: 4, padding: "1px 4px" };
  return (
    <span className={center ? "flex justify-center" : "inline-flex"}>
      <span className={className} style={{ ...style, ...highlight }}>
        {current}
      </span>
    </span>
  );
}

/** 黄色高亮 = 可点击修改。DiffText 基础上包一层按钮 */
function EditableDiff({
  fieldKey,
  original,
  current,
  className,
  style,
  inline,
  center,
  onEdit,
  fieldRef,
}: {
  fieldKey: string;
  original: string;
  current: string;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
  center?: boolean;
  onEdit?: (key: string) => void;
  fieldRef?: React.RefObject<HTMLSpanElement | null>;
}) {
  const isDiff = original.trim() !== "" && current.trim() !== "" && original !== current;
  const clickable = isDiff && !!onEdit;
  const body = (
    <DiffText original={original} current={current} className={className} style={style} inline={inline} center={center} />
  );
  if (!clickable) return body;
  return (
    <span ref={fieldRef} className={center ? "flex justify-center" : "inline-flex"}>
      <button
        type="button"
        onClick={() => onEdit(fieldKey)}
        className="cursor-pointer rounded transition-shadow hover:ring-2 hover:ring-[rgba(251,191,36,0.45)]"
        aria-label={`修改${metaFor(fieldKey)?.label || ""}`}
      >
        {body}
      </button>
    </span>
  );
}

/** 取字段在当前档位下的默认值（未自定义时的展示值） */
function fieldBase(key: string, v: ResumeView): string {
  if (key === "name") return v.name;
  if (key.startsWith("contact_")) return v.contacts[Number(key.slice(8))] || "";
  if (key.startsWith("school_")) return v.education[Number(key.slice(7))]?.school || "";
  if (key.startsWith("company_")) return v.work[Number(key.slice(8))]?.company || "";
  if (key.startsWith("workPeriod_")) return v.work[Number(key.slice(11))]?.period || "";
  if (key.startsWith("eduPeriod_")) return v.education[Number(key.slice(10))]?.period || "";
  return "";
}

/* ---------------- 隐身模式：锁 + 四圈水波纹 ---------------- */

function LockIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M16 8.25C18.6234 8.25 20.75 10.3766 20.75 13V17C20.75 19.6234 18.6234 21.75 16 21.75H8C5.37665 21.75 3.25 19.6234 3.25 17V13C3.25 10.3766 5.37665 8.25 8 8.25H16ZM12 13.25C11.5858 13.25 11.25 13.5858 11.25 14V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V14C12.75 13.5858 12.4142 13.25 12 13.25Z"
        fill={color}
      />
      <path d="M16 9V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7L8 9" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

/** App: PrivacyRings —— 4 圈水波从中心向外扩散（3s 循环，750ms 交错） */
function PrivacyRings() {
  return (
    <div className="absolute flex items-center justify-center" style={{ width: 180, height: 180 }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: 80, height: 80, backgroundColor: PRIMARY_SOFT_FAINT }}
          initial={{ scale: 0.3, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{
            scale: { duration: 3, ease: "easeOut", repeat: Infinity, delay: i * 0.75 },
            opacity: { duration: 3, ease: "easeIn", repeat: Infinity, delay: i * 0.75 },
          }}
        />
      ))}
    </div>
  );
}

function InvisibleContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center" style={{ backgroundColor: BG_OFF_WHITE }}>
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180, marginBottom: 28 }}>
        <PrivacyRings />
        <div
          className="z-[2] flex items-center justify-center rounded-full bg-white"
          style={{ width: 60, height: 60 }}
        >
          <LockIcon size={28} color={PRIMARY} />
        </div>
      </div>
      <p className="text-[20px] font-semibold" style={{ color: "#000" }}>
        隐身模式
      </p>
      <p className="mt-2 text-center text-[14px] leading-[22px]" style={{ color: TEXT_SECONDARY }}>
        简历已完全隐藏
        <br />
        招聘方无法查看任何信息
      </p>
    </div>
  );
}

/* ---------------- 简历卡片内容（实名 / 轻度 / 深度共用） ---------------- */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="rounded-sm" style={{ width: 4, height: 18, backgroundColor: PRIMARY_SOFT }} />
      <span className="text-[15px] font-semibold" style={{ color: TEXT_NEAR_BLACK }}>
        {children}
      </span>
    </div>
  );
}

function ResumeCardContent({
  view,
  original,
  custom = {},
  onEdit,
  nameRef,
}: {
  view: ResumeView;
  original: ResumeView;
  custom?: Record<string, string>;
  onEdit?: (key: string) => void;
  nameRef?: React.RefObject<HTMLSpanElement | null>;
}) {
  /** 自定义值覆盖档位默认值（App 的 customFields 逻辑） */
  const disp = (key: string, base: string) => custom[key] ?? base;
  return (
    <div className="pb-5">
      {/* 个人信息 */}
      <div className="flex flex-col items-center p-6 pb-5">
        <Image src={AVATAR_URL} alt="" width={64} height={64} className="mb-2 rounded-full" unoptimized />
        <EditableDiff
          fieldKey="name"
          original={original.name}
          current={disp("name", view.name)}
          center
          className="mb-2 text-[22px] font-semibold"
          style={{ color: TEXT_NEAR_BLACK }}
          onEdit={onEdit}
          fieldRef={nameRef}
        />
        <div className="flex flex-wrap items-center justify-center">
          {view.contacts.map((c, i) => (
            <span key={i} className="text-[13px]" style={{ color: TEXT_COOL_GRAY_600 }}>
              {i > 0 && <span style={{ color: RAW_D1D5DB }}> | </span>}
              <EditableDiff
                fieldKey={`contact_${i}`}
                original={original.contacts[i] || c}
                current={disp(`contact_${i}`, c)}
                inline
                onEdit={onEdit}
              />
            </span>
          ))}
        </div>
      </div>

      {/* 个人简介 */}
      <div className="px-5 py-3.5">
        <DiffText
          original={original.summary}
          current={view.summary}
          className="text-[14px] leading-5"
          style={{ color: TEXT_COOL_GRAY_600 }}
        />
      </div>

      {/* 工作经历 */}
      <div className="px-5 py-4">
        <SectionHeader>工作经历</SectionHeader>
        {view.work.map((w, i) => (
          <div
            key={i}
            className="ml-3.5 py-3"
            style={{
              paddingTop: i === 0 ? 0 : undefined,
              borderBottom: i < view.work.length - 1 ? `0.5px solid ${BG_GRAY}` : undefined,
            }}
          >
            <div className="mb-1.5 flex items-start justify-between gap-3">
              <EditableDiff
                fieldKey={`company_${i}`}
                original={original.work[i]?.company || w.company}
                current={disp(`company_${i}`, w.company)}
                className="flex-1 text-[14px] font-medium"
                style={{ color: TEXT_NEAR_BLACK }}
                onEdit={onEdit}
              />
              <EditableDiff
                fieldKey={`workPeriod_${i}`}
                original={original.work[i]?.period || w.period}
                current={disp(`workPeriod_${i}`, w.period)}
                inline
                className="shrink-0 text-[14px] font-light"
                style={{ color: TEXT_GRAY }}
                onEdit={onEdit}
              />
            </div>
            <p className="mb-1.5 text-[14px]" style={{ color: TEXT_NEAR_BLACK }}>
              {w.position}
            </p>
            <div className="flex flex-col gap-1.5">
              {w.desc.map((line, li) => (
                <DiffText
                  key={li}
                  original={original.work[i]?.desc[li] || line}
                  current={line}
                  className="text-[14px] leading-5"
                  style={{ color: TEXT_SECONDARY }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 教育背景 */}
      <div className="px-5 py-4">
        <SectionHeader>教育背景</SectionHeader>
        {view.education.map((e, i) => (
          <div
            key={i}
            className="ml-3.5 py-3"
            style={{
              paddingTop: i === 0 ? 0 : undefined,
              borderBottom: i < view.education.length - 1 ? `0.5px solid ${BG_GRAY}` : undefined,
            }}
          >
            <div className="mb-1.5 flex items-start justify-between gap-3">
              <EditableDiff
                fieldKey={`school_${i}`}
                original={original.education[i]?.school || e.school}
                current={disp(`school_${i}`, e.school)}
                className="flex-1 text-[14px] font-medium"
                style={{ color: TEXT_NEAR_BLACK }}
                onEdit={onEdit}
              />
              <EditableDiff
                fieldKey={`eduPeriod_${i}`}
                original={original.education[i]?.period || e.period}
                current={disp(`eduPeriod_${i}`, e.period)}
                inline
                className="shrink-0 text-[14px] font-light"
                style={{ color: TEXT_GRAY }}
                onEdit={onEdit}
              />
            </div>
            <p className="text-[14px]" style={{ color: TEXT_NEAR_BLACK }}>
              {e.degree}
            </p>
          </div>
        ))}
      </div>

      {/* 核心技能 */}
      <div className="px-5 py-4">
        <SectionHeader>核心技能</SectionHeader>
        <DiffText
          original={original.skills}
          current={view.skills}
          className="text-[14px] leading-5"
          style={{ color: TEXT_SECONDARY }}
        />
      </div>
    </div>
  );
}

/** App: CompareIcon（按住对比原始简历） */
function CompareIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024">
      <path
        d="M116.364 837.818h279.272v93.091H23.273V93.091h372.363v93.09H116.364v651.637z m512 0h93.09v93.091h-93.09v-93.09z m139.636 0h93.09v93.091H768v-93.09z m139.636 93.091v-93.09h93.091v93.09h-93.09z m0-325.818V512h93.091v93.09h-93.09z m0 139.636v-93.09h93.091v93.09h-93.09z m0-279.272v-93.091h93.091v93.09h-93.09z m0-139.637v-93.09h93.091v93.09h-93.09z m0-139.636V93.09h93.091v93.09h-93.09z m-46.545 0H768V93.09h93.09v93.09z m-139.636 0h-93.091V93.09h93.09v93.09zM488.727 0h93.091v1024h-93.09V0z"
        fill={color}
      />
    </svg>
  );
}

/* ---------------- 隐私滑块（PrivacySlider.tsx 复刻） ---------------- */

const TRACK_W = DESIGN_W - 32; // px-4 两侧各 16
const TRACK_H = 40;
const HANDLE = 34;
const DOT = 8;
const ZONE = TRACK_W / 4;
const HANDLE_MIN = ZONE / 2 - HANDLE / 2;
const HANDLE_MAX = TRACK_W - ZONE / 2 - HANDLE / 2;
const HANDLE_LEFTS = LEVELS.map((_, i) => HANDLE_MIN + ((HANDLE_MAX - HANDLE_MIN) * i) / 3);
const FILL_WIDTHS = LEVELS.map((_, i) => (i === 3 ? TRACK_W : HANDLE_LEFTS[i] + HANDLE + 4));
const DOT_CENTERS = LEVELS.map((_, i) => ZONE / 2 + ((TRACK_W - ZONE / 2 - ZONE / 2) * i) / 3);

function PrivacySlider({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const handleX = useMotionValue(HANDLE_LEFTS[index]);
  const handleScale = useMotionValue(1);
  const bubbleIdx = useMotionValue(index);
  const dotScales = [useMotionValue(1), useMotionValue(1), useMotionValue(1), useMotionValue(1)];
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startLeftRef = useRef(HANDLE_LEFTS[index]);
  const movedRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const fillWidth = useTransform(handleX, HANDLE_LEFTS, FILL_WIDTHS, { clamp: true });
  const bubbleLeft = useTransform(bubbleIdx, (v) => `${v * 25}%`);

  /* 档位变化：滑块归位 200ms + 气泡弹簧 + 圆点弹跳（App 完全一致） */
  useEffect(() => {
    if (!draggingRef.current) {
      animate(handleX, HANDLE_LEFTS[index], { duration: 0.2, ease: "easeInOut" });
      animate(bubbleIdx, index, { type: "spring", stiffness: 120, damping: 14 });
      const dot = dotScales[index];
      animate(dot, 1.8, { duration: 0.15, ease: "easeOut" }).then(() => {
        animate(dot, 1, { type: "spring", stiffness: 300, damping: 8 });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    draggingRef.current = true;
    setDragging(true);
    movedRef.current = 0;
    startXRef.current = e.clientX;
    startLeftRef.current = handleX.get();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    animate(handleScale, 1.15, { type: "spring", stiffness: 300, damping: 10 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const el = trackRef.current;
    const scale = el ? el.getBoundingClientRect().width / TRACK_W : 1;
    const dx = (e.clientX - startXRef.current) / scale;
    movedRef.current = dx;
    const next = Math.max(HANDLE_MIN, Math.min(HANDLE_MAX, startLeftRef.current + dx));
    handleX.set(next);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    animate(handleScale, 1, { type: "spring", stiffness: 300, damping: 10 });

    /* App 吸附规则：位移 <5 取最近档；右滑取 ceil；左滑取 floor */
    const uWidth = HANDLE_MAX - HANDLE_MIN;
    const continuous = ((handleX.get() - HANDLE_MIN) / uWidth) * 3;
    const dx = movedRef.current;
    let next: number;
    if (Math.abs(dx) < 5) next = Math.round(continuous);
    else if (dx > 0) next = Math.ceil(continuous);
    else next = Math.floor(continuous);
    next = Math.max(0, Math.min(3, next));

    animate(handleX, HANDLE_LEFTS[next], { duration: 0.2, ease: "easeInOut" });
    if (next !== index) onChange(next);
  };

  return (
    <div className="select-none">
      {/* 轨道 */}
      <div
        ref={trackRef}
        className="relative flex items-center"
        style={{ width: TRACK_W, height: TRACK_H, borderRadius: 20, backgroundColor: BG_CLOUD }}
      >
        {/* 绿色渐变填充条 */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 overflow-hidden"
          style={{ width: fillWidth, borderRadius: 20 }}
        >
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(90deg, ${SLIDER_START} 0%, ${SLIDER_END} 100%)` }}
          />
        </motion.div>

        {/* 4 个节点圆点 */}
        {LEVELS.map((lv, i) => (
          <motion.span
            key={lv}
            className="absolute rounded-full"
            style={{
              width: DOT,
              height: DOT,
              left: DOT_CENTERS[i] - DOT / 2,
              top: (TRACK_H - DOT) / 2,
              zIndex: 5,
              scale: dotScales[i],
              backgroundColor: i <= index && !dragging ? "#FFFFFF" : RAW_D1D5DB,
            }}
          />
        ))}

        {/* 滑块 */}
        <motion.div
          className="absolute cursor-grab rounded-full bg-white active:cursor-grabbing"
          style={{
            width: HANDLE,
            height: HANDLE,
            top: (TRACK_H - HANDLE) / 2,
            left: 0,
            x: handleX,
            scale: handleScale,
            zIndex: 10,
            boxShadow: dragging ? "0 2px 12px rgba(0,0,0,0.20)" : "0 2px 8px rgba(0,0,0,0.12)",
            touchAction: "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />

        {/* 四段点击区 */}
        <div className="absolute inset-0 z-[1] flex">
          {LEVELS.map((lv, i) => (
            <button key={lv} type="button" aria-label={LEVEL_CONFIGS[lv].label} className="flex-1" onClick={() => onChange(i)} />
          ))}
        </div>
      </div>

      {/* 标签区（气泡滑动跟随） */}
      <div className="relative mt-1.5 flex">
        <motion.div className="absolute top-0 bottom-0 flex items-center justify-center" style={{ left: bubbleLeft, width: "25%" }}>
          <div className="h-full rounded-full" style={{ width: "80%", backgroundColor: PRIMARY_BG_MUTED }} />
        </motion.div>
        {LEVELS.map((lv, i) => (
          <button
            key={lv}
            type="button"
            className="relative flex-1 py-1.5 text-center text-[12px]"
            style={{
              color: i === index ? PRIMARY : TEXT_TERTIARY,
              fontWeight: i === index ? 600 : 400,
            }}
            onClick={() => onChange(i)}
          >
            {LEVEL_CONFIGS[lv].label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 编辑弹窗（App: FieldEditModal 同款） ---------------- */

function FieldEditDialog({
  label,
  placeholder,
  baseValue,
  value,
  onChange,
  onSave,
  onCancel,
  readOnly,
  savePulse,
}: {
  label: string;
  placeholder: string;
  /** 档位默认值：输入与其不一致时显示「恢复原始」 */
  baseValue: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  /** 演示模式：只读 + 光标闪烁 */
  readOnly?: boolean;
  savePulse?: boolean;
}) {
  const isModified = value.trim() !== baseValue;
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: OVERLAY_BLACK }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-[85%] rounded-2xl bg-white p-5"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-4 text-center text-[17px] font-semibold text-black">编辑{label}</p>
        <div className="relative">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            autoFocus={!readOnly}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") onCancel();
            }}
            className="h-11 w-full rounded-lg border px-3 text-[15px] text-black outline-none focus:border-[#6FCDAE]"
            style={{ borderColor: DIVIDER_DARK, backgroundColor: BG_SECONDARY }}
          />
          {readOnly && (
            <span
              className="pointer-events-none absolute top-1/2 h-5 w-[2px] -translate-y-1/2 animate-pulse"
              style={{ left: 12 + value.length * 15, backgroundColor: PRIMARY }}
            />
          )}
        </div>
        {placeholder && value === "" && (
          <p className="mt-1.5 text-[12px]" style={{ color: TEXT_GRAY_LIGHT }}>
            {placeholder}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          {isModified ? (
            <button type="button" onClick={() => onChange(baseValue)} className="px-2 py-1.5 text-[14px]" style={{ color: PRIMARY }}>
              恢复原始
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-5 py-2.5 text-[15px] font-medium"
              style={{ backgroundColor: BG_NEUTRAL_LIGHT, color: TEXT_SECONDARY }}
            >
              取消
            </button>
            <motion.button
              type="button"
              onClick={onSave}
              className="rounded-lg px-5 py-2.5 text-[15px] font-medium text-white"
              style={{ backgroundColor: PRIMARY }}
              animate={savePulse ? { scale: [1, 0.88, 1] } : { scale: 1 }}
              transition={{ duration: 0.28 }}
            >
              保存
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- 手机屏内容 ---------------- */

function PrivacyPhone({
  levelIdx,
  onLevelChange,
  peeking,
  onPeekChange,
}: {
  levelIdx: number;
  onLevelChange: (i: number) => void;
  peeking: boolean;
  onPeekChange: (v: boolean) => void;
}) {
  const cardX = useMotionValue(0);
  const cardOpacity = useMotionValue(1);
  const baseScrollRef = useRef<HTMLDivElement>(null);
  const peekScrollRef = useRef<HTMLDivElement>(null);

  const level = LEVELS[levelIdx];
  const canPeek = level === "LIGHT_ANON" || level === "HEAVY_ANON";
  const view = level === "INVISIBLE" ? ORIGINAL : VIEW_BY_LEVEL[level];

  /* ---- 字段编辑：自定义覆盖值 + 弹窗 + 演示 ---- */
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [dialogKey, setDialogKey] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [savePulse, setSavePulse] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const nameRef = useRef<HTMLSpanElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const demoRan = useRef(false);

  /* 手指演示的动画值 */
  const fingerX = useMotionValue(DESIGN_W / 2);
  const fingerY = useMotionValue(DESIGN_H * 0.85);
  const fingerScale = useMotionValue(1);
  const fingerOpacity = useMotionValue(0);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  /* 实名/隐身档不套用自定义值（App 里自定义只作用于匿名版本） */
  const editable = level === "LIGHT_ANON" || level === "HEAVY_ANON";
  const effectiveCustom = editable ? custom : {};

  const displayOf = (key: string) => effectiveCustom[key] ?? fieldBase(key, view);

  const openEdit = (key: string) => {
    setInputVal(displayOf(key));
    setDialogKey(key);
  };

  const closeEdit = () => setDialogKey(null);

  const saveEdit = () => {
    if (!dialogKey) return;
    const v = inputVal.trim();
    const base = fieldBase(dialogKey, view);
    setCustom((c) => {
      const next = { ...c };
      if (v === "" || v === base) delete next[dialogKey];
      else next[dialogKey] = v;
      return next;
    });
    setDialogKey(null);
  };

  /** 换档：内容立即切换，新卡从另一侧轻滑淡入（网页上去掉 App 两段式弹跳的顿挫感） */
  const changeLevel = (i: number) => {
    if (i === levelIdx) return;
    onPeekChange(false);
    setDialogKey(null);
    const dir = i > levelIdx ? -1 : 1;
    onLevelChange(i);
    cardX.set(-dir * 56);
    cardOpacity.set(0.35);
    animate(cardX, 0, { type: "spring", stiffness: 260, damping: 26 });
    animate(cardOpacity, 1, { duration: 0.28, ease: "easeOut" });
  };

  /* 偷看时同步滚动位置（App 用 anchor 对齐，这里直接对齐 scrollTop） */
  useEffect(() => {
    if (!peeking) return;
    if (baseScrollRef.current && peekScrollRef.current) {
      peekScrollRef.current.scrollTop = baseScrollRef.current.scrollTop;
    }
  }, [peeking]);

  const startPeek = () => {
    if (!canPeek) return;
    onPeekChange(true);
  };

  /* ---- 自动演示：手指点「陈*」→ 弹窗打字机改成「陈先生」→ 保存 ---- */
  const inView = useInView(colRef, { amount: 0.6, once: true });
  useEffect(() => {
    if (!inView || demoRan.current) return;
    demoRan.current = true;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const run = async () => {
      await sleep(1000);
      if (LEVELS[levelIdx] !== "LIGHT_ANON" && LEVELS[levelIdx] !== "HEAVY_ANON") return;
      const field = nameRef.current;
      const col = colRef.current;
      if (!field || !col) return;
      const fr = field.getBoundingClientRect();
      const cr = col.getBoundingClientRect();
      const scale = cr.width / DESIGN_W || 1;
      const tx = (fr.left + fr.width / 2 - cr.left) / scale;
      const ty = (fr.top + fr.height / 2 - cr.top) / scale;

      await animate(fingerOpacity, 1, { duration: 0.25 });
      await Promise.all([
        animate(fingerX, tx, { duration: 0.55, ease: "easeInOut" }),
        animate(fingerY, ty, { duration: 0.55, ease: "easeInOut" }),
      ]);
      await animate(fingerScale, 0.78, { duration: 0.12 });
      setRipple({ x: tx, y: ty, id: Date.now() });
      animate(fingerScale, 1, { duration: 0.2 });
      await sleep(200);

      setDemoActive(true);
      openEdit("name");
      await sleep(600);
      setInputVal("陈*");
      await sleep(500);
      setInputVal("陈");
      await sleep(170);
      setInputVal("陈先");
      await sleep(170);
      setInputVal("陈先生");
      await sleep(500);
      setSavePulse(true);
      await sleep(300);
      setSavePulse(false);
      setCustom((c) => ({ ...c, name: "陈先生" }));
      setDialogKey(null);
      setDemoActive(false);
      await sleep(250);
      await animate(fingerOpacity, 0, { duration: 0.3 });
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <PhoneScreen>
      <div ref={colRef} className="relative flex h-full flex-col">
        {/* 头部：返回 + segmented（对外展示激活） */}
        <div className="relative flex h-[52px] shrink-0 items-center justify-center">
          <div className="absolute left-4 flex items-center">
            <BackArrow />
          </div>
          <div className="flex rounded-lg p-0.5" style={{ backgroundColor: BG_GRAY }}>
            <span className="rounded-md px-3 py-1.5 text-[13px] font-medium" style={{ color: TEXT_TERTIARY }}>
              原始简历
            </span>
            <span className="rounded-md bg-white px-3 py-1.5 text-[13px] font-semibold" style={{ color: PRIMARY }}>
              对外展示
            </span>
          </div>
        </div>

        {/* 卡片区（底部顶到滑块区，卡片无下圆角被裁断） */}
        <div className="min-h-0 flex-1 overflow-hidden px-4 pt-2">
        <motion.div className="h-full" style={{ x: cardX, opacity: cardOpacity }}>
          <div
            className="relative h-full overflow-hidden bg-white"
            style={{
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {level === "INVISIBLE" && !peeking ? (
              <InvisibleContent />
            ) : (
              <>
                <div
                  ref={baseScrollRef}
                  className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                >
                  <ResumeCardContent
                    view={view}
                    original={ORIGINAL}
                    custom={effectiveCustom}
                    onEdit={editable ? openEdit : undefined}
                    nameRef={nameRef}
                  />
                </div>

                {/* 偷看层：按住显示原始简历 */}
                {peeking && canPeek && (
                  <div className="absolute inset-0 z-[2] bg-white">
                    <div
                      ref={peekScrollRef}
                      className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                    >
                      <ResumeCardContent view={ORIGINAL} original={ORIGINAL} />
                    </div>
                  </div>
                )}

                {/* 按住对比按钮 */}
                {canPeek && (
                  <div
                    className="absolute bottom-3 right-3 z-[4] overflow-hidden rounded-full"
                    style={{ width: 36, height: 36, backgroundColor: peeking ? PRIMARY : undefined }}
                  >
                    {!peeking && (
                      <>
                        <div className="absolute inset-0" style={{ backgroundColor: MASKED_GRAY_OVERLAY }} />
                        <div className="absolute inset-0 backdrop-blur-[8px]" />
                      </>
                    )}
                    <button
                      type="button"
                      aria-label="按住对比原始简历"
                      className="relative z-[2] flex h-full w-full items-center justify-center"
                      style={{ touchAction: "none" }}
                      onPointerDown={startPeek}
                      onPointerUp={() => onPeekChange(false)}
                      onPointerLeave={() => onPeekChange(false)}
                      onPointerCancel={() => onPeekChange(false)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <CompareIcon size={18} color={peeking ? "#FFFFFF" : PRIMARY} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

        {/* 滑块区（文档流底部，与卡片紧贴） */}
        <div className="shrink-0 border-t bg-white px-4 pb-5 pt-4" style={{ borderColor: BG_GRAY }}>
          <PrivacySlider index={levelIdx} onChange={changeLevel} />
          <div className="mt-3 text-center">
            <p className="text-[16px] font-semibold text-black">{LEVEL_CONFIGS[level].label}</p>
            <p className="mt-1 text-[13px]" style={{ color: TEXT_GRAY_MEDIUM }}>
              {LEVEL_CONFIGS[level].desc}
            </p>
          </div>
        </div>

        {/* 演示：点击涟漪 */}
        {ripple && (
          <motion.span
            key={ripple.id}
            className="pointer-events-none absolute z-[45] rounded-full"
            style={{
              left: ripple.x - 22,
              top: ripple.y - 22,
              width: 44,
              height: 44,
              border: `2px solid ${PRIMARY_SOFT}`,
            }}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {/* 演示：手指 */}
        <motion.div
          className="pointer-events-none absolute z-[60] rounded-full bg-white"
          style={{
            width: 22,
            height: 22,
            x: fingerX,
            y: fingerY,
            translateX: "-50%",
            translateY: "-50%",
            scale: fingerScale,
            opacity: fingerOpacity,
            boxShadow: "0 2px 10px rgba(0,0,0,0.25), inset 0 0 0 6px rgba(0,139,104,0.35)",
          }}
        />

        {/* 编辑弹窗（演示与真实编辑共用） */}
        {dialogKey && (
          <FieldEditDialog
            label={metaFor(dialogKey)?.label || ""}
            placeholder={metaFor(dialogKey)?.placeholder || ""}
            baseValue={fieldBase(dialogKey, view)}
            value={inputVal}
            onChange={setInputVal}
            onSave={saveEdit}
            onCancel={closeEdit}
            readOnly={demoActive}
            savePulse={savePulse}
          />
        )}
      </div>
    </PhoneScreen>
  );
}

/* ---------------- 区块 ---------------- */

/** 文案区外置的对比按钮：与卡片右下角那颗同款，按住即可对照原始简历 */
function PeekDemoButton({
  active,
  disabled,
  onPeekStart,
  onPeekEnd,
}: {
  active: boolean;
  disabled: boolean;
  onPeekStart: () => void;
  onPeekEnd: () => void;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border border-line transition-opacity"
      style={{
        width: 44,
        height: 44,
        backgroundColor: active ? PRIMARY : "#FFFFFF",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {!active && (
        <>
          <div className="absolute inset-0" style={{ backgroundColor: MASKED_GRAY_OVERLAY }} />
          <div className="absolute inset-0 backdrop-blur-[8px]" />
        </>
      )}
      <button
        type="button"
        aria-label="按住对比原始简历"
        className="relative z-[2] flex h-full w-full items-center justify-center"
        style={{ touchAction: "none", cursor: disabled ? "default" : "pointer" }}
        onPointerDown={() => {
          if (!disabled) onPeekStart();
        }}
        onPointerUp={onPeekEnd}
        onPointerLeave={onPeekEnd}
        onPointerCancel={onPeekEnd}
        onContextMenu={(e) => e.preventDefault()}
      >
        <CompareIcon size={20} color={active ? "#FFFFFF" : PRIMARY} />
      </button>
    </div>
  );
}

export function AgentPrivacyShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [levelIdx, setLevelIdx] = useState(1); // 默认轻度匿名，能看到差异高亮
  const [peeking, setPeeking] = useState(false);
  const canPeek = levelIdx === 1 || levelIdx === 2;

  return (
    <section data-nav-theme="light" className="theme-light bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-16">
          {/* 左：标题 + 文案 + 对比按钮说明 */}
          <div className="max-w-xl">
            <motion.h2
              data-journey-anchor
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="display mt-4 text-3xl leading-[0.92] sm:text-5xl"
            >
              {isZh ? "匿名简历：展示多少，你说了算" : "Anonymous resume: you set the exposure"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
            >
              {isZh
                ? "简历是你的，以什么面目示人也该由你决定。拖动滑块，在实名、轻度匿名、深度匿名和隐身之间自由切换——每一档对外展示什么、隐去什么，高亮标得一目了然。"
                : "Your resume belongs to you — and so does its public face. Drag the slider across real-name, light anonymity, deep anonymity and invisible; everything shown or hidden is highlighted at a glance."}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center gap-4"
            >
              <PeekDemoButton
                active={peeking}
                disabled={!canPeek}
                onPeekStart={() => setPeeking(true)}
                onPeekEnd={() => setPeeking(false)}
              />
              <div>
                <p className="text-sm font-semibold">
                  {isZh ? "按住，对比原始简历" : "Hold to compare with the original"}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  {isZh
                    ? "轻度/深度匿名档下按住它（右下角那颗也行），招聘方看到的和原始简历差在哪，一眼看清，松开即恢复。"
                    : "In light or deep anonymity, hold it (or the one on the card) to see what recruiters see versus the original; release to flip back."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* 右：手机（min-w-0 防 grid 轨道被固定画布吹破） */}
          <div className="w-full min-w-0 max-w-[380px] justify-self-center">
            <PrivacyPhone
              levelIdx={levelIdx}
              onLevelChange={setLevelIdx}
              peeking={peeking}
              onPeekChange={setPeeking}
            />
            <p className="mt-3 text-center font-mono text-xs text-muted">
              {isZh ? "对外展示 · 滑块可拖拽，黄色高亮可点击修改" : "External view · drag the slider, tap highlights to edit"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
