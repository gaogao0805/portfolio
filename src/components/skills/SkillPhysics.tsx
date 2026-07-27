"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import type * as RAPIER from "@dimforge/rapier2d-compat";

/**
 * 技能 / 工具标签墙 —— 2D 物理沙盒（rapier2d-compat，与 3D 工牌同门）。
 * - 胶囊初始按普通排版摆好，滚到沙盒时「活过来」：轻轻跳起、碰撞堆叠；
 * - 可以抓住任意胶囊拖着甩，松手按抛出速度飞出去；
 * - 技能 = 灰边深字，工具 = 青边青字；
 * - 沙盒上方的解说栏：指向 / 点住一颗，显示它「意味着什么」（desc 在字典里维护）；
 * - prefers-reduced-motion 时不启动物理，保持静态排版。
 */

type Pill = { label: string; desc: string; kind: "skill" | "tool"; group?: string };

type Live = {
  el: HTMLSpanElement;
  w: number;
  h: number;
  l0: number;
  t0: number;
  body: RAPIER.RigidBody;
};

export function SkillPhysics({
  skillsTitle,
  toolsTitle,
  skills,
  toolGroups,
  hint,
  empty,
}: {
  skillsTitle: string;
  toolsTitle: string;
  skills: readonly { label: string; desc: string }[];
  toolGroups: readonly {
    label: string;
    items: readonly { label: string; desc: string }[];
  }[];
  hint: string;
  empty: string;
}) {
  const pills: Pill[] = [
    ...skills.map((s) => ({ label: s.label, desc: s.desc, kind: "skill" as const })),
    ...toolGroups.flatMap((g) =>
      g.items.map((s) => ({
        label: s.label,
        desc: s.desc,
        kind: "tool" as const,
        group: g.label,
      }))
    ),
  ];

  const arenaRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const started = useInView(arenaRef, { amount: 0.35, once: true });
  const [active, setActive] = useState<Pill | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let raf = 0;
    let world: RAPIER.World | null = null;
    let R: typeof RAPIER | null = null;
    let lives: Live[] = [];
    let walls: RAPIER.Collider[] = [];

    const drag = {
      body: null as RAPIER.RigidBody | null,
      el: null as HTMLSpanElement | null,
      ox: 0,
      oy: 0,
      samples: [] as { x: number; y: number; t: number }[],
    };

    const arenaPoint = (ev: PointerEvent) => {
      const rect = arenaRef.current!.getBoundingClientRect();
      return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    };

    const onMove = (ev: PointerEvent) => {
      if (!drag.body) return;
      const p = arenaPoint(ev);
      drag.body.setNextKinematicTranslation({
        x: p.x + drag.ox,
        y: p.y + drag.oy,
      });
      drag.samples.push({ x: p.x, y: p.y, t: performance.now() });
      if (drag.samples.length > 6) drag.samples.shift();
    };

    const onUp = () => {
      const b = drag.body;
      if (!b || !R) return;
      b.setBodyType(R.RigidBodyType.Dynamic, true);
      const s = drag.samples;
      if (s.length >= 2) {
        const a = s[0];
        const c = s[s.length - 1];
        const dt = Math.max(1, c.t - a.t) / 1000;
        b.setLinvel({ x: (c.x - a.x) / dt, y: (c.y - a.y) / dt }, true);
      }
      b.setAngvel((Math.random() - 0.5) * 5, true);
      if (drag.el) drag.el.style.zIndex = "";
      drag.body = null;
      drag.el = null;
      drag.samples = [];
    };

    const placeWalls = (W: number, H: number) => {
      if (!walls.length) return;
      const [floor, left, right, ceil] = walls;
      floor.setTranslation({ x: W / 2, y: H + 40 });
      left.setTranslation({ x: -40, y: 0 });
      right.setTranslation({ x: W + 40, y: 0 });
      ceil.setTranslation({ x: W / 2, y: -H * 3 });
    };

    const init = async () => {
      const mod = await import("@dimforge/rapier2d-compat");
      await mod.init();
      if (cancelled) return;
      R = mod;
      const arena = arenaRef.current;
      if (!arena) return;
      const W = arena.clientWidth;
      const H = arena.clientHeight;

      world = new R.World({ x: 0, y: 2400 });
      const mkWall = (x: number, y: number, hx: number, hy: number) =>
        world!.createCollider(R!.ColliderDesc.cuboid(hx, hy).setTranslation(x, y));
      walls = [
        mkWall(W / 2, H + 40, W, 40),
        mkWall(-40, 0, 40, H * 4),
        mkWall(W + 40, 0, 40, H * 4),
        mkWall(W / 2, -H * 3, W, 40),
      ];

      const els = pillRefs.current.filter(Boolean) as HTMLSpanElement[];
      // 先量好所有胶囊的排版位置，再统一改绝对定位——
      // 边量边改会让后续胶囊因前面的脱离文档流而重排，全部叠进角落。
      const boxes = els.map((el) => ({
        w: el.offsetWidth,
        h: el.offsetHeight,
        l0: el.offsetLeft,
        t0: el.offsetTop,
      }));
      lives = els.map((el, i) => {
        const { w, h, l0, t0 } = boxes[i];
        el.style.position = "absolute";
        el.style.left = `${l0}px`;
        el.style.top = `${t0}px`;
        el.style.margin = "0";

        const body = world!.createRigidBody(
          R!.RigidBodyDesc.dynamic()
            .setTranslation(l0 + w / 2, t0 + h / 2)
            .setLinvel((Math.random() - 0.5) * 240, -(60 + Math.random() * 160))
            .setAngvel((Math.random() - 0.5) * 3)
            .setLinearDamping(0.2)
            .setAngularDamping(0.8)
        );
        world!.createCollider(
          R!.ColliderDesc.cuboid(w / 2, h / 2)
            .setRestitution(0.28)
            .setFriction(0.8),
          body
        );

        el.addEventListener("pointerdown", (ev) => {
          ev.preventDefault();
          el.setPointerCapture(ev.pointerId);
          const t = body.translation();
          const p = arenaPoint(ev);
          drag.body = body;
          drag.el = el;
          drag.ox = t.x - p.x;
          drag.oy = t.y - p.y;
          drag.samples = [{ x: p.x, y: p.y, t: performance.now() }];
          el.style.zIndex = "10";
          body.setBodyType(R!.RigidBodyType.KinematicPositionBased, true);
        });

        return { el, w, h, l0, t0, body };
      });

      const tick = () => {
        if (!world) return;
        world.step();
        for (const p of lives) {
          const t = p.body.translation();
          const r = p.body.rotation();
          p.el.style.transform = `translate(${t.x - (p.l0 + p.w / 2)}px, ${
            t.y - (p.t0 + p.h / 2)
          }px) rotate(${r}rad)`;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      setReady(true);
    };

    init();

    // 容器变宽：只挪墙、把飞出去的胶囊夹回来，不打断正在玩的局面
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const arena = arenaRef.current;
        if (!arena || !world) return;
        const W = arena.clientWidth;
        placeWalls(W, arena.clientHeight);
        for (const p of lives) {
          const t = p.body.translation();
          if (t.x < 20 || t.x > W - 20) {
            p.body.setTranslation(
              { x: Math.min(Math.max(t.x, 40), W - 40), y: t.y },
              true
            );
          }
        }
      }, 150);
    });
    if (arenaRef.current) ro.observe(arenaRef.current);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      world?.free();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
          {skillsTitle} · {toolsTitle}
        </h2>
        <span className="shrink-0 font-mono text-xs text-muted/70">
          {hint}
        </span>
      </div>

      {/* 解说栏：指向 / 点住一颗，显示它意味着什么 */}
      <div className="mt-4 flex min-h-[64px] items-center rounded-xl border border-line bg-white px-4 py-2.5">
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div
              key={active.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  active.kind === "tool"
                    ? "border-accent text-accent"
                    : "border-line text-fg"
                }`}
              >
                {active.label}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {active.kind === "tool"
                  ? `${toolsTitle} · ${active.group}`
                  : skillsTitle}
              </span>
              <span className="text-sm leading-relaxed text-muted">
                {active.desc}
              </span>
            </motion.div>
          ) : (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted/60"
            >
              {empty}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div
        ref={arenaRef}
        className="relative mt-4 flex h-[240px] touch-none flex-wrap content-start items-start gap-3 overflow-hidden rounded-2xl border border-line bg-bg-gray p-4 select-none sm:h-[280px]"
      >
        {pills.map((p, i) => (
          <span
            key={`${p.kind}-${p.label}`}
            ref={(el) => {
              pillRefs.current[i] = el;
            }}
            onPointerEnter={() => setActive(p)}
            style={{ willChange: "transform" }}
            className={`cursor-grab rounded-full border bg-white px-5 py-2 text-base active:cursor-grabbing ${
              p.kind === "tool"
                ? "border-accent text-accent"
                : "border-line text-fg"
            }`}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
