"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import type { Locale } from "@/i18n/config";
import { AGENTS, getAgentByKey } from "./agentsData";
import type { Agent, AgentSide } from "./agentsData";
import { useAgentSelection } from "./AgentSelectionContext";

/**
 * 「就绪」App AI 对话界面的网页复刻（自动播放脚本）。
 * 视觉参数来自 frontend-app-demo：
 * - BubbleMessageV1.tsx（AI 气泡：rgba(248,250,252,1) 底、圆角 18、内边距 12/8、块间距 8）
 * - ThinkingBlockV1.tsx（思考折叠块：芒星动画 + 「xx正在思考中 / xx的思考过程」）
 * - ToolCallCard.tsx（工具卡 shimmer 扫光 2.5s、-20° 倾斜）
 * - CardBlockV1.tsx + JobCard.tsx（卡组容器 rgba(236,240,240,1)、超 2 张折叠「查看更多>>」）
 * - MessageBubble.tsx（用户气泡：primaryLight、圆角 18 右上 4）
 * - ChatBlockV1.tsx（正文 charcoalDark、行高 25）
 */

const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';

const PRIMARY = "#008B68";
const PRIMARY_LIGHT = "rgba(235, 250, 245, 1)";
const TEXT_SECONDARY = "#7B838D";
const TEXT_TERTIARY = "#BBC1C9";
const CHARCOAL_DARK = "rgba(23, 23, 24, 1)";
const BUBBLE_BG = "rgba(248, 250, 252, 1)";
const CARD_GROUP_BG = "rgba(236, 240, 240, 1)";

/* ---------------- 小图标（SVG 原样取自 App src/icons/） ---------------- */

/** App: icons/search.svg（工具卡-搜索） */
function ToolSearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 10L11 11" stroke="#78787D" strokeLinecap="round" />
      <circle cx="8" cy="8" r="7.5" stroke="#78787D" />
      <circle cx="7.5" cy="7.5" r="3" stroke="#78787D" />
    </svg>
  );
}

/** App: icons/browse.svg（工具卡-联网浏览） */
function ToolBrowseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="#78787D" />
      <path
        d="M6.5 6.8L5 11L9.5 9.2L11 5L6.5 6.8Z"
        stroke="#78787D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** App: icons/GoToDetailIcon.svg（可点详情箭头） */
function GoToDetailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 13L11 8L6 3" stroke="#7B838D" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** App: icons/ToggleThinking.svg（思考折叠箭头） */
function ToggleThinkingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 6L8 11L13 6" stroke="#7B838D" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** App: icons/ThinkingComplete.svg（思考完成-描边芒星） */
function ThinkingCompleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M15 8C9.38072 6.97471 8.34434 5.16194 8 1C7.02742 6.03482 5.35859 7.39133 1 8C5.96749 8.2128 7.46754 9.74742 8 15C8.45319 9.81914 9.87987 8.17482 15 8Z"
        stroke="#7B838D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 思考中动画：App 是芒星↔圆球变形动画（reanimated 时间轴），这里用实心芒星旋转+脉冲近似 */
const STAR_PATH =
  "M10 0C10 7 13 10 20 10C13 10 10 13 10 20C10 13 7 10 0 10C7 10 10 7 10 0Z";

