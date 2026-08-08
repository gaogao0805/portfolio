"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";

/**
 * 「委托详情」三联页：详情（深色门板，新增人才卡露出）→ 新增人才 → 复核。
 * 视觉参数全部来自 frontend-app-demo 的 feature/delegate 分支：
 * - DelegateDetailScreen.tsx + DelegateProgressSection.tsx（SummaryCard/星星/门板）
 * - 新增人才页（经纪人引言 + 候选人卡）
 * - DelegateItemDetailScreen.tsx + ActionBar.tsx（候选人卡与三按钮）
 */

const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';

const TEXT_SECONDARY = "#7B838D";
const TEXT_GRAY_MEDIUM = "#9EA7B3";
const GOLD = "#A48341";
const GOLD_NUM = "#EFB54D";
const TEAL = "#02A87E";
const AGENT_AVATAR =
  "https://static.go2ready.com/app/agents/Shenrui/job-recommendation/avatar/Shenrui_job-recommendation_avatar.png";

/* ---------------- 小图标 ---------------- */

function BackArrow() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171718" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

/** App: 大四角星装饰（SummaryCard 右缘，呼吸） */
function BigStar({ color = "#FFBF59" }: { color?: string }) {
  return (
    <motion.svg
      width="52"
      height="52"
      viewBox="0 0 20 20"
      animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "blur(0.2px)" }}
    >
      <path
        d="M10 0C10 7 13 10 20 10C13 10 10 13 10 20C10 13 7 10 0 10C7 10 10 7 10 0Z"
        fill={color}
        opacity="0.85"
      />
    </motion.svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT_GRAY_MEDIUM} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3 3-4.6 5.5-4.6S13.9 16 14.5 19" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M15.5 14.6c2.6.2 4.4 1.6 5 4.4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={TEXT_GRAY_MEDIUM} strokeWidth="1.4">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

/* ---------------- 三联共用：手机壳 ---------------- */

const DESIGN_W = 390;
const DESIGN_H = 800;

function PhoneScreen({
  children,
  topGradient,
}: {
  children: React.ReactNode;
  /** 顶部 34% 渐变起始色（WarmBg 同款） */
  topGradient: string;
}) {
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
      {/* WarmBg 顶部渐变 */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{ height: "34%", background: `linear-gradient(180deg, ${topGradient} 0%, rgba(255,255,255,0) 100%)` }}
      />
      <div className="relative h-full w-full" style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: DESIGN_W, height: DESIGN_H }}>
        {children}
      </div>
    </div>
  );
}

/* ---------------- 第 1 页：委托详情（整页 1:1，长条以下浅灰蒙板） ---------------- */

/** App: SummaryCard 的 LayoutGridIcon（四个 7×7 描边小方块） */
function LayoutGridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={TEXT_GRAY_MEDIUM} strokeWidth="1.4">
      <rect x="1.5" y="1.5" width="5.2" height="5.2" rx="1" />
      <rect x="9.3" y="1.5" width="5.2" height="5.2" rx="1" />
      <rect x="1.5" y="9.3" width="5.2" height="5.2" rx="1" />
      <rect x="9.3" y="9.3" width="5.2" height="5.2" rx="1" />
    </svg>
  );
}

/** App: 「对方新进展」行图标盒 */
function DynIcon({ color, bg, path }: { color: string; bg: string; path: string }) {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded" style={{ backgroundColor: bg }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </span>
  );
}

