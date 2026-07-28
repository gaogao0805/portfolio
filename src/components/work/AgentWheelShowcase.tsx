"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import type { Locale } from "@/i18n/config";
import { AGENTS, getAgentByKey } from "./agentsData";
import type { Agent } from "./agentsData";
import { useAgentSelection } from "./AgentSelectionContext";

/**
 * 「就绪」App 经纪人选择转盘的网页复刻。
 * 布局参数、拖拽阻尼、弹簧配置与文案均来自
 * frontend-app-demo/src/screens/OnboardingScreens/AgentSelectionScreen.tsx
 * 和 src/constants/agentsData.ts。
 */

// 经纪人数据在 ./agentsData.ts，与对话复刻共享

// 设计稿尺寸（以 App 布局为基准），外层按容器宽度整体缩放
// 内部保持 800 高布局（立绘距底 13%、转盘贴右下），可见区域裁掉顶部空白
const DESIGN_W = 390;
const DESIGN_H = 800;
const VISIBLE_H = 700;
const INNER_RADIUS = DESIGN_W * 0.56;
const OUTER_RADIUS = DESIGN_W * 0.72;
const AVATAR_SIZE = 56;
const ITEM_COUNT = AGENTS.length;
const ANGLE_GAP = 19.5;
const START_ANGLE = 23;
const DRAG_DAMPING = 200;
const FLING_DAMPING = 600;

function interp(x: number, xs: number[], ys: number[]) {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  for (let i = 0; i < xs.length - 1; i++) {
    if (x >= xs[i] && x <= xs[i + 1]) {
      const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + t * (ys[i + 1] - ys[i]);
    }
  }
  return ys[ys.length - 1];
}

/** 错峰弹出的标签 */
function SatelliteTag({
  tag,
  idx,
  agent,
}: {
  tag: string;
  idx: number;
  agent: Agent;
}) {
  const isZhangmingming = agent.name === "张明明";
  const translateX = isZhangmingming ? (idx === 0 ? 10 : 0) : idx === 0 ? 5 : 0;
  const translateY = isZhangmingming ? (idx === 0 ? -15 : -10) : 0;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.4 + idx * 0.15,
        type: "spring",
        damping: 14,
        stiffness: 100,
        mass: 0.8,
      }}
      className="block w-fit rounded-[99px] rounded-br-[16px] border px-3 py-1 text-[12px] whitespace-nowrap"
      style={{
        backgroundColor: agent.colors.primary,
        borderColor: agent.colors.tagBorder,
        color: agent.colors.tagText,
        transform: `translate(${translateX}px, ${translateY}px) rotate(${idx === 0 ? 7 : -11}deg)`,
      }}
    >
      {tag}
    </motion.span>
  );
}

function wheelRelativePos(index: number, v: number) {
  let p = index - v;
  while (p < -0.6) p += ITEM_COUNT;
  while (p > 3.4) p -= ITEM_COUNT;
  return p;
}

function wheelAngleRad(index: number, v: number) {
  return ((START_ANGLE + wheelRelativePos(index, v) * ANGLE_GAP) * Math.PI) / 180;
}

