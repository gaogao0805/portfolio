"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll } from "motion/react";

/**
 * 旅程线：一条细线从三个模块背后蜿蜒穿过，随滚动画出。
 * 锚点通过 data-journey-anchor 在运行时实测，任意宽度都准确。
 */

type Pt = { x: number; y: number };

/**
 * 生成蜿蜒旅程线：从容器顶边进入，过全部锚点，
 * 锚点之间插入左右交替的游走点，Catmull-Rom 样条保证处处平滑。
 */
function buildJourneyPath(anchors: Pt[], width: number, height: number) {
  if (anchors.length < 2) return "";

  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  const pts: Pt[] = [{ x: first.x, y: 0 }]; // 起点：顶边（从上一块内容连下来）
  anchors.forEach((a, i) => {
    pts.push(a);
    if (i < anchors.length - 1) {
      const next = anchors[i + 1];
      // 锚点之间的游走点：左右交替，形成自然的 S 弯
      pts.push({
        x: width * (i % 2 === 0 ? 0.68 : 0.3),
        y: a.y + (next.y - a.y) / 2,
      });
    }
  });
  pts.push({ x: last.x, y: height }); // 终点：底边穿出

  // Catmull-Rom → Bezier（过所有点的平滑曲线）
  const cr = [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = cr[i];
    const p1 = cr[i + 1];
    const p2 = cr[i + 2];
    const p3 = cr[i + 3];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export type JourneyTone = { from: string; to: string };

const DEFAULT_TONE: JourneyTone = { from: "#1EC8B4", to: "#1EC8B4" };

export function AgentJourney({
  children,
  tone = DEFAULT_TONE,
}: {
  children: React.ReactNode;
  /** 旅程线渐变色调，默认青绿色；可按项目主题色覆盖 */
  tone?: JourneyTone;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [anchors, setAnchors] = useState<Pt[]>([]);
  // 每个实例独立的渐变 id，避免同页多条旅程线互相引用错颜色
  const gradientId = `journey-${useId().replace(/:/g, "")}`;

  // 实测三个模块标题锚点（data-journey-anchor），随宽度变化重算
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: el.offsetWidth, height: el.offsetHeight });
      setAnchors(
        Array.from(el.querySelectorAll("[data-journey-anchor]")).map((n) => {
          const r = (n as HTMLElement).getBoundingClientRect();
          return { x: r.left - rect.left, y: r.top - rect.top + r.height / 2 };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.65"],
  });

  const d = buildJourneyPath(anchors, size.width || 1, size.height || 1);

  return (
    <div ref={ref} className="relative bg-white">
      {/* 蜿蜒发光细线：滚动到哪就画到哪 */}
      {d ? (
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={tone.from} stopOpacity="0.15" />
              <stop offset="1" stopColor={tone.to} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* 柔光衬底（宽描边低透明，不用高斯模糊，省每帧滤镜重绘） */}
          <motion.path
            d={d}
            stroke={`url(#${gradientId})`}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.2}
            style={{ pathLength: scrollYProgress }}
          />
          {/* 主描边 */}
          <motion.path
            d={d}
            stroke={`url(#${gradientId})`}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.55}
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      ) : null}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
