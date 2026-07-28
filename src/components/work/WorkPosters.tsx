"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import ShapeGrid from "@/components/ShapeGrid";
import { Reveal } from "@/components/Reveal";
import { PressureLabel } from "@/components/PressureLabel";
import { EmText } from "@/components/EmText";
import { AnimatePresence, motion } from "motion/react";

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/* 滚筒参数：相邻海报在圆筒上的夹角（度）；|angle| 超过 DRUM_VISIBLE 的海报隐藏 */
const DRUM_STEP = 30;
const DRUM_VISIBLE = 62;

/**
 * 作品滚筒：全屏沉浸式 CSS 3D 圆筒（siena.film 式）。
 * 每张海报几乎铺满视口，上下只露出相邻海报的一条缝；信息全部叠在海报上。
 * 滚动驱动旋转进度 p，松手吸附到整张；滚动速度映射轻微果冻形变。
 */
export function WorkPosters({
  locale,
  title,
  titleEm,
  subtitle,
  cta,
  hint,
}: {
  locale: Locale;
  title: string;
  titleEm?: string;
  subtitle: string;
  cta: string;
  hint: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({ absTop: 0, total: 1 });
  const [p, setP] = useState(0);
  // 快速定位菜单（点击顶部指示 pill 展开全量作品列表）
  const [menuOpen, setMenuOpen] = useState(false);
  // 作品区视图：drum = 沉浸式滚筒，grid = 宫格画廊
  const [view, setView] = useState<"drum" | "grid">("drum");
  const router = useRouter();
  const N = projects.length;
  const span = Math.max(N - 1, 1);

  // 滚筒：半径随海报高度算出（相邻海报正好相切于筒面）
  const drumRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(1400);
  // 果冻形变速度（ref 累计）与形变系数（state，驱动渲染）
  const velRef = useRef(0);
  const lastPRef = useRef(0);
  const [v, setV] = useState(0);
  // 最后一次滚动方向（吸附跟随它，而不是就近回拽）
  const dirRef = useRef(1);
  // 有指针按在作品区时不吸附（手指/鼠标拖动途中不抢滚动）
  const pointerActiveRef = useRef(false);
  // 指针抬起后触发一次吸附检查（回调在滚动 effect 里赋值）
  const kickSnapRef = useRef<(() => void) | null>(null);
  // 指针按下时停掉进行中的吸附滑行，立刻交还滚动权
  const cancelGlideRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = drumRef.current;
    if (!el) return;
    const update = () =>
      setRadius(
        (el.clientHeight + 24) / (2 * Math.sin((DRUM_STEP / 2) * (Math.PI / 180)))
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
    // 依赖 view：宫格切回滚筒时舞台是全新节点，必须重新测量半径，
    // 否则 ResizeObserver 还挂在已卸载的旧节点上，半径永远停在初始值
  }, [view]);

  // Esc 关闭定位菜单
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // 宫格视图下禁用滚筒的滚动驱动与吸附，避免和用户滚动打架
    if (view !== "drum") return;

    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    let rafId = 0;
    // Chrome（Safari 不会）：用户的继续滚动会打断浏览器的 programmatic smooth
    // 滚动，打断—再吸附—再打断……滑行永远走不完，滚筒原地爬行（停在第一张）。
    // 所以吸附滑行改用 rAF 逐帧滚动，且必须 behavior:instant——html 上有
    // scroll-behavior:smooth，用 auto 会被 CSS 拖回平滑滚动，照样被打断。
    // 滑行保证完成；用户同向滚动只是叠加加速，反向顶一段或冲过目标则认输。
    let glide: {
      top: number;
      dir: number;
      from: number;
      t0: number;
      ms: number;
      raf: number;
    } | null = null;
    const stopGlide = () => {
      if (glide) {
        cancelAnimationFrame(glide.raf);
        glide = null;
      }
    };
    const startGlide = (top: number) => {
      stopGlide();
      const from = window.scrollY;
      const g = (glide = {
        top,
        dir: Math.sign(top - from) || 1,
        from,
        t0: performance.now(),
        // 时长随距离：一张≈440ms，跳多张（用力甩）最多 700ms
        ms: clamp(Math.abs(top - from) * 0.6, 300, 700),
        raf: 0,
      });
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
      const step = (now: number) => {
        if (glide !== g) return;
        const traveled = (window.scrollY - g.from) * g.dir;
        // 用户反向顶回起点 48px 以上，或自己冲过目标 48px：交还滚动权
        if (traveled < -48 || (window.scrollY - g.top) * g.dir > 48) {
          glide = null;
          return;
        }
        const k = Math.min((now - g.t0) / g.ms, 1);
        window.scrollTo({ top: g.from + (g.top - g.from) * easeOut(k), behavior: "instant" });
        if (k >= 1) {
          glide = null;
          return;
        }
        g.raf = requestAnimationFrame(step);
      };
      g.raf = requestAnimationFrame(step);
    };
    const freshProg = () => {
      const { absTop, total } = metricsRef.current;
      const d = window.scrollY - absTop;
      return { raw: (d / total) * span, prog: (clamp(d, 0, total) / total) * span };
    };
    // 只在挂载和 resize 时测量一次，避免 scroll 回调里强制同步布局
    const measure = () => {
      const rect = el.getBoundingClientRect();
      // 滚动零点取舞台 sticky 吸顶的位置（而非板块顶部）：
      // 否则 p=0 吸附时舞台还没吸顶，首张海报底部（CTA 所在）悬在视口外点不到
      const stickyTop = window.matchMedia("(min-width: 768px)").matches ? 64 : 0;
      let stick = 0;
      const stage = stageRef.current;
      if (stage) {
        // sticky 吸住后 offsetTop 会带上位移（滚得越深越大），不再是静态偏移。
        // Chrome 移动端滚动时收起地址栏会触发 resize、桌面端刷新后恢复滚动
        // 位置会挂载即吸住——这两种情况都会把 absTop/total 量爆（直接跳到最后
        // 一张、或永远停在第一张）。临时关掉 sticky 读静态偏移再恢复；
        // top 也要归零——md:top-16 对 relative 同样生效，会多读 64px
        stage.style.position = "relative";
        stage.style.top = "0";
        stick = Math.max(stage.offsetTop - stickyTop, 0);
        stage.style.position = "";
        stage.style.top = "";
      }
      metricsRef.current = {
        absTop: rect.top + window.scrollY + stick,
        total: Math.max(el.offsetHeight - window.innerHeight - stick, 1),
      };
    };
    const update = () => {
      rafId = 0;
      const { absTop, total } = metricsRef.current;
      const scrolled = clamp(window.scrollY - absTop, 0, total);
      const prog = (scrolled / total) * span;
      // 果冻形变速度：滚动驱动，且用 rAF 自衰减到 0——滚动停下后形变必须
      // 回弹归零，否则 preserve-3d 容器带着残留的 skew/scale，
      // 命中区域与视觉错位，海报边缘（CTA 所在）点击落空
      const dp = prog - lastPRef.current;
      velRef.current = velRef.current * 0.8 + dp * 0.2;
      if (dp !== 0) dirRef.current = dp > 0 ? 1 : -1;
      lastPRef.current = prog;
      if (Math.abs(velRef.current) < 0.0005) velRef.current = 0;
      setV(clamp(velRef.current * 6, -1, 1));
      setP(prog);
      // 未衰减完就继续自驱动（setP(prog) 相同值不会触发重渲染，归零靠 setV）
      if (velRef.current !== 0) rafId = requestAnimationFrame(update);
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        // 滑行由 rAF 自驱动，会自己完成或认输（认输后下次计时器再重新决策）
        if (glide) return;
        // 手指/鼠标还按着：不抢滚动（抬起时 kickSnapRef 会补一次检查）
        if (pointerActiveRef.current) return;
        const m = metricsRef.current;
        // 用实时位置重算，不用 update 闭包里的旧值（timer 触发时可能已经又滚过）
        const { raw: rawNow, prog: progNow } = freshProg();
        const nearest = Math.round(progNow);
        // 过渡区（含锚点直达 #work 的落点）不允许停留：
        // 否则首张海报底部（CTA）悬在视口外点不到——一律前吸到吸顶点。
        // 向上滚动途中不会触发（滚动事件会不断重置计时器），放心滚出。
        if (nearest === 0 && rawNow <= 0) {
          if (rawNow > -0.5) {
            startGlide(m.absTop);
          }
          return;
        }
        // 吸附方向跟随最后一次滚动方向：往下滚吸到下一张，往上滚吸回上一张，
        // 不用 Math.round 就近回拽——鼠标滚轮一次只走一小段（≪半张），
        // 就近吸附必然把人拽回上一张，滚筒怎么滚都翻不动。
        // ±0.05 余量：已贴整页（像素取整/触控板停驻抖动）时不误吸到隔壁
        const target = clamp(
          dirRef.current > 0 ? Math.ceil(progNow - 0.05) : Math.floor(progNow + 0.05),
          0,
          span
        );
        if (Math.abs(progNow - target) > 0.001) {
          startGlide(m.absTop + (target / span) * m.total);
        }
      }, 150);
    };
    // scroll 事件可能一帧触发多次，用 rAF 对齐到每帧一次更新
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // 指针抬起后补一次吸附检查（按下期间被 pointerActiveRef 挡住的吸附在此兑现）；
    // 按下瞬间先停掉进行中的滑行，把滚动权立刻还给用户
    kickSnapRef.current = onScroll;
    cancelGlideRef.current = stopGlide;
    measure();
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      kickSnapRef.current = null;
      cancelGlideRef.current = null;
      stopGlide();
      if (snapTimer) clearTimeout(snapTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [span, N, view]);

  const active = clamp(Math.round(p), 0, N - 1);
  const current = projects[active] ?? projects[0];
  const currentTitle = current.previewTitle?.[locale] ?? current.title[locale];
  const open = (slug: string) => router.push(`/${locale}/work/${slug}`);
  // 滚筒吸附/滚动时海报在动，原生 click 要求按下与抬起落在同一元素，
  // 海报一动点击就被吞（「点了没反应」）。改为自己判定点按：
  // 指针捕获保证抬起一定回到按钮；按移动距离分三档——
  //   < 12px：点按，pointerup 直接跳转并吞掉随后的合成 click；
  //   12–24px：手抖的脏点击，交给合成 click 兜底跳转；
  //   ≥ 24px：视为拖拽，两段都抑制，不跳转。
  const tapRef = useRef<{ x: number; y: number } | null>(null);
  const dragDistRef = useRef(0);
  const swallowClickRef = useRef(false);
  const onPosterPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    // 指针捕获：保证海报滑走后 pointerup 仍然发回按钮，否则下面的判定收不到
    e.currentTarget.setPointerCapture(e.pointerId);
    tapRef.current = { x: e.clientX, y: e.clientY };
    dragDistRef.current = 0;
  };
  const onPosterPointerUp = (e: ReactPointerEvent<HTMLButtonElement>, slug: string) => {
    const s = tapRef.current;
    tapRef.current = null;
    if (!s) return;
    const moved = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    dragDistRef.current = moved;
    if (moved < 12) {
      swallowClickRef.current = true;
      open(slug);
    }
  };
  // 按压期间页面被程序化滚动（吸附/平滑跳转）会触发 pointercancel 打断按压——
  // 指针本身几乎没动就仍算点按；触屏滚动接管前手指已明显移动，不会误入
  const onPosterPointerCancel = (e: ReactPointerEvent<HTMLButtonElement>, slug: string) => {
    const s = tapRef.current;
    tapRef.current = null;
    if (!s) return;
    const moved = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    dragDistRef.current = moved;
    if (moved < 12) {
      swallowClickRef.current = true;
      open(slug);
    }
  };
  const jumpTo = (i: number) => {
    const { absTop, total } = metricsRef.current;
    window.scrollTo({ top: absTop + (i / span) * total, behavior: "smooth" });
  };

  return (
    // 高度直接渲染进 HTML（N 是构建期常量）：保证首屏 / 跨页跳转
    // 到 #about 锚点时作品区高度已就位，不会发生锚点算好位置后才撑高的位移
    <div
      ref={sectionRef}
      className={view === "drum" ? "relative h-[var(--work-h)]" : "relative"}
      style={{ ["--work-h" as string]: `${N * 100}vh` }}
      onPointerDown={() => {
        pointerActiveRef.current = true;
        cancelGlideRef.current?.();
      }}
      onPointerUp={() => {
        pointerActiveRef.current = false;
        kickSnapRef.current?.();
      }}
      onPointerCancel={() => {
        pointerActiveRef.current = false;
        kickSnapRef.current?.();
      }}
    >
      {/* 标题区：随页面流滚走，滚筒独占 sticky 舞台 */}
      <Reveal>
        <div className="relative z-30 mx-auto flex max-w-6xl flex-col items-center px-5 pb-10 pt-12 text-center sm:px-8">
          <PressureLabel text="Selected Work" size={20} />
          <h2 className={`display mt-3 text-4xl sm:text-5xl ${locale === "zh" ? "font-smiley" : ""}`}>
            <EmText
              text={title}
              em={titleEm}
              emClassName={locale === "zh" ? "serif-em serif-em--cjk" : "serif-em"}
            />
          </h2>
          <p className="mt-4 max-w-xl text-muted">{subtitle}</p>

          {/* 视图切换：沉浸式滚筒 / 宫格画廊 */}
          <div className="mt-6 inline-flex rounded-full border border-line bg-bg p-1">
            {(
              [
                ["drum", locale === "zh" ? "沉浸式" : "Immersive"],
                ["grid", locale === "zh" ? "宫格" : "Grid"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  view === v ? "bg-accent text-black" : "text-muted hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* sticky 全屏滚筒舞台（移动端吸附于视口顶，桌面端吸附于导航下） */}
      {view === "drum" ? (
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden md:top-16 md:h-[calc(100vh-4rem)]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <ShapeGrid
            direction="diagonal"
            speed={0.4}
            squareSize={42}
            shape="square"
            borderColor="#23232e"
            hoverFillColor="#22a596"
            hoverTrailAmount={0}
          />
        </div>

        {/* 常驻板块标识（左缘竖排）：滚筒全屏滚动时也能认出当前在「精选作品」区。
            仅桌面端显示——移动端海报近乎全宽，竖排文字会换列并被屏幕左缘裁切 */}
        <p className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl] md:block">
          <span className="text-accent">●</span> Selected Work{locale === "zh" ? " · 项目精选" : ""}
        </p>

        {/* 定位指示 pill（浮在卡片上方居中，点击展开全量作品列表） */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          className="absolute left-1/2 top-16 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-line bg-bg/80 px-6 py-3 font-mono text-sm text-fg shadow-2xl backdrop-blur transition-colors hover:border-accent md:top-3 md:text-base"
        >
          <span className="text-base text-accent md:text-lg">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-muted">/ {String(N).padStart(2, "0")}</span>
          <span className="hidden sm:inline">· {currentTitle}</span>
          <span className={`text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        {/* 右侧竖排滚动提示（桌面端，落在海报外的页面边条上） */}
        <p className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl] md:block">
          {hint}
        </p>

        {/* 全量作品列表（点击指示 pill 展开，点项直接定位，免去上下滚动） */}
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md px-6"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-white/50">
                  {locale === "zh" ? "全部作品 · 点击定位" : "All projects · jump to"}
                </p>
                <ul className="flex flex-col gap-2">
                  {projects.map((proj, i) => {
                    const itemTitle = proj.previewTitle?.[locale] ?? proj.title[locale];
                    const isActive = active === i;
                    return (
                      <li key={proj.slug}>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            jumpTo(i);
                          }}
                          className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                            isActive
                              ? "border-accent bg-white/10"
                              : "border-white/15 bg-white/5 hover:border-white/40"
                          }`}
                        >
                          <span className={`font-mono text-sm ${isActive ? "text-accent" : "text-white/50"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="display block truncate text-xl text-white">{itemTitle}</span>
                            <span className="mt-0.5 block truncate text-xs text-white/60">
                              {proj.category[locale]} · {proj.year}
                            </span>
                          </span>
                          <span className="text-white/40 transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* 滚筒。每张海报绕「向后推了 radius 的旋转轴」rotateX，构成圆筒：
            transform-origin 的 Z 分量后移，几何上与「rotateX + 双层 translateZ」
            完全等价，但前方海报（angle=0）的变换就是单位矩阵——
            命中区域与真实盒子重合，右下角 CTA 也能稳定点中；
            双层 translateZ 方案在相邻海报 3D 叠加处命中会落空。
            整条链都要 preserve-3d：中间任何一环扁平化，命中区域都会和视觉错位。
            注意：海报层是绝对定位，不吃父级 padding——缩进必须写在它自己的盒子上 */}
        <div className="absolute inset-0 [perspective:2000px]">
          <div
            ref={drumRef}
            className="absolute inset-x-3 bottom-3 top-20 sm:inset-x-5 md:inset-x-8 md:bottom-6 md:top-16"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scaleY(${1 - Math.abs(v) * 0.05}) skewY(${-v * 2.5}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
            {projects.map((proj, i) => {
              const projTitle = proj.previewTitle?.[locale] ?? proj.title[locale];
              const summary = proj.previewSummary?.[locale] ?? proj.summary[locale];
              // 方向与滚动直觉一致：往下滚时下一张从底部升起，当前张从顶部滚出
              const angleRaw = (p - i) * DRUM_STEP;
              // 吸附到位后仍可能有千分位微旋转（滚动位置像素取整导致）；
              // 只要变换不是单位矩阵，Chrome 的真实输入命中就会在海报角落
              // （CTA 所在）落空——微角度直接归零，视觉无差（z 位移 < 0.001px）
              const angle = Math.abs(angleRaw) < 0.05 ? 0 : angleRaw;
              const abs = Math.abs(angle);
              const visible = abs < DRUM_VISIBLE;
              const priority = abs < DRUM_STEP;
              return (
                <button
                  key={proj.slug}
                  type="button"
                  onPointerDown={onPosterPointerDown}
                  onPointerUp={(e) => onPosterPointerUp(e, proj.slug)}
                  onPointerCancel={(e) => onPosterPointerCancel(e, proj.slug)}
                  // 点按已在 pointerup 处理（吞掉对应合成 click）；
                  // 12–24px 的脏点击在这里兜底；≥24px 的拖拽两段都不跳转
                  onClick={() => {
                    if (swallowClickRef.current) {
                      swallowClickRef.current = false;
                      dragDistRef.current = 0;
                      return;
                    }
                    if (dragDistRef.current >= 24) {
                      dragDistRef.current = 0;
                      return;
                    }
                    dragDistRef.current = 0;
                    open(proj.slug);
                  }}
                  aria-label={projTitle}
                  aria-hidden={!visible}
                  tabIndex={visible ? 0 : -1}
                  className="absolute inset-0 overflow-hidden rounded-[28px] border border-line text-left shadow-2xl"
                  style={{
                    background: proj.gradient,
                    transform: `rotateX(${angle}deg)`,
                    transformOrigin: `center center ${-radius}px`,
                    backfaceVisibility: "hidden",
                    opacity: visible ? 1 : 0,
                    visibility: visible ? "visible" : "hidden",
                    filter: `brightness(${1 - Math.min(abs / DRUM_VISIBLE, 1) * 0.6})`,
                    transition: "opacity 0.25s ease, filter 0.15s linear",
                    cursor: "pointer",
                  }}
                >
                  {/* 封面常驻挂载，避免滚动途中反复挂载/卸载大图造成卡顿。
                      scale-[1.03]：3D 旋转时图片层与按钮背景分层栅格化，
                      底边会漏出 1px 渐变底色，略微放大盖住接缝 */}
                  {proj.cover ? (
                    <Image
                      src={proj.cover}
                      alt={projTitle}
                      fill
                      sizes="100vw"
                      priority={priority}
                      loading={priority ? "eager" : "lazy"}
                      decoding="async"
                      className="scale-[1.03] object-cover"
                      unoptimized
                    />
                  ) : null}
                  {/* 上下双向渐变压暗：顶部与底部文字区都更突出，中段画面保持干净 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.78) 100%)",
                    }}
                  />

                  {/* 左上：年份 + 类别（移动端年份收窄一档，避免与右上角标相挤） */}
                  <div className="absolute left-5 top-5 sm:left-8 sm:top-7">
                    <p className="display text-3xl text-white sm:text-6xl">{proj.year}</p>
                    <p className="mt-1.5 font-mono text-xs uppercase tracking-widest text-white sm:text-sm">
                      {proj.category[locale]}
                    </p>
                  </div>
                  {/* 右上：角标 */}
                  <span className="absolute right-5 top-5 font-mono text-xl text-white sm:right-8 sm:top-7">
                    {proj.glyph}
                  </span>

                  {/* 底部信息行：超大标题 + 元信息表（siena 式 hairline 行）居左，
                      移动端 CTA 居右——同一弹性行底对齐，标题可换行、CTA 不收缩，
                      任何窄屏下两者都不会重叠 */}
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 sm:inset-x-8 sm:bottom-8">
                    <div className="min-w-0 sm:max-w-xl">
                      <h3 className="display text-4xl text-white sm:text-7xl">{projTitle}</h3>
                      <dl className="mt-6 hidden max-w-lg text-base sm:block">
                        {[
                          [locale === "zh" ? "我的职责" : "ROLE", proj.role[locale]],
                          [locale === "zh" ? "年份" : "YEAR", proj.year],
                          [locale === "zh" ? "类型" : "TYPE", proj.category[locale]],
                        ].map(([k, val]) => (
                          <div
                            key={k as string}
                            className="flex items-baseline justify-between gap-6 border-t border-white/25 py-2 last:border-b"
                          >
                            <dt className="font-mono text-sm uppercase tracking-widest text-white/70">
                              {k}
                            </dt>
                            <dd className="text-right text-white">{val}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    {/* 移动端 CTA：比桌面小一号，与标题同一弹性行（桌面端在右下信息块里） */}
                    <span className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:scale-110 md:hidden">
                      {cta} →
                    </span>
                  </div>

                  {/* 右下：摘要 + 标签 + CTA（桌面端）；移动端只留 CTA */}
                  <div className="absolute bottom-8 right-8 hidden max-w-md flex-col items-end gap-4 text-right md:flex">
                    <p className="text-lg leading-relaxed text-white">{summary}</p>
                    <div className="flex flex-wrap justify-end gap-2">
                      {proj.tags[locale].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/25 px-3 py-1.5 text-sm text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-black transition-transform duration-200 hover:scale-110">
                      {cta} →
                    </span>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>
      ) : null}

      {/* 宫格视图：两列大图画廊（移动端单列） */}
      {view === "grid" ? (
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 pb-16 sm:grid-cols-2 sm:px-8">
          {projects.map((proj, i) => {
            const projTitle = proj.previewTitle?.[locale] ?? proj.title[locale];
            const summary = proj.previewSummary?.[locale] ?? proj.summary[locale];
            return (
              <Reveal key={proj.slug} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => open(proj.slug)}
                  aria-label={projTitle}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line text-left"
                  style={{ background: proj.gradient }}
                >
                  {proj.cover ? (
                    <Image
                      src={proj.cover}
                      alt={projTitle}
                      fill
                      sizes="(max-width: 639px) 100vw, 640px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      unoptimized
                    />
                  ) : (
                    <span className="absolute right-5 top-5 font-mono text-xl text-white/85">
                      {proj.glyph}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-white/70">
                        {proj.category[locale]} · {proj.year}
                      </p>
                      <h3 className="display mt-1.5 text-2xl text-white sm:text-3xl">
                        {projTitle}
                      </h3>
                    </div>
                    <p className="hidden max-w-[46%] text-right text-xs leading-relaxed text-white/75 sm:block">
                      {summary}
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