function DelegateDetailPage() {
  return (
    <PhoneScreen topGradient="#FFE9D5">
      {/* 导航栏：返回 + 居中标题 + 经纪人 pill + 更多 */}
      <div className="relative flex h-14 items-center justify-between px-1">
        <span className="flex h-12 w-12 items-center justify-center">
          <BackArrow />
        </span>
        <div className="absolute left-14 right-14 text-center">
          <p className="truncate text-[18px] font-semibold text-black">高级前端工程师</p>
          <div className="mt-1 flex justify-center">
            <span className="flex h-6 items-center rounded-xl bg-white/50 pl-1 pr-2">
              <Image src={AGENT_AVATAR} alt="沈睿" width={16} height={16} className="mr-1 h-4 w-4 rounded-full object-cover" unoptimized />
              <span className="text-[12px] font-medium" style={{ color: "#656D76" }}>沈睿</span>
            </span>
          </div>
        </div>
        <span className="flex h-12 w-10 items-center justify-center">
          <DotsIcon />
        </span>
      </div>

      <div className="relative">
        {/* ① SummaryCard：新增人才（浮在深色门板之上，纯橙色描边） */}
        <div className="relative z-30 mx-4 mt-4">
          <div className="relative overflow-hidden rounded-xl border bg-white px-5 pb-2.5 pt-7 shadow-[0_8px_24px_rgba(0,0,0,0.14)]" style={{ borderColor: "rgba(255, 191, 89, 0.6)" }}>
            {/* 右缘大四角星：径向渐变 + 柔化 + 呼吸（App StarDecoration） */}
            <motion.div
              className="pointer-events-none absolute right-1 top-1/2"
              style={{ translateY: "-50%", filter: "blur(5px)" }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="110" height="110" viewBox="0 0 20 20">
                <defs>
                  <radialGradient id="starGold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFBF59" />
                    <stop offset="100%" stopColor="#FFF7C5" stopOpacity="0.3" />
                  </radialGradient>
                </defs>
                <path d="M10 0C10 7 13 10 20 10C13 10 10 13 10 20C10 13 7 10 0 10C7 10 10 7 10 0Z" fill="url(#starGold)" />
              </svg>
            </motion.div>
            <div className="relative flex items-center">
              <span className="mr-5 text-[40px] font-bold leading-[48px] tracking-[1.1px]" style={{ color: GOLD_NUM }}>
                5
              </span>
              <div className="max-w-[62%]">
                <p className="text-[19px] font-semibold leading-[25px] tracking-[0.5px] text-black">新增人才</p>
                <p className="mt-1.5 text-[14px] leading-5" style={{ color: TEXT_SECONDARY }}>
                  为你找到 <span className="font-semibold">5</span> 位合适候选人，可以随时开聊
                </p>
              </div>
            </div>
            {/* 底部操作条：只有人才总览 */}
            <div className="mt-4 flex h-7 items-center border-t" style={{ borderColor: "#F1F2F4" }}>
              <span className="flex items-center gap-1.5 text-[13px] leading-5" style={{ color: TEXT_GRAY_MEDIUM }}>
                <LayoutGridIcon />
                人才总览
              </span>
            </div>
          </div>
        </div>

        {/* ② 委托源卡「岗位信息」 */}
        <div className="mx-4 mt-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
          <p className="text-[16px] font-medium leading-6 text-black">岗位信息</p>
          <div className="mb-2 mt-2 h-px" style={{ backgroundColor: "#F1F2F4" }} />
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium leading-[22px] text-black">高级前端工程师</span>
            <span className="text-[14px] font-medium leading-[22px] text-black">25-35K</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="text-[13px] leading-5 text-black">字节跳动</span>
            <span className="text-[13px] leading-5" style={{ color: "#656D76" }}>北京</span>
          </div>
          <p className="mt-1.5 text-[13px] leading-[22px]" style={{ color: TEXT_SECONDARY }}>
            负责前端架构设计与 RN 业务迭代，需要 3 年以上经验。
          </p>
        </div>

        {/* ③ 「经纪人笔记」偏好卡 */}
        <div className="mx-4 mt-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium leading-6 text-black">
              经纪人笔记<span className="ml-1 text-[13px] leading-5" style={{ color: "#BBC1C9" }}>（仅经纪人可见）</span>
            </p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#9EA7B3">
              <path d="M16.84 2.73a2.5 2.5 0 0 1 3.54 0l.9.9a2.5 2.5 0 0 1 0 3.54l-9.9 9.9a1 1 0 0 1-.46.26l-4 1a1 1 0 0 1-1.22-1.22l1-4a1 1 0 0 1 .26-.46l9.9-9.9z" />
            </svg>
          </div>
          <p className="mt-1 text-[13px] leading-5 text-black">这是我根据你的资料填写记录的要点</p>
          <p className="mt-2 text-[13px] leading-[22px]" style={{ color: "#656D76" }}>
            候选人优先看 RN 跨端经验，组件库搭建经历加分
          </p>
          <div className="my-1.5 border-t border-dashed" style={{ borderColor: "#F1F2F4" }} />
          <p className="text-[13px] leading-[22px]" style={{ color: "#656D76" }}>
            沟通时先确认到岗时间
          </p>
          <div className="mt-2 flex gap-1.5">
            {["跨端经验", "组件库", "3年+"].map((tag) => (
              <span key={tag} className="rounded-sm px-2 py-[3px] text-[13px] font-medium leading-[18px]" style={{ backgroundColor: "#F8FAFC", color: GOLD }}>
                {tag}
              </span>
            ))}
          </div>
          <p className="pt-3 text-center text-[13px] leading-[21px]" style={{ color: "#BBC1C9" }}>
            展开全部 · 2
          </p>
        </div>

        {/* ④ 底部管理按钮 */}
        <div className="mx-4 mt-4">
          <div className="flex h-11 items-center justify-center rounded-xl" style={{ backgroundColor: "#F4F5F7" }}>
            <span className="text-[15px] font-medium leading-[21px]" style={{ color: "#656D76" }}>
              暂停委托
            </span>
          </div>
        </div>
      </div>

      {/* 深色门板：整页背板（含头部），SummaryCard 浮在其上 */}
      <div
        className="absolute inset-0 z-20"
        style={{ backgroundColor: "rgba(17, 18, 20, 0.5)" }}
      />
    </PhoneScreen>
  );
}

/* ---------------- 第 2 页：新增人才（无渐变无 tab：经纪人引言 + 候选人卡） ---------------- */

type TalentGroup = "pass" | "pending" | "reject";

const TALENTS: {
  name: string;
  line1: string;
  line2: string;
  group: TalentGroup;
  message?: { text: string; time: string };
}[] = [
  { name: "张小姐", line1: "前端工程师 · 3年经验", line2: "字节跳动 · React Native", group: "pass", message: { text: "你好，我对这个岗位很感兴趣，方便聊聊吗？", time: "10:24" } },
  { name: "李先生", line1: "移动端开发 · 4年经验", line2: "美团 · 跨端组件化", group: "pass", message: { text: "简历已更新，这版补充了组件库部分。", time: "昨天" } },
  { name: "赵先生", line1: "前端工程师 · 2年经验", line2: "小红书 · RN 性能优化", group: "pass" },
  { name: "王女士", line1: "高级前端 · 5年经验", line2: "滴滴 · 工程化", group: "pending" },
  { name: "周先生", line1: "前端工程师 · 4年经验", line2: "快手 · 跨端基建", group: "reject" },
];

function TalentListPage() {
  return (
    <PhoneScreen topGradient="rgba(255,255,255,0)">
      <div className="relative flex h-[42px] items-center justify-between px-4 py-2">
        <BackArrow />
        <p className="text-[16px] font-semibold" style={{ color: "#171718" }}>新增人才</p>
        <span className="w-5" />
      </div>

      {/* 经纪人引言（App renderPendingCommunicationIntro：头像 + 引号 + 一句话） */}
      <div className="mb-3 mt-1 flex items-start px-6">
        <Image
          src={AGENT_AVATAR}
          alt="沈睿"
          width={32}
          height={32}
          className="mr-2 h-8 w-8 rounded-full object-cover"
          unoptimized
        />
        <div className="relative flex-1">
          <span className="absolute -left-1.5 -top-1">
            <svg width="14" height="11" viewBox="0 0 20.2268 14.8043" fill="none">
              <path
                opacity="0.5"
                d="M16.2675 0L18.118 1.76446L15.7941 4.26053C16.3105 5.00649 16.9274 5.78113 17.6446 6.58446C18.3906 7.38779 19.2513 8.23416 20.2268 9.12357C19.4808 9.9269 18.6488 10.7302 17.7307 11.5336C16.8126 12.3082 15.9662 12.9681 15.1916 13.5132C14.1874 12.2221 13.2407 10.9167 12.3512 9.59696C11.4618 8.24851 10.6442 6.9144 9.89821 5.59464C10.9024 4.79131 11.9496 3.9019 13.0398 2.92643C14.1587 1.95095 15.2346 0.975475 16.2675 0ZM6.36928 1.29107L8.21982 3.05553L5.89589 5.55161C6.41232 6.29756 7.02916 7.0722 7.74643 7.87553C8.49238 8.67887 9.35309 9.52524 10.3286 10.4146C9.58262 11.218 8.75059 12.0213 7.8325 12.8246C6.9144 13.5993 6.06803 14.2592 5.29339 14.8043C4.28923 13.5132 3.34244 12.2078 2.45304 10.888C1.56363 9.53958 0.745952 8.20547 0 6.88571C1.00417 6.08238 2.05137 5.19297 3.14161 4.2175C4.26053 3.24202 5.33643 2.26655 6.36928 1.29107Z"
                fill="#DDE2E8"
              />
            </svg>
          </span>
          <p className="text-[14px] leading-[21px]" style={{ color: TEXT_SECONDARY }}>
            为你找到 5 位合适候选人，感兴趣就去聊聊吧
          </p>
        </div>
      </div>

      {/* 候选人卡：摘要 +（有消息时）单行「对方的话 + 时间 + 去回复」；无消息时去聊聊在右上 */}
      <div className="space-y-2.5 px-4">
        {TALENTS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl bg-white px-3.5 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-semibold leading-[22px] text-black">{t.name}</p>
                <p className="mt-0.5 truncate text-[14px] leading-5" style={{ color: "#656D76" }}>{t.line1}</p>
                <p className="mt-0.5 truncate text-[14px] leading-5" style={{ color: TEXT_SECONDARY }}>{t.line2}</p>
              </div>
              {!t.message ? (
                <button
                  type="button"
                  className="mt-0.5 flex h-[33px] shrink-0 items-center rounded-lg px-3.5 text-[14px] font-medium leading-5"
                  style={{ backgroundColor: "#EBFAF5", color: "#008B68" }}
                >
                  去聊聊
                </button>
              ) : null}
            </div>
            {t.message ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg px-2.5 py-[7px]" style={{ backgroundColor: "#F8F9FA" }}>
                <p className="min-w-0 flex-1 truncate text-[13px] leading-[19px]" style={{ color: "#4B5563" }}>
                  {t.message.text}
                </p>
                <span className="shrink-0 text-[11px] leading-4" style={{ color: "#AEB6C0" }}>
                  {t.message.time}
                </span>
                <button
                  type="button"
                  className="flex h-[33px] shrink-0 items-center rounded-lg px-3 text-[14px] font-medium leading-5"
                  style={{ backgroundColor: "#EBFAF5", color: "#008B68" }}
                >
                  去回复
                </button>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </PhoneScreen>
  );
}

/* ---------------- 第 3 页：复核（通过/待定/拒绝） ---------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <span className="mr-2 h-5 w-1 rounded-sm" style={{ backgroundColor: "#DF940E" }} />
      <span className="text-[16px] font-semibold tracking-[0.5px] text-black">{children}</span>
    </div>
  );
}

type ReviewAction = "chat" | "choosing" | "pending" | "reject";

function ReviewPage() {
  const [action, setAction] = useState<ReviewAction>("chat");

  const caption =
    action === "chat"
      ? { text: "觉得合适，就和 TA 聊聊吧", color: "#008B68" }
      : action === "choosing"
        ? { text: "复核后自动流转到对应列表", color: TEXT_SECONDARY }
        : action === "pending"
          ? { text: "已设为待定，可随时恢复", color: "#A07912" }
          : { text: "已设为不再考虑，不影响其他匹配", color: "#656D76" };

  return (
    <PhoneScreen topGradient="#DFF3E8">
      <div className="relative flex h-[42px] items-center justify-between px-4 py-2">
        <BackArrow />
        <p className="text-[16px] font-semibold" style={{ color: "#171718" }}>待处理</p>
        <span className="text-[20px] font-semibold tracking-[0.5px]" style={{ color: "#111827" }}>
          1<span className="text-[14px] font-normal" style={{ color: TEXT_SECONDARY }}>/3</span>
        </span>
      </div>

      {/* 候选人卡（文案在卡外） */}
      <div className="relative mx-4 mt-1 overflow-hidden rounded-xl bg-white shadow-[0_0_20px_rgba(202,202,202,0.5)]" style={{ height: 700 }}>
        <div className="h-full overflow-y-auto px-4 pb-24 pt-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="flex">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-[20px] font-medium" style={{ backgroundColor: "#e8e8ed", color: "#BBC1C9" }}>
              张
            </span>
            <div className="ml-3 min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <p className="truncate text-[20px] font-semibold leading-7 tracking-[0.5px] text-black">张小姐</p>
                <span className="text-[16px] font-semibold leading-6" style={{ color: GOLD }}>面议</span>
              </div>
              <p className="mt-0.5 text-[14px] leading-5" style={{ color: "#4B5563" }}>前端工程师 · 字节跳动</p>
            </div>
          </div>
          <p className="mt-1 text-[14px] leading-5" style={{ color: TEXT_SECONDARY }}>本科</p>
          <p className="mt-0.5 text-[14px] leading-5" style={{ color: TEXT_SECONDARY }}>3年经验 · 北京</p>

          <div className="mt-5">
            <SectionTitle>个人优势</SectionTitle>
            <p className="mt-2 text-[14px] leading-[21px]" style={{ color: TEXT_SECONDARY }}>
              3 年前端经验，主导过组件库从 0 到 1 的搭建，熟悉 RN 跨端工程化与性能优化。擅长把复杂业务拆成可复用组件体系，覆盖 20+ 业务页面；关注帧率与首屏指标，主导过两次大版本性能专项治理。
            </p>
          </div>

          <div className="mt-5">
            <SectionTitle>技能</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["React Native", "TypeScript", "组件库", "跨端工程化", "性能优化", "Reanimated", "Skia", "CI/CD"].map((tag) => (
                <span key={tag} className="rounded px-3 py-1 text-[13px]" style={{ backgroundColor: "#F8FAFC", color: TEXT_SECONDARY }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <SectionTitle>工作经历</SectionTitle>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-black">字节跳动</span>
                <span className="text-[13px] font-light" style={{ color: "#656D76" }}>2022.03 – 至今</span>
              </div>
              <p className="mt-1 text-[14px] text-black">前端工程师</p>
              <p className="mt-1.5 text-[14px] leading-[21px]" style={{ color: TEXT_SECONDARY }}>
                负责社区业务 RN 页面架构与性能优化，主导组件库从 0 到 1 搭建，覆盖 20+ 业务页面；沉淀通用动画方案，核心页面平均帧率提升 30%；推动 ESLint 与 CI 流程落地，周均故障数下降一半。
              </p>
            </div>
            <div className="mt-4 border-t pt-4" style={{ borderColor: "#F1F2F4" }}>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-black">青云网络（实习）</span>
                <span className="text-[13px] font-light" style={{ color: "#656D76" }}>2021.06 – 2021.12</span>
              </div>
              <p className="mt-1 text-[14px] text-black">前端实习生</p>
              <p className="mt-1.5 text-[14px] leading-[21px]" style={{ color: TEXT_SECONDARY }}>
                参与活动页与通用组件开发，协助完成跨端页面的性能排查与首屏优化，独立负责活动配置后台的表单模块。
              </p>
            </div>
          </div>

          <div className="mt-5">
            <SectionTitle>项目经历</SectionTitle>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-black">跨端组件库建设</span>
                <span className="text-[13px] font-light" style={{ color: "#656D76" }}>核心贡献者</span>
              </div>
              <p className="mt-1.5 text-[14px] leading-[21px]" style={{ color: TEXT_SECONDARY }}>
                从 0 到 1 搭建公司级 RN 组件库，制定主题与设计规范，落地 40+ 基础组件并接入 6 条业务线；配套文档站与自动化发布流程。
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["React Native", "TypeScript", "设计规范", "Monorepo"].map((tag) => (
                  <span key={tag} className="rounded px-3 py-1 text-[13px]" style={{ backgroundColor: "#F8FAFC", color: TEXT_SECONDARY }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <SectionTitle>教育经历</SectionTitle>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[14px] font-medium text-black">某高校 · 软件工程（本科）</span>
              <span className="text-[13px] font-light" style={{ color: "#656D76" }}>2018 – 2022</span>
            </div>
          </div>
        </div>

        {/* 卡底白色渐变遮罩：防止内容与悬浮按钮打架 */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[110px]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.98) 82%)" }}
        />
      </div>

      {/* 悬浮胶囊操作区：切换可回三按钮重新判断 */}
      <div className="absolute bottom-[52px] left-0 right-0 z-20 flex justify-center">
        <div className="flex h-[74px] items-center gap-3.5 rounded-full bg-white/70 px-3 backdrop-blur-[10px]">
          {action === "choosing" ? (
            <>
              {/* 拒绝 */}
              <button
                type="button"
                aria-label="拒绝"
                onClick={() => setAction("reject")}
                className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] bg-white/70"
                style={{ borderColor: "#FBE4E4" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F48974" strokeWidth="2.3" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
              {/* 通过（大） */}
              <button
                type="button"
                aria-label="通过"
                onClick={() => setAction("chat")}
                className="flex h-[66px] w-[66px] items-center justify-center rounded-full border-[1.5px] bg-white"
                style={{ borderColor: "#6FCDAE" }}
              >
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke={TEAL} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 16 14 21 23 11" />
                </svg>
              </button>
              {/* 待定 */}
              <button
                type="button"
                aria-label="待定"
                onClick={() => setAction("pending")}
                className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] bg-white/70"
                style={{ borderColor: "#F8EFC5" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4D775" strokeWidth="2.3">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* 切换：回到三判断按钮 */}
              <button
                type="button"
                onClick={() => setAction("choosing")}
                className="flex h-[54px] w-[54px] items-center justify-center rounded-full text-[16px]"
                style={{ backgroundColor: "rgba(221,226,232,0.4)", color: TEXT_GRAY_MEDIUM, letterSpacing: 0.5 }}
              >
                切换
              </button>
              {action === "chat" ? (
                <button
                  type="button"
                  className="flex h-[54px] w-32 items-center justify-center gap-2 rounded-full text-[18px] font-medium text-white shadow-[0_8px_20px_rgba(2,168,126,0.3)]"
                  style={{ backgroundColor: "rgba(2, 168, 126, 1)", letterSpacing: 0.63 }}
                >
                  <svg width="18" height="18" viewBox="0 0 12.542 12.542" fill="none">
                    <path
                      d="M6.27051 0C9.73368 0 12.5418 2.80737 12.542 6.27051C12.542 9.73379 9.73379 12.542 6.27051 12.542C5.16994 12.5419 4.13434 12.2577 3.23438 11.7588C3.17951 11.7284 3.12607 11.7269 3.08789 11.7402L1.61621 12.2607C0.714615 12.5793 -0.154524 11.7102 0.164062 10.8086L0.706055 9.27637C0.719032 9.23962 0.71801 9.18846 0.69043 9.13477C0.248807 8.27584 0 7.30134 0 6.27051C0.000176146 2.80748 2.80748 0.000176143 6.27051 0ZM3.38281 5.57031C2.98032 5.57053 2.65434 5.89727 2.6543 6.2998C2.6543 6.70238 2.98029 7.02908 3.38281 7.0293C3.78552 7.0293 4.1123 6.70251 4.1123 6.2998C4.11226 5.89713 3.78549 5.57031 3.38281 5.57031ZM6.2998 5.57031C5.89716 5.57036 5.57036 5.89716 5.57031 6.2998C5.57031 6.70249 5.89713 7.02925 6.2998 7.0293C6.70251 7.0293 7.0293 6.70251 7.0293 6.2998C7.02925 5.89713 6.70249 5.57031 6.2998 5.57031ZM9.2168 5.57031C8.81412 5.57031 8.48735 5.89713 8.4873 6.2998C8.4873 6.70251 8.81409 7.0293 9.2168 7.0293C9.61939 7.02917 9.94531 6.70243 9.94531 6.2998C9.94527 5.89722 9.61937 5.57044 9.2168 5.57031Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                  去聊聊
                </button>
              ) : (
                <span
                  className="flex h-[54px] w-32 items-center justify-center rounded-full text-[18px] font-medium text-white"
                  style={{ backgroundColor: action === "pending" ? "#EDC43A" : "#EF8787", letterSpacing: 0.63 }}
                >
                  {action === "pending" ? "已待定" : "已拒绝"}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* 底部引导文案：在卡片外 */}
      <p className="absolute bottom-4 left-0 right-0 z-20 text-center text-[13px] font-medium" style={{ color: caption.color }}>
        {caption.text}
      </p>
    </PhoneScreen>
  );
}

/* ---------------- 区块 ---------------- */

export function AgentDelegateShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";

  return (
    <section data-nav-theme="light" className="theme-light bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
        <div className="max-w-3xl">
          <motion.h2
            data-journey-anchor
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-4 text-3xl leading-[1.15] sm:text-5xl"
          >
            {isZh ? "委托之后：从进展到复核" : "After the delegate"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
          >
            {isZh
              ? "点开委托卡后会发生什么：经纪人筛到合适人选，「新增人才」第一时间弹出提醒；点进去就是为你备好的候选人名单，感兴趣就去聊聊；最后由你亲自复核——通过、待定还是拒绝，双向的选择权都在你手里。"
              : "What happens after tapping a delegate card: the moment your agent spots a match, a “new talent” alert pops up; open it for a hand-picked candidate list and start chatting; then review them yourself — pass, hold, or reject, the choice goes both ways."}
          </motion.p>
        </div>

        {/* 三联页 */}
        {/* 移动端单列：grid-cols-1 把轨道钉在容器宽，min-w-0 让手机壳可以缩进去 */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          <div className="min-w-0">
            <DelegateDetailPage />
            <p className="mt-3 text-center font-sans text-xs text-muted">
              {isZh ? "① 委托详情 · 新增人才弹出提醒" : "① Delegate detail · new-talent alert"}
            </p>
          </div>
          <div className="min-w-0">
            <TalentListPage />
            <p className="mt-3 text-center font-sans text-xs text-muted">
              {isZh ? "② 新增人才 · 候选人名单" : "② New talents · candidates"}
            </p>
          </div>
          <div className="min-w-0">
            <ReviewPage />
            <p className="mt-3 text-center font-sans text-xs text-muted">
              {isZh ? "③ 复核 · 通过/待定/拒绝（可点击）" : "③ Review (clickable)"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
