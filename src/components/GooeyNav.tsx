"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type GooeyItem = {
  label: string;
  href: string;
  icon?: string;
  /** 动作型 tab：点击不导航，触发此回调（如打开工牌浮层） */
  onAction?: () => void;
};

type Particle = {
  start: number[];
  end: number[];
  time: number;
  scale: number;
  color: number;
  rotate: number;
};

/**
 * Gooey 粘性导航点击效果（改编自 reactbits GooeyNav）。
 * 点击 tab 时粒子迸射 + 药丸状气泡汇聚。颜色用站点品牌色。
 * 由父组件根据当前路由传入 activeIndex。
 */
export function GooeyNav({
  items,
  activeIndex,
}: {
  items: GooeyItem[];
  activeIndex: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // 点击后立刻点亮（乐观更新），不等路由跳转完成；路由更新后回落到 activeIndex
  const [override, setOverride] = useState<number | null>(null);
  const active = override ?? activeIndex;
  useEffect(() => {
    setOverride(null);
  }, [activeIndex]);

  // 效果参数
  const animationTime = 600;
  const particleCount = 15;
  const particleDistances = [90, 10];
  const particleR = 100;
  const timeVariance = 300;
  const colors = [1, 2, 3, 1, 2, 3, 1, 4];

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (
    i: number,
    t: number,
    d: number[],
    r: number
  ): Particle => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // already removed
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    // 连图标一起克隆到浮层（innerText 会丢掉图标，所以用 anchor 的 innerHTML）
    const anchor = element.querySelector("a");
    textRef.current.innerHTML = anchor ? anchor.innerHTML : element.innerText;
  };

  // 路由变化 / 初次挂载 / 窗口缩放 时把气泡定位到当前激活的 tab
  useEffect(() => {
    const setPos = () => {
      const lis = navRef.current?.querySelectorAll("li");
      const activeLi = lis?.[active] as HTMLElement | undefined;
      if (activeLi) updateEffectPosition(activeLi);
    };
    setPos();
    textRef.current?.classList.add("active");
    const ro = new ResizeObserver(setPos);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", setPos);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setPos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const fireEffect = (li: HTMLElement) => {
    updateEffectPosition(li);
    if (filterRef.current) {
      filterRef.current
        .querySelectorAll(".particle")
        .forEach((p) => p.remove());
    }
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth; // 重启过渡
      textRef.current.classList.add("active");
    }
    if (filterRef.current) makeParticles(filterRef.current);
  };

  const handleClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    const item = items[index];
    const li = e.currentTarget;
    // 动作型 tab（如「联系」）：不导航、不改路由激活，只触发回调 + 气泡迸射。
    // 点亮状态由父组件传入的 activeIndex 控制（工牌打开时 = 该 tab）。
    if (item.onAction) {
      fireEffect(li);
      item.onAction();
      return;
    }
    if (index === active) return; // 点的是当前页，不重放
    setOverride(index); // 立刻点亮
    fireEffect(li);
    // 跳转交给 <Link>；导航在 layout 中持久存在，动画不会被打断
  };

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, i) => {
            const inner = (
              <>
                {item.icon ? (
                  <span
                    className="nav-ico"
                    style={
                      { ["--icon" as string]: `url(${item.icon})` } as React.CSSProperties
                    }
                    aria-hidden
                  />
                ) : null}
                {item.label}
              </>
            );
            return (
              <li
                key={item.href}
                className={active === i ? "active" : ""}
                onClick={(e) => handleClick(e, i)}
              >
                {item.onAction ? (
                  <button type="button">{inner}</button>
                ) : (
                  <Link href={item.href}>{inner}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} aria-hidden />
      <span className="effect text" ref={textRef} aria-hidden />
    </div>
  );
}
