"use client";

import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";

/**
 * 产品架构三连屏（叙事节奏：过渡提问 → 三层思路 → 完整框架图）。
 * 框架图内容来自 frontend-app-demo 的真实导航结构（AppNavigator.tsx）：
 * 3 个主 Tab（首页/消息/我的）+ 各栈页面。
 */

const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

const PRIMARY = "#008B68";
const PRIMARY_ACTIVE = "#02A87E";
const PRIMARY_SOFT = "#6FCDAE";
const PRIMARY_BG_LIGHT = "#EBFAF5";
const TRUNK = "#9ADAC3";
const TEXT_TERTIARY = "#BBC1C9";

/* ================= ⓪ 背景引子：现状 ================= */

function BeatBackground({ isZh }: { isZh: boolean }) {
  return (
    <section data-nav-theme="dark" style={{ backgroundColor: "#2A2C2C", fontFamily: SYSTEM_FONT }}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-3xl font-bold leading-snug text-white sm:text-5xl sm:leading-snug"
        >
          {isZh ? (
            <>
              首先，来分析一下
              <br />
              求职和招聘的<span style={{ color: PRIMARY_SOFT }}>现状</span>。
            </>
          ) : (
            <>
              First, let&apos;s look at
              <br />
              the <span style={{ color: PRIMARY_SOFT }}>reality</span> of hiring today.
            </>
          )}
        </motion.p>
        {/* 呼吸圆点 */}
        <div className="mt-10 flex gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.13, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ⓪ 现状信息图：流水线 + 痛点弹幕 ================= */


/** 痛点吐槽（C 端求职 + B 端招聘混杂）[文案, 表情, 色调] */
const VOICE_ROWS: [string, string, "dark" | "mint"][][] = [
  [
    ["投了 50 份简历，0 回复", "😮‍💨", "dark"],
    ["每天要看 300 份简历", "😵‍💫", "mint"],
    ["岗位要求全匹配，就是不回", "😤", "dark"],
    ["发了岗位两周没人投", "🥲", "mint"],
    ["到底谁在看我简历？", "🫠", "dark"],
  ],
  [
    ["已读不回，心态崩了", "😩", "mint"],
    ["合适的候选人到底在哪", "🧐", "dark"],
    ["海投一时爽，已读火葬场", "😅", "dark"],
    ["简历水分太大不敢信", "🙄", "mint"],
    ["约好的面试又爽约了", "😮‍💨", "dark"],
  ],
  [
    ["简历写得再好也没人看", "😢", "mint"],
    ["筛简历筛到凌晨", "🥱", "dark"],
    ["想要的工作和我不匹配", "🫠", "mint"],
    ["HR 和我想的根本不是一回事", "😤", "dark"],
  ],
];

/** 弹幕行：无缝横向滚动，偶数行反向；左右边缘渐隐不截断 */
function DanmakuRow({ items, duration, reverse }: { items: [string, string, "dark" | "mint"][]; duration: number; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div
      className="overflow-hidden py-1.5"
      style={{
        maskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-4"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {row.map(([text, emoji, tone], i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium"
              style={
                tone === "dark"
                  ? { backgroundColor: "#2A2C2C", color: "#FFFFFF" }
                  : { backgroundColor: "#8FEACC", color: "#1a1a1a" }
              }
            >
              {text}
            </span>
            <span className="text-[22px] leading-none">{emoji}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function BeatStatus({ isZh }: { isZh: boolean }) {
  return (
    <section
      data-nav-theme="light"
      className="theme-light relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #E9F8F1 0%, #F6FCF9 60%, #FFFFFF 100%)", fontFamily: SYSTEM_FONT }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          backgroundImage: "radial-gradient(rgba(111,205,174,0.4) 1.2px, transparent 1.2px)",
          backgroundSize: "14px 14px",
          maskImage: "linear-gradient(180deg, black, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, black, transparent)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[2px]" style={{ color: PRIMARY_ACTIVE }}>
            JOB HUNT PIPELINE
          </p>
          <h2 className="display mt-2 text-3xl leading-[0.92] sm:text-5xl">
            {isZh ? "求职招聘，就像一条流水线" : "Hiring works like a pipeline"}
          </h2>
        </motion.div>

        {/* 痛点弹幕（全宽滚动） */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="-mx-4 mt-12 sm:-mx-8"
        >
          <DanmakuRow items={VOICE_ROWS[0]} duration={42} />
          <DanmakuRow items={VOICE_ROWS[1]} duration={52} reverse />
          <DanmakuRow items={VOICE_ROWS[2]} duration={46} />
        </motion.div>

        {/* 反转总结 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <p className="max-w-none text-[20px] font-bold leading-snug text-[#1a1a1a] sm:text-[26px]">
            {isZh
              ? "从表面看，求职招聘难无非是 简历不够亮眼、竞争太激烈、渠道不够多……"
              : "On the surface, hiring feels hard because of weak resumes, fierce competition, too few channels…"}
          </p>
          <p className="mt-3 text-[13px]" style={{ color: "#656D76" }}>
            {isZh ? "但实际问题可能在于：[匹配的方式错了]" : "But the real problem may be: [the way we match is wrong]"}
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "#656D76" }}>
            {isZh ? "专业的事，就让专业的人去干" : "Leave professional work to the professionals"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= ① 深色过渡页 ================= */

function BeatIntro({ isZh }: { isZh: boolean }) {
  return (
    <section data-nav-theme="dark" style={{ backgroundColor: "#2A2C2C", fontFamily: SYSTEM_FONT }}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-3xl font-bold leading-snug text-white sm:text-5xl sm:leading-snug"
        >
          {isZh ? (
            <>
              那么，一个 App，
              <br />
              怎么装下<span style={{ color: PRIMARY_SOFT }}>求职</span>和
              <span style={{ color: PRIMARY_SOFT }}>招聘</span>两个世界？
            </>
          ) : (
            <>
              So — how does one app
              <br />
              hold <span style={{ color: PRIMARY_SOFT }}>job-seeking</span> and{" "}
              <span style={{ color: PRIMARY_SOFT }}>hiring</span> at once?
            </>
          )}
        </motion.p>
        {/* 呼吸圆点 */}
        <div className="mt-10 flex gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.13, ease: "easeInOut" }}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-2xl text-sm leading-relaxed sm:text-base"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {isZh
            ? "就绪允许你同时身为求职者和招聘者——两种身份完全隔离，互不干扰。"
            : "Ready lets you be a job seeker and a recruiter at once — two identities fully isolated from each other."}
        </motion.p>
      </div>
    </section>
  );
}

/* ================= ② 三层方向卡 ================= */

const LAYERS = [
  {
    num: "1",
    zh: "入口层",
    en: "ENTRY",
    descZh: "三个 Tab 装下两个身份：首页看机会、消息接进展、我的管简历和岗位，求职招聘共用一套骨架。",
    descEn: "Three tabs, two identities: Home for opportunities, Messages for progress, Profile for resume & jobs — one skeleton for both sides.",
    rotate: -2,
  },
  {
    num: "2",
    zh: "匹配层",
    en: "MATCHING",
    descZh: "委托是核心动线：创建 → 问卷评估 → 授权简历 → 经纪人寻访 → 复核撮合，两端在这里交汇。",
    descEn: "The delegate flow is the spine: create → evaluate → authorize → scout → review. Both sides meet here.",
    rotate: 0.8,
  },
  {
    num: "3",
    zh: "支撑层",
    en: "FOUNDATION",
    descZh: "在线简历与匿名体系托底：可编辑、可匿名、可授权，隐私设置贯穿所有流程。",
    descEn: "The online resume and anonymity system back everything: editable, maskable, authorizable — privacy runs through every flow.",
    rotate: 2,
  },
];

function Paperclip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_SOFT} strokeWidth="2.2" strokeLinecap="round">
      <path d="M21 12.5l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.4 8.4a1.85 1.85 0 0 1-2.6-2.6l7.8-7.8" />
    </svg>
  );
}

function BeatLayers({ isZh }: { isZh: boolean }) {
  return (
    <section
      data-nav-theme="light"
      className="theme-light relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #E9F8F1 0%, #FFFFFF 72%)", fontFamily: SYSTEM_FONT }}
    >
      {/* 顶部网点 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          backgroundImage: "radial-gradient(rgba(111,205,174,0.4) 1.2px, transparent 1.2px)",
          backgroundSize: "14px 14px",
          maskImage: "linear-gradient(180deg, black, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, black, transparent)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="display text-3xl leading-[0.92] sm:text-5xl"
        >
          {isZh ? "三层，撑起一个 App" : "Three layers, one app"}
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.num}
              initial={{ opacity: 0, y: 22, rotate: l.rotate * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: l.rotate }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.07)]"
            >
              <span className="absolute -top-2.5 left-6">
                <Paperclip />
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[20px] font-bold text-black">{l.zh}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[1.5px]" style={{ color: TEXT_TERTIARY }}>
                    {l.en}
                  </p>
                </div>
                <span
                  className="text-[46px] font-bold leading-none"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #8FEACC, #02A87E)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {l.num}
                </span>
              </div>
              <div className="my-4 border-t border-dashed" style={{ borderColor: "#DDE2E8" }} />
              <p className="text-[13px] leading-relaxed" style={{ color: "#4B5563" }}>
                {isZh ? l.descZh : l.descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ③ 路径思维导图（来自代码级导航分析） ================= */

/* 真实 Tab 图标（frontend-app-demo: src/icons/HomeIcon.svg / ChatIcon.svg / UserIcon.svg，描边色换成主题绿） */
const HomeTabIcon = ({ color = PRIMARY }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 15.5H11C9.89543 15.5 9 16.3954 9 17.5V20.5C9 21.0523 8.55228 21.5 8 21.5H6.5C4.29086 21.5 2.5 19.7091 2.5 17.5L2.5 10.9384C2.5 9.71422 3.06058 8.55744 4.02142 7.79888L4.875 7.125L9.03125 3.84375L9.625 3.375C11.0175 2.27565 12.9825 2.27565 14.375 3.375L19.9786 7.79888C20.9394 8.55744 21.5 9.71422 21.5 10.9384V17.5C21.5 19.7091 19.7091 21.5 17.5 21.5H16C15.4477 21.5 15 21.0523 15 20.5V18.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const ChatTabIcon = ({ color = PRIMARY }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.6622 7C21.513 8.47087 22 10.1786 22 12C22 17.5228 17.5228 22 12 22C10.2435 22 8.59274 21.5471 7.15817 20.7518C6.89316 20.6048 6.57856 20.5681 6.29285 20.6691L3.77026 21.5605C2.81913 21.8966 1.90292 20.9804 2.23902 20.0292L3.1673 17.4022C3.26437 17.1275 3.23426 16.8254 3.10104 16.5662C2.39724 15.1974 2 13.6451 2 12C2 6.47715 6.47715 2 12 2C14.2516 2 16.3295 2.74418 18.001 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="7.05005" cy="12.0508" r="1.25" fill={color} />
    <circle cx="12.05" cy="12.0508" r="1.25" fill={color} />
    <circle cx="17.05" cy="12.0508" r="1.25" fill={color} />
  </svg>
);
const UserTabIcon = ({ color = PRIMARY }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.47145 15.2478C8.35366 14.8206 8.62861 14.3834 9.06772 14.3238C12.2115 13.8971 15.4327 14.2239 18.458 15.3043C19.6824 15.7416 20.4998 16.9017 20.5 18.2018V19.7047C20.5 21.5182 18.8939 22.9113 17.0986 22.6549L16.0078 22.4996C13.1837 22.0962 10.3163 22.0962 7.49219 22.4996L6.40137 22.6549C4.60614 22.9113 3 21.5182 3 19.7047V18.2018C3.00018 16.9017 3.81765 15.7416 5.04199 15.3043C5.22001 15.2407 5.3987 15.1797 5.57801 15.1213C5.97392 14.9923 6.39095 15.228 6.50161 15.6295C6.61101 16.0263 6.37945 16.4357 5.98844 16.5645C5.84046 16.6133 5.69293 16.6639 5.5459 16.7164C4.91872 16.9406 4.50018 17.5357 4.5 18.2018V19.7047C4.5 20.6054 5.29785 21.2979 6.18945 21.1705L7.28027 21.0143C10.245 20.5908 13.255 20.5908 16.2197 21.0143L17.3105 21.1705C18.2022 21.2979 19 20.6054 19 19.7047V18.2018C18.9998 17.5357 18.5813 16.9406 17.9541 16.7164C15.1743 15.7236 12.2151 15.4189 9.32523 15.802C8.94216 15.8528 8.57416 15.6203 8.47145 15.2478Z"
      fill={color}
    />
    <circle cx="4.57143" cy="4.57143" r="4.57143" transform="matrix(-1 0 0 1 16 2)" stroke={color} strokeWidth="1.5" />
  </svg>
);

interface MNode {
  name: string;
  note?: string;
  hot?: boolean;
  children?: MNode[];
}

/** 首页 Tab：入口均来自 HomeScreen（委托区/精选/推荐区） */
const HOME_FLOWS: MNode[] = [
  {
    name: "委托卡 / 「+」新建",
    note: "委托区",
    children: [
      {
        name: "创建委托",
        children: [
          { name: "意向城市 → 意向职位 → 期望薪资", note: "求职委托" },
          { name: "授权委托" },
          {
            name: "委托详情",
            hot: true,
            children: [
              { name: "评估 → 经纪人笔记" },
              {
                name: "新增人才 / 人才总览",
                children: [
                  {
                    name: "候选人详情",
                    hot: true,
                    children: [{ name: "去沟通", note: "→ 消息 Tab" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { name: "委托区「更多」", children: [{ name: "全部委托" }] },
  {
    name: "精选岗位卡",
    children: [{ name: "岗位详情", children: [{ name: "公司详情" }, { name: "投递进度" }] }],
  },
  { name: "人才行情报告", note: "B端", children: [{ name: "候选人详情" }] },
  { name: "性格测试卡", children: [{ name: "性格测试流程" }] },
  { name: "天降来信 / 运营卡", children: [{ name: "H5 活动页" }] },
];

/** 消息 Tab：两类会话 + 新建（ConversationsListScreen） */
const CHAT_FLOWS: MNode[] = [
  { name: "经纪人 AI 会话", children: [{ name: "AI 对话", hot: true }] },
  {
    name: "人与人会话",
    children: [{ name: "对话", children: [{ name: "对方主页" }, { name: "岗位详情" }] }],
  },
  { name: "「+」新建会话", children: [{ name: "选择经纪人 → AI 对话" }] },
];

/** 我的 Tab：经纪人卡 / 宫格 / 资料库（ProfileScreen） */
const PROFILE_FLOWS: MNode[] = [
  {
    name: "经纪人卡（C/B）",
    children: [
      {
        name: "经纪人详情",
        children: [{ name: "「切换」→ 经纪人选择", hot: true, note: "转盘；新手流程也由此进" }],
      },
      { name: "「对话」→ AI 对话" },
    ],
  },
  { name: "求职期望", children: [{ name: "期望详情 → 开启委托", note: "→ 授权委托" }] },
  {
    name: "岗位管理",
    note: "B端",
    children: [{ name: "岗位详情 → 岗位编辑" }, { name: "发布新岗位 → 发布流程" }],
  },
  {
    name: "我的资料库",
    children: [{ name: "附件管理 → 在线简历", hot: true, note: "含「对外展示」匿名切换" }],
  },
  { name: "对外资料包" },
  { name: "已投递岗位" },
  { name: "头像 / 齿轮", children: [{ name: "个人信息 / 设置（账号·屏蔽·隐私）" }] },
];

function MTreeNode({ node }: { node: MNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 py-[3px]">
        <span className="h-px w-2 shrink-0" style={{ backgroundColor: TRUNK }} />
        <span
          className="whitespace-nowrap rounded-lg px-2.5 py-1 text-[12px]"
          style={
            node.hot
              ? { backgroundColor: PRIMARY_ACTIVE, color: "#FFFFFF", fontWeight: 500 }
              : { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", color: "#1a1a1a" }
          }
        >
          {node.name}
        </span>
        {node.note && (
          <span className="text-[10px] leading-tight" style={{ color: "#9EA7B3" }}>
            {node.note}
          </span>
        )}
      </div>
      {node.children && (
        <div className="ml-[5px] border-l border-dashed pl-2.5" style={{ borderColor: TRUNK }}>
          {node.children.map((c) => (
            <MTreeNode key={c.name} node={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function MindColumn({
  tab,
  en,
  icon,
  flows,
}: {
  tab: string;
  en: string;
  icon: React.ReactNode;
  flows: MNode[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] bg-white"
          style={{ borderColor: PRIMARY_SOFT }}
        >
          {icon}
        </span>
        <div>
          <p className="text-[15px] font-bold text-black">{tab}</p>
          <p className="text-[10px] uppercase tracking-[1px]" style={{ color: TEXT_TERTIARY }}>
            {en}
          </p>
        </div>
      </div>
      <div className="ml-[19px] mt-2 border-l border-dashed pl-3" style={{ borderColor: TRUNK }}>
        {flows.map((f) => (
          <MTreeNode key={f.name} node={f} />
        ))}
      </div>
    </div>
  );
}

function BeatTree({ isZh }: { isZh: boolean }) {
  return (
    <section data-nav-theme="light" className="theme-light bg-white" style={{ fontFamily: SYSTEM_FONT }}>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-8 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-x-auto rounded-3xl"
          style={{ backgroundColor: "#FBFBFB" }}
        >
          <div className="min-w-[980px] px-8 py-8">
            <div className="mb-6 flex items-baseline justify-between">
              <p className="text-[15px] font-bold text-black">
                {isZh ? "路径全图 · 从哪进，到哪去" : "Full map · every entry, every destination"}
              </p>
              <div className="flex items-center gap-6 text-[11px]" style={{ color: "#656D76" }}>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded" style={{ backgroundColor: PRIMARY_ACTIVE }} />
                  {isZh ? "下方有互动复刻" : "Recreated below"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border bg-white" style={{ borderColor: "#DDE2E8" }} />
                  {isZh ? "普通页面" : "Regular page"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <MindColumn tab="首页" en="Home" icon={<HomeTabIcon />} flows={HOME_FLOWS} />
              <MindColumn tab="消息" en="Messages" icon={<ChatTabIcon />} flows={CHAT_FLOWS} />
              <MindColumn tab="我的" en="Profile" icon={<UserTabIcon />} flows={PROFILE_FLOWS} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= 区块 ================= */

export function AgentAppArch({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  return (
    <>
      <BeatBackground isZh={isZh} />
      <BeatStatus isZh={isZh} />
      <BeatIntro isZh={isZh} />
      <BeatLayers isZh={isZh} />
      <BeatTree isZh={isZh} />
    </>
  );
}
