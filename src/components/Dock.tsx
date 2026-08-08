"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const norm = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);

/**
 * 底部悬浮 Dock —— 全站主导航（手机导航栏式），顶部 header 不再常驻。
 * 图标为 3D 黏土质感 PNG（public/icons/dock/），想换图直接替换同名文件。
 * 首页按可视板块（top/work/about）高亮，其它页按路由高亮；
 */
export function Dock({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const path = norm(pathname);
  const isHome = path === norm(`/${locale}`);

  // 首页内的板块跟随（与旧 Nav 同一套 IntersectionObserver 逻辑）
  const sectionIds = ["top", "work", "about"];
  const [section, setSection] = useState(0);
  useEffect(() => {
    if (!isHome) return;
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sectionIds.indexOf(e.target.id);
            if (idx >= 0) setSection(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, path, locale]);

  // 非首页：按路由高亮（作品详情→作品，关于→关于）
  const routeIndex = path.startsWith(norm(`/${locale}/work`))
    ? 1
    : path.startsWith(norm(`/${locale}/about`))
      ? 2
      : 0;
  const activeIndex = isHome ? section : routeIndex;

  const items = [
    { href: `/${locale}#top`, label: nav.home, icon: "/icons/dock/home.png" },
    { href: `/${locale}#work`, label: nav.work, icon: "/icons/dock/work.png" },
    { href: `/${locale}#about`, label: nav.about, icon: "/icons/dock/about.png" },
  ];

  return (
    <nav
      aria-label={locale === "zh" ? "主导航" : "Primary navigation"}
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      {/* iOS 液态玻璃：半透明渐变底 + 顶部高光内描边 + saturate 背景模糊 */}
      <div className="flex items-center gap-1.5 rounded-[26px] border border-white/60 bg-gradient-to-b from-white/60 to-white/25 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.05),0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150">
        {items.map((item, i) => {
          // 「简历」深链不高亮；其余按 activeIndex
          const active = i < 3 && i === activeIndex;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 sm:h-12 sm:w-12 ${
                active
                  ? "bg-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              {/* hover 上浮标签 */}
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-black px-2.5 py-1 text-[11px] whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt=""
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-115 sm:h-9 sm:w-9"
                draggable={false}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