function WheelItem({
  agent,
  index,
  scrollIndex,
  selected,
  onPress,
  onConfirm,
  confirmed,
}: {
  agent: Agent;
  index: number;
  scrollIndex: MotionValue<number>;
  selected: boolean;
  onPress: () => void;
  onConfirm: () => void;
  confirmed: boolean;
}) {
  // useTransform 创建即计算初始位置，并随 scrollIndex 直驱 DOM（不走重渲染）
  const bottom = useTransform(scrollIndex, (v) =>
    OUTER_RADIUS * Math.sin(wheelAngleRad(index, v)) - AVATAR_SIZE / 2,
  );
  const right = useTransform(scrollIndex, (v) =>
    OUTER_RADIUS * Math.cos(wheelAngleRad(index, v)) - AVATAR_SIZE / 2,
  );
  const opacity = useTransform(scrollIndex, (v) =>
    interp(wheelRelativePos(index, v), [-0.5, 0, 3, 3.5], [0, 1, 1, 0]),
  );
  const zIndex = useTransform(scrollIndex, (v) =>
    Math.round(wheelRelativePos(index, v)) === 0 ? 100 : 1,
  );

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ bottom, right, opacity, zIndex, width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <button
        type="button"
        onClick={onPress}
        aria-label={agent.name}
        className="relative flex items-center justify-center"
      >
        {/* 左侧标签 */}
        {selected ? (
          <span className="absolute right-[76px] top-[-14px] z-[100] flex min-w-[150px] flex-col items-end gap-2">
            {agent.tags.map((tag, idx) => (
              <SatelliteTag key={tag} tag={tag} idx={idx} agent={agent} />
            ))}
          </span>
        ) : null}

        {/* 头像：64→86，背景白→透明 */}
        <span
          className="block overflow-hidden rounded-full transition-all duration-300 ease-out"
          style={{
            width: selected ? 86 : 64,
            height: selected ? 86 : 64,
            transform: selected ? "scale(1.1)" : "scale(1)",
            backgroundColor: selected ? "transparent" : "#ffffff",
          }}
        >
          <Image
            src={selected ? agent.avatar.selected : agent.avatar.unselected}
            alt={agent.name}
            width={86}
            height={86}
            draggable={false}
            className="h-full w-full select-none object-cover"
            unoptimized
          />
        </span>

        {/* 右侧信息卡 */}
        {selected ? (
          <motion.span
            initial={{ opacity: 0, x: -40, scaleX: 0.6 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            transition={{ delay: 0.4, type: "spring", damping: 14, stiffness: 100, mass: 0.8 }}
            className="absolute left-[40px] top-1/2 z-[-1] flex w-max -translate-y-1/2 items-center gap-2.5 rounded-[99px] border bg-white py-2 pl-6 pr-2 shadow-sm"
            style={{ borderColor: agent.colors.primary }}
          >
            <span className="ml-[30px] flex flex-col">
              <span className="flex items-center gap-1.5">
                <span className="whitespace-nowrap text-[16px] font-semibold text-black">{agent.name}</span>
                {/* 求职 / 招聘 端别徽章 */}
                <span
                  className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] leading-none"
                  style={{ backgroundColor: agent.colors.primary, color: agent.colors.tagText }}
                >
                  {agent.side === "b" ? "招聘" : "求职"}
                </span>
              </span>
              <span className="mt-0.5 whitespace-nowrap text-[13px] leading-tight text-[#8C8C8C]">
                “{agent.nickName}”
              </span>
            </span>
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
              className="ml-auto shrink-0 cursor-pointer whitespace-nowrap rounded-[20px] px-5 py-2 text-[14px] font-semibold text-black"
              style={{ backgroundColor: agent.colors.primary }}
            >
              {confirmed ? "✓" : "确定"}
            </span>
          </motion.span>
        ) : null}
      </button>
    </motion.div>
  );
}

function AgentWheelScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { agentKey, setAgentKey } = useAgentSelection();
  const [confirmedKey, setConfirmedKey] = useState<string | null>(null);
  const scrollIndex = useMotionValue(0);
  const clickLock = useRef(false);
  const suppressClick = useRef(false);
  const dragState = useRef<{
    startY: number;
    startIndex: number;
    lastY: number;
    lastT: number;
    velY: number;
    moved: boolean;
  } | null>(null);

  useMotionValueEvent(scrollIndex, "change", (v) => {
    if (clickLock.current) return;
    let idx = Math.round(v) % ITEM_COUNT;
    if (idx < 0) idx += ITEM_COUNT;
    setSelectedIndex((prev) => (prev === idx ? prev : idx));
  });

  const current = AGENTS[selectedIndex];

  // 把当前经纪人同步给外层 section 背景与对话模块
  useEffect(() => {
    setAgentKey(current.key);
  }, [current, setAgentKey]);

  const handleItemPress = (index: number) => {
    clickLock.current = true;
    setSelectedIndex(index);
    const v = scrollIndex.get();
    const cycle = Math.floor(v / ITEM_COUNT);
    let target = cycle * ITEM_COUNT + index;
    if (Math.abs(target - v) > ITEM_COUNT / 2) {
      if (target > v) target -= ITEM_COUNT;
      else target += ITEM_COUNT;
    }
    animate(scrollIndex, target, {
      type: "spring",
      mass: 0.5,
      damping: 15,
      stiffness: 100,
      onComplete: () => {
        clickLock.current = false;
      },
    });
  };

  // 外部切换经纪人（如对话 tab 联动）时，转盘同步转到目标位置
  useEffect(() => {
    const target = AGENTS.findIndex((a) => a.key === agentKey);
    if (target < 0) return;
    let normalized = Math.round(scrollIndex.get()) % ITEM_COUNT;
    if (normalized < 0) normalized += ITEM_COUNT;
    if (normalized !== target) handleItemPress(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentKey]);

  const handleConfirm = (agent: Agent) => {
    setConfirmedKey(agent.key);
    window.setTimeout(() => setConfirmedKey(null), 1500);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    scrollIndex.stop();
    dragState.current = {
      startY: e.clientY,
      startIndex: scrollIndex.get(),
      lastY: e.clientY,
      lastT: performance.now(),
      velY: 0,
      moved: false,
    };

    // 不用 setPointerCapture（它会把 click 重定向到拖拽层导致按钮点不动），
    // 改为 window 级监听，移动超阈值才算拖拽，否则保留原点击行为
    const handleMove = (ev: PointerEvent) => {
      const d = dragState.current;
      if (!d) return;
      const dy = ev.clientY - d.startY;
      if (Math.abs(dy) > 4) d.moved = true;
      const now = performance.now();
      const dt = now - d.lastT;
      if (dt > 0) d.velY = ((ev.clientY - d.lastY) / dt) * 1000;
      d.lastY = ev.clientY;
      d.lastT = now;
      scrollIndex.set(d.startIndex + dy / DRAG_DAMPING);
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      const d = dragState.current;
      if (!d) return;
      dragState.current = null;
      if (!d.moved) return; // 视为点击，交给 button 的 onClick
      suppressClick.current = true;
      const predicted = scrollIndex.get() + d.velY / FLING_DAMPING;
      animate(scrollIndex, Math.round(predicted), {
        type: "spring",
        mass: 1,
        damping: 25,
        stiffness: 180,
      });
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, { once: true });
    window.addEventListener("pointercancel", handleUp, { once: true });
  };

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden"
      style={{
        // 复刻区还原 App 观感：用系统字体，不用作品集字体
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
      }}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick.current = false;
        }
      }}
    >
      {/* 大立绘 */}
      <div className="pointer-events-none absolute bottom-[13%] left-0 right-0 aspect-[754/1080]">
        {AGENTS.map((agent, index) => (
          <div
            key={agent.key}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: selectedIndex === index ? 1 : 0, zIndex: selectedIndex === index ? 10 : 0 }}
          >
            <Image
              src={agent.bigImage}
              alt={agent.name}
              fill
              sizes="390px"
              draggable={false}
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* 转盘拖拽区（覆盖右下四分之一圆） */}
      <div
        className="absolute bottom-0 right-0 z-20 cursor-grab touch-none active:cursor-grabbing"
        style={{ width: OUTER_RADIUS + AVATAR_SIZE, height: OUTER_RADIUS + AVATAR_SIZE }}
        onPointerDown={onPointerDown}
      >
        {/* 虚线外圈 */}
        <div
          className="pointer-events-none absolute rounded-full border border-dashed border-black/10"
          style={{
            right: -OUTER_RADIUS,
            bottom: -OUTER_RADIUS,
            width: OUTER_RADIUS * 2,
            height: OUTER_RADIUS * 2,
          }}
        />
        {/* 渐变内圈 */}
        <div
          className="pointer-events-none absolute rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)]"
          style={{
            right: -INNER_RADIUS,
            bottom: -INNER_RADIUS,
            width: INNER_RADIUS * 2,
            height: INNER_RADIUS * 2,
            background: `linear-gradient(160deg, ${current.circleGradient[0]} 0%, ${current.circleGradient[1]} 60%)`,
          }}
        />
        {/* 头像项 */}
        <div className="absolute bottom-0 right-0">
          {AGENTS.map((agent, index) => (
            <WheelItem
              key={agent.key}
              agent={agent}
              index={index}
              scrollIndex={scrollIndex}
              selected={selectedIndex === index}
              onPress={() => handleItemPress(index)}
              onConfirm={() => handleConfirm(agent)}
              confirmed={confirmedKey === agent.key}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

function AgentWheelPhone() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 无手机框：仅按 390 设计宽度等比缩放，背景透明融入页面；
  // 内部保持 App 原始构图，只裁掉顶部 slogan/header 删除后留下的空白
  return (
    <div
      ref={frameRef}
      className="w-full max-w-[420px] overflow-hidden"
      style={{ aspectRatio: `${DESIGN_W} / ${VISIBLE_H}` }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          marginTop: -(DESIGN_H - VISIBLE_H) * scale,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <AgentWheelScreen />
      </div>
    </div>
  );
}

export function AgentWheelShowcase({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const { agentKey } = useAgentSelection();
  const agent = getAgentByKey(agentKey);
  const tint = agent.tint;

  return (
    <section data-nav-theme="light" className="theme-light relative overflow-hidden bg-transparent">
      {/* 当前经纪人主题色晕染到整个区块背景，随切换渐变 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background] duration-500"
        style={{
          background: `linear-gradient(180deg, ${tint} 0%, ${tint.replace(", 1)", ", 0)")} 45%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-8 sm:pt-24 lg:pr-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-xl lg:self-center">
            <motion.h2
              data-journey-anchor
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="display mt-4 text-3xl leading-[1.15] sm:text-5xl"
            >
              {isZh ? "选择你的职场经纪人" : "Meet your career agents"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-sm leading-relaxed text-muted sm:text-base"
            >
              {isZh
                ? "「就绪」把 AI 助手做成了六位有人设、有性格的经纪人——4 位服务求职，2 位服务招聘。用户进入产品的第一步，就是通过右下的转盘选择自己的经纪人。"
                : "Ready turns its AI assistants into six personas — four for job seekers and two for recruiters. The first step of onboarding is picking one on the wheel."}
            </motion.p>
            <p className="mt-6 font-mono text-xs text-muted">
              {isZh
                ? "拖动右下转盘或点击头像切换经纪人 · 交互复刻自 App 真实页面"
                : "Drag the wheel or tap an avatar · interaction recreated from the real app screen"}
            </p>

            {/* 当前经纪人的小状态行（主题色小点 + 名字 + 端别，文字用主题深色） */}
            <p className="mt-3 flex items-center gap-1.5 text-xs">
              <motion.span
                key={agent.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tint }} />
                <span style={{ color: agent.accent }}>
                  {isZh
                    ? `当前 · ${agent.name}（${agent.side === "b" ? "招聘经纪人" : "求职经纪人"}）`
                    : `Current · ${agent.name} (${agent.side === "b" ? "recruiting agent" : "job-seeking agent"})`}
                </span>
              </motion.span>
            </p>
          </div>

          {/* 画布贴住区块右缘与底边，转盘就像顶着屏幕角落（移动端 min-w-0 防吹破） */}
          <div className="flex min-w-0 items-end justify-center lg:justify-end">
            <AgentWheelPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