function ThinkingStar({ running }: { running: boolean }) {
  if (!running) return <ThinkingCompleteIcon />;
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{
        rotate: { duration: 3.8, repeat: Infinity, ease: "linear" },
        scale: { duration: 1.9, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <path d={STAR_PATH} fill={TEXT_SECONDARY} />
    </motion.svg>
  );
}

/** App: icons/MicIcon.svg（语音-声波圈） */
function MicIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 1C19.5977 1 25 6.40229 25 13C25 19.5977 19.5977 25 13 25C6.40229 25 1 19.5977 1 13C1 6.40229 6.40229 1 13 1Z"
        stroke="#171718"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11.8496C7.36716 11.8496 6.84961 12.3672 6.84961 13C6.84961 13.6328 7.36716 14.1504 8 14.1504C8.63284 14.1504 9.15039 13.6328 9.15039 13C9.15039 12.3672 8.63284 11.8496 8 11.8496Z"
        fill="black"
        stroke="black"
        strokeWidth="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5703 19C17.1496 17.502 18.1417 15.3638 18.1417 13C18.1417 10.6362 17.1496 8.49798 15.5703 7"
        stroke="#171718"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2852 16.7779C12.3347 15.8531 12.9994 14.5005 12.9994 13.0003C12.9994 11.5 12.3347 10.1475 11.2852 9.22266"
        stroke="#171718"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** App: icons/AttachIcon.svg（附件-圆圈加号） */
function AttachIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 0.966797C19.6161 0.966797 25.0332 6.38393 25.0332 13C25.0332 19.6161 19.6161 25.0332 13 25.0332C6.38393 25.0332 0.966797 19.6161 0.966797 13C0.966797 6.38393 6.38393 0.966797 13 0.966797Z"
        stroke="#171718"
        strokeWidth="1.93352"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 13H18" stroke="#171718" strokeWidth="1.93352" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 18V8" stroke="#171718" strokeWidth="1.93352" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** App: icons/SendingIcon.svg（发送-可发送态：黑圆白箭头） */
function SendingIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" fill="black" stroke="black" strokeWidth="2" />
      <path d="M8 13L13 8L18 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 8V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** App: icons/SendIcon.svg（发送-空输入禁用态：灰圆上箭头） */
function SendIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
      <path
        d="M99.0001 6.66699C47.3334 6.66699 5.66675 48.3337 5.66675 100C5.66675 151.667 47.3334 193.334 99.0001 193.334C150.667 193.334 192.333 151.667 192.333 100C192.333 48.3337 150.667 6.66699 99.0001 6.66699ZM138.333 94.667C135.667 97.3337 131.333 97.3337 128.667 94.667L105.667 71.667V144.334C105.667 148 102.667 151 99.0001 151C95.3334 151 92.3334 148 92.3334 144.334V71.667L69.3334 94.667C66.6667 97.3337 62.3334 97.3337 59.6668 94.667C57.0001 92.0003 57.0001 87.667 59.6668 85.0003L94.3334 50.3337C97.0001 47.667 101.333 47.667 104 50.3337L138.667 85.0003C141 87.667 141 92.0003 138.333 94.667Z"
        fill="#D4D4D8"
      />
    </svg>
  );
}

/* ---------------- 打字机（与 App 一致：30ms/字匀速） ---------------- */

function Typewriter({
  text,
  onComplete,
  onTick,
  className,
  style,
}: {
  text: string;
  onComplete?: () => void;
  onTick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (i >= text.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete?.();
        }
        return;
      }
      setDisplayed(text.slice(0, i + 1));
      onTick?.();
      i++;
      timer = setTimeout(tick, 30);
    };
    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={`relative block ${className ?? ""}`} style={style}>
      {/* 幽灵层撑开布局 */}
      <span className="invisible block">{text}</span>
      <span className="absolute inset-0">{displayed}</span>
    </span>
  );
}

/* ---------------- 工具调用卡（shimmer 扫光） ---------------- */

function ToolCallCard({
  icon,
  title,
  subtitle,
  running,
  clickable,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  running: boolean;
  clickable?: boolean;
}) {
  return (
    <div className="flex max-w-full items-center self-start">
      <span className="mr-1 flex h-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="relative flex h-6 shrink-0 items-center overflow-hidden">
        <span
          className="whitespace-nowrap text-[15px] font-medium leading-6 tracking-[0.5px]"
          style={{ color: TEXT_SECONDARY }}
        >
          {title}
        </span>
        {running ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0"
            style={{
              width: "70%",
              background:
                "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.85) 50%, transparent 75%)",
              skewX: "-20deg",
            }}
            animate={{ x: ["-110%", "220%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </span>
      <span
        className="ml-0.5 min-w-0 truncate text-[13px] leading-6 tracking-[0.5px]"
        style={{ color: TEXT_SECONDARY }}
      >
        {subtitle}
      </span>
      {clickable ? (
        <span className="ml-1 flex h-6 items-center">
          <GoToDetailIcon />
        </span>
      ) : null}
    </div>
  );
}

/* ---------------- 思考折叠块（ThinkingBlockV1） ---------------- */

function ThinkingBlock({ agentName, running, content }: { agentName: string; running: boolean; content: string }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center py-1"
      >
        <span className="mr-1 flex h-4 w-4 items-center justify-center">
          <ThinkingStar running={running} />
        </span>
        <span className="whitespace-nowrap text-[15px] tracking-[0.5px]" style={{ color: TEXT_SECONDARY }}>
          {running ? `${agentName}正在思考中` : `${agentName}的思考过程`}
        </span>
        <span className={`ml-1 transition-transform ${collapsed ? "-rotate-90" : ""}`}>
          <ToggleThinkingIcon />
        </span>
      </button>
      {!collapsed ? (
        <div className="pt-1 text-[13px] leading-5" style={{ color: TEXT_SECONDARY }}>
          {content}
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- 职位卡（JobCard） ---------------- */

type Job = { title: string; salary: string; company: string };

function JobCard({ job }: { job: Job }) {
  return (
    <div className="w-full rounded-lg bg-white p-2.5">
      <div className="mb-2 flex items-start justify-between">
        <span className="mr-3 flex-1 text-[16px] font-semibold leading-[21px] text-black">
          {job.title}
        </span>
        <span className="text-[15px] font-semibold leading-[21px]" style={{ color: PRIMARY }}>
          {job.salary}
        </span>
      </div>
      <div className="truncate text-[13px]" style={{ color: TEXT_SECONDARY }}>
        {job.company}
      </div>
    </div>
  );
}

/* ---------------- 剧本（C 端求职 / B 端招聘） ---------------- */

type ChatScript = {
  userMessage: string;
  tool1: { title: string; subtitle: string };
  tool2: { title: string; subtitle: string };
  /** 思考块内容；不传则没有思考步骤（B 端截图中无思考块） */
  thinking?: string;
  reply1: string;
  /** 回复后的趋势列表（加粗小标题 + 说明） */
  trendItems?: { lead: string; body: string }[];
  cards: Job[];
  reply2: string;
};

const SCRIPTS: Record<AgentSide, ChatScript> = {
  c: {
    userMessage: "我想找一份北京的产品设计工作，薪资 25K 以上，最好是 AI 方向",
    tool1: {
      title: "理解你的求职偏好",
      subtitle: "城市：北京 · 岗位：产品设计 · 薪资：25K+ · 方向：AI",
    },
    thinking:
      "用户目标城市是北京，期望薪资 25K 以上，倾向 AI 方向岗位。结合其作品集与项目经历，优先匹配产品设计专家、体验设计相关职位，再按匹配度排序输出。",
    tool2: { title: "联网搜索", subtitle: "北京 AI 产品设计 25K" },
    reply1: "根据你的偏好和作品集，我筛选出 3 个匹配度最高的岗位：",
    cards: [
      { title: "资深产品设计师（AI 方向）", salary: "25-40K·16薪", company: "某头部科技公司·已上市·10000人以上" },
      { title: "AI 对话产品设计专家", salary: "30-50K·14薪", company: "某 AI 独角兽·B轮·100-499人" },
      { title: "体验设计师（招聘产品）", salary: "25-35K", company: "某互联网大厂·D轮·1000-9999人" },
    ],
    reply2: "第二个和你的背景最匹配。需要我帮你针对这家公司优化简历吗？",
  },
  b: {
    userMessage: "帮我看市场同行发布了哪些岗位",
    tool1: { title: "查询委托信息", subtitle: "查询招聘委托列表" },
    tool2: { title: "查询岗位信息", subtitle: "搜索公开市场同行发布的岗位" },
    reply1: "根据你当前的招聘委托「Agent 数据分析」，我检索了公开市场上同行的在招岗位，主要呈现三类趋势：",
    trendItems: [
      {
        lead: "业务落地与产品重构型",
        body: "如滴滴、MiniMax，将商业分析方法论与 AI Agent 结合，重构业务工作流。",
      },
      {
        lead: "底层技术与架构研发型",
        body: "如道通科技，偏向技术管理与算法架构，要求精通 Agentic AI 底层技术。",
      },
      {
        lead: "AI 辅助与自动化执行型",
        body: "如银河驿站，侧重用 AI 辅助编程工具提升数据清洗与预处理效率。",
      },
    ],
    cards: [
      { title: "国际化外卖商业分析师 · AI数据分析", salary: "45-60K·16薪", company: "滴滴出行 · C轮" },
      { title: "Agent Leader（智能运营客服）", salary: "60-80K·16薪", company: "道通科技 · 已上市" },
    ],
    reply2:
      "核心观察：SQL/Python 与 AI 编程工具实操经验是这类岗位的通用硬性要求；中高级岗位普遍要求 5 年以上经验，技术 Leader 薪资可达 60-80K·16薪。",
  },
};

// stage: 0 未开始 1 输入中 2 待发送 3 已发出 4 工具卡1 5 思考中 6 工具卡2 7 回复1 8 职位卡 9 回复2 10 完成
const FINAL_STAGE = 10;

function AgentChatPlay({
  replayKey,
  agent,
  script,
}: {
  replayKey: number;
  agent: Agent;
  script: ChatScript;
}) {
  const [stage, setStage] = useState(0);
  const [draft, setDraft] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-120px" });

  const scrollToBottom = (smooth = true) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // 进入可视区自动开始
  useEffect(() => {
    if (inView) setStage((s) => (s === 0 ? 1 : s));
  }, [inView]);

  // 重播（跳过挂载时的首次执行——否则页面一加载就会在可视区外提前播放；
  // 首次启动交给上面的 inView 触发）
  const skipInitialReplay = useRef(true);
  useEffect(() => {
    if (skipInitialReplay.current) {
      skipInitialReplay.current = false;
      return;
    }
    setStage(1);
    setDraft("");
  }, [replayKey]);

  // 输入框逐字输入（拟人速度 40–100ms 随机）
  useEffect(() => {
    if (stage !== 1) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (i >= script.userMessage.length) {
        setStage(2);
        return;
      }
      setDraft(script.userMessage.slice(0, i + 1));
      i++;
      timer = setTimeout(tick, 40 + Math.random() * 60);
    };
    tick();
    return () => clearTimeout(timer);
  }, [stage, script]);

  // 自动推进的 stage 定时器
  useEffect(() => {
    if (stage === 0 || stage >= FINAL_STAGE) return;
    let timer: ReturnType<typeof setTimeout>;
    if (stage === 2)
      timer = setTimeout(() => {
        setDraft("");
        setStage(3);
      }, 500);
    else if (stage === 3) timer = setTimeout(() => setStage(4), 800);
    else if (stage === 4) timer = setTimeout(() => setStage(5), 1800);
    else if (stage === 5) timer = setTimeout(() => setStage(6), script.thinking ? 2000 : 50);
    else if (stage === 6) timer = setTimeout(() => setStage(7), 1600);
    else if (stage === 8)
      timer = setTimeout(() => setStage(9), (script.trendItems?.length ?? 0) * 300 + 2 * 350 + 500);
    return () => clearTimeout(timer);
  }, [stage]);

  // 每个 stage 变化后滚到底部
  useEffect(() => {
    scrollToBottom();
  }, [stage]);

  const blockAnim = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="w-full" style={{ fontFamily: SYSTEM_FONT }}>
      {/* 消息滚动区 */}
      <div
        ref={containerRef}
        className="h-[500px] w-full overflow-y-auto scroll-smooth px-3 py-4 sm:h-[540px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <div className="flex min-h-full flex-col gap-4">
          {/* 顶部弹性占位：内容少时把消息压到底部，内容多时自然上推且可完整滚动（justify-end 会导致顶部溢出不可达） */}
          <div className="mt-auto" />
          {/* 用户消息（输入完成后发出） */}
          {stage >= 3 ? (
            <motion.div {...blockAnim} className="flex justify-end">
              <div
                className="max-w-[80%] rounded-[18px] rounded-tr-[4px] px-3 py-2 text-[15px] leading-6 text-black"
                style={{ backgroundColor: PRIMARY_LIGHT }}
              >
                {script.userMessage}
              </div>
            </motion.div>
          ) : null}

          {/* 经纪人消息组：头像 + 一个整体气泡，所有块都在气泡里 */}
          {stage >= 4 ? (
            <motion.div {...blockAnim} className="flex items-start">
              <span className="mr-2 mt-1 shrink-0">
                <Image
                  src={agent.avatar.selected}
                  alt={agent.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  unoptimized
                />
              </span>
              <div
                className="flex max-w-[80%] flex-1 flex-col gap-2 rounded-[18px] px-3 py-2"
                style={{ backgroundColor: BUBBLE_BG }}
              >
                {/* 工具卡 1：理解偏好 */}
                <ToolCallCard
                  icon={<ToolSearchIcon />}
                  title={script.tool1.title}
                  subtitle={script.tool1.subtitle}
                  running={stage === 4}
                />

                {/* 思考折叠块（B 端无此步骤） */}
                {script.thinking && stage >= 5 ? (
                  <motion.div {...blockAnim}>
                    <ThinkingBlock agentName={agent.name} running={stage === 5} content={script.thinking} />
                  </motion.div>
                ) : null}

                {/* 工具卡 2：联网搜索（可点详情） */}
                {stage >= 6 ? (
                  <motion.div {...blockAnim}>
                    <ToolCallCard
                      icon={<ToolBrowseIcon />}
                      title={script.tool2.title}
                      subtitle={script.tool2.subtitle}
                      running={stage === 6}
                      clickable
                    />
                  </motion.div>
                ) : null}

                {/* 回复 1（打字机） */}
                {stage >= 7 ? (
                  <motion.div
                    {...blockAnim}
                    className="w-full py-0.5 text-[15px] leading-[25px]"
                    style={{ color: CHARCOAL_DARK }}
                  >
                    <Typewriter
                      text={script.reply1}
                      onTick={() => scrollToBottom(false)}
                      onComplete={() => setStage(8)}
                    />
                  </motion.div>
                ) : null}

                {/* 趋势列表（加粗小标题 + 说明，B 端市场分析） */}
                {script.trendItems && stage >= 8 ? (
                  <motion.div {...blockAnim} className="flex w-full flex-col gap-1.5">
                    {script.trendItems.map((item, i) => (
                      <motion.p
                        key={item.lead}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.3, duration: 0.3 }}
                        className="text-[15px] leading-[25px]"
                        style={{ color: CHARCOAL_DARK }}
                      >
                        <span className="font-semibold">
                          {i + 1}. {item.lead}：
                        </span>
                        {item.body}
                      </motion.p>
                    ))}
                  </motion.div>
                ) : null}

                {/* 职位卡组（灰容器 + 白卡，超 2 张折叠） */}
                {stage >= 8 ? (
                  <motion.div
                    {...blockAnim}
                    className="flex w-full flex-col gap-1.5 rounded-lg p-1.5"
                    style={{ backgroundColor: CARD_GROUP_BG }}
                  >
                    {script.cards.slice(0, 2).map((job, i) => (
                      <motion.div
                        key={job.title}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.35, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <JobCard job={job} />
                      </motion.div>
                    ))}
                    {script.cards.length > 2 ? (
                      <button
                        type="button"
                        className="py-0.5 text-center text-[14px] leading-[18px]"
                        style={{ color: TEXT_SECONDARY }}
                      >
                        查看更多&gt;&gt;
                      </button>
                    ) : null}
                  </motion.div>
                ) : null}

                {/* 回复 2（打字机） */}
                {stage >= 9 ? (
                  <motion.div
                    {...blockAnim}
                    className="w-full py-0.5 text-[15px] leading-[25px]"
                    style={{ color: CHARCOAL_DARK }}
                  >
                    <Typewriter
                      text={script.reply2}
                      onTick={() => scrollToBottom(false)}
                      onComplete={() => setStage(FINAL_STAGE)}
                    />
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* 底部输入栏：开头逐字输入并发出；有内容时切换为两行布局并随换行变高（还原 App ChatInput） */}
      <div className="px-3 pb-1 pt-2">
        <div
          className="rounded-[15px] bg-white px-[13px] py-3"
          style={{ boxShadow: "0 0 10px rgba(101, 109, 118, 0.15)" }}
        >
          {draft ? (
            <>
              {/* 两行模式：文本在上，自动换行、最高 8 行 */}
              <div
                className="whitespace-pre-wrap break-all text-[16px] leading-[20.8px] text-black"
                style={{ maxHeight: 166, overflow: "hidden" }}
              >
                {draft}
                <span className="animate-pulse">|</span>
              </div>
              <div className="mt-2 flex items-center justify-end">
                <span className="mr-2 flex h-7 w-7 items-center justify-center">
                  <MicIcon />
                </span>
                <span className="mr-2 flex h-7 w-7 items-center justify-center">
                  <AttachIcon />
                </span>
                <span className="flex h-7 w-7 items-center justify-center">
                  <SendingIcon />
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="flex-1 text-[16px] leading-7" style={{ color: TEXT_TERTIARY }}>
                输入消息......
              </span>
              <span className="mr-2 flex h-7 w-7 items-center justify-center">
                <MicIcon />
              </span>
              <span className="mr-2 flex h-7 w-7 items-center justify-center">
                <AttachIcon />
              </span>
              <span className="flex h-7 w-7 items-center justify-center">
                <SendIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 区块 ---------------- */

export function AgentChatShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const [replayKey, setReplayKey] = useState(0);
  const { agentKey, setAgentKey } = useAgentSelection();
  const agent = getAgentByKey(agentKey);
  // 对话端别完全跟随当前经纪人：转盘选谁就是哪端；tab 切换反向联动转盘
  const side = agent.side;
  const script = SCRIPTS[side];

  const switchSide = (s: AgentSide) => {
    const first = AGENTS.find((a) => a.side === s);
    if (first && first.key !== agentKey) setAgentKey(first.key);
    setReplayKey((k) => k + 1);
  };

  return (
    <section data-nav-theme="light" className="theme-light bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16">
          {/* 对话复刻（固定 440px 宽——和 App 一样输入框宽度不随内容变化；
              仅当视口不足 440px 时才整体收缩） */}
          <div className="order-last flex min-w-0 justify-center lg:order-none lg:justify-start">
            <div className="w-[440px] max-w-full">
              {/* B/C 端切换 tab */}
              <div className="mb-3 flex justify-center">
                <div
                  className="flex rounded-full p-1"
                  style={{ backgroundColor: "#F5F5F5", fontFamily: SYSTEM_FONT }}
                >
                  {(["c", "b"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => switchSide(s)}
                      className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                        side === s ? "bg-white shadow-sm" : ""
                      }`}
                      style={{ color: side === s ? "#000000" : TEXT_SECONDARY }}
                    >
                      {s === "c" ? (isZh ? "C 端 · 找工作" : "For job seekers") : isZh ? "B 端 · 招人才" : "For recruiters"}
                    </button>
                  ))}
                </div>
              </div>
              <AgentChatPlay replayKey={replayKey} agent={agent} script={script} />
              <div className="mt-2 flex items-center justify-between">
                <p className="font-sans text-xs text-muted">
                  {isZh ? "对话自动播放 · 复刻自 App 真实聊天界面" : "Auto-playing conversation · recreated from the real app chat"}
                </p>
                <button
                  type="button"
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="font-sans text-xs text-muted underline underline-offset-4 transition-colors hover:text-fg"
                >
                  {isZh ? "重新播放" : "Replay"}
                </button>
              </div>
            </div>
          </div>

          {/* 文案 */}
          <div className="max-w-xl lg:justify-self-end">
            <motion.h2
              data-journey-anchor
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="display mt-4 text-3xl leading-[1.15] sm:text-5xl"
            >
              {isZh ? "看得见的 AI 思考" : "Watch the AI think"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
            >
              {isZh
                ? "无论找工作还是招人才，和经纪人的对话都不是黑盒：每一次推荐背后，你都能看到它如何拆解需求、调用工具、检索匹配，最后给出有理有据的答案。"
                : "Whether job-seeking or recruiting, chatting with your agent is never a black box: behind every recommendation, you can watch it parse the request, call tools, search for matches, and explain its answer."}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
