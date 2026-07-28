"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/i18n/config";
import { otherLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { GooeyNav } from "@/components/GooeyNav";
import { useLanyard } from "@/components/lanyard/LanyardProvider";

const norm = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);
type NavTheme = "light" | "dark";

export function Nav({
  locale,
  nav,
  hideIcons = false,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  // 构建开关（HIDE_NAV_ICONS=1）：桌面导航所有按钮只留文字不显示图标
  hideIcons?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { toggle, warm } = useLanyard();

  const path = norm(pathname);
  const isHome = path === norm(`/${locale}`);

  // 首页内的定位锚点（tab 就是首页板块的定位器）
  const sectionIds = ["top", "work", "about"];
  const links = [
    { href: `/${locale}#top`, label: nav.home, icon: "/icons/home.svg" },
    { href: `/${locale}#work`, label: nav.work, icon: "/icons/work.svg" },
    { href: `/${locale}#about`, label: nav.about, icon: "/icons/about.svg" },
  ];

  // 滚动监听：在首页时，根据当前可视板块高亮对应 tab
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

  // 非首页（作品详情 / 关于详情页）：根据路由高亮对应 tab
  const routeIndex = path.startsWith(norm(`/${locale}/work`))
    ? 1
    : path.startsWith(norm(`/${locale}/about`))
      ? 2
      : 0;
  const activeIndex = isHome ? section : routeIndex;

  // 导航栏主题跟随当前位于 header 下方的页面区块。
  const [navTheme, setNavTheme] = useState<NavTheme>(isHome ? "light" : "dark");
  useEffect(() => {
    const updateTheme = () => {
      const marker = Math.max(1, Math.min(window.innerHeight - 1, 72));
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-theme]")
      );
      let theme: NavTheme = isHome ? "light" : "dark";

      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) {
          theme = el.dataset.navTheme === "light" ? "light" : "dark";
        }
      }

      setNavTheme(theme);
    };

    let frame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateTheme);
    };

    updateTheme();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isHome, path]);
  const navLight = navTheme === "light";

  // 语言切换
  const other = otherLocale(locale);
  const swapped = pathname.replace(/^\/(zh|en)/, `/${other}`);
  const toggleHref = swapped.startsWith(`/${other}`) ? swapped : `/${other}`;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        navLight
          ? "theme-light border-b border-black/10 bg-white"
          : "border-b border-line bg-bg"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href={`/${locale}#top`}
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
          aria-label={site.name}
        >
          {/* 个人签名 logo：深底导航反白，浅底保持黑色；与字标并存 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            className={`h-7 w-auto transition-[filter] duration-300 ${navLight ? "" : "invert"}`}
          />
          <span className="serif-brand text-[1.65rem] leading-none tracking-tight">
            {site.name}
            <span className="text-accent">.</span>
          </span>
        </Link>

        {/* 桌面端 */}
        <div className="hidden items-center gap-5 md:flex">
          <GooeyNav
            items={links.map((l) => ({
              label: l.label,
              href: l.href,
              icon: hideIcons ? undefined : l.icon,
            }))}
            activeIndex={activeIndex}
          />
          {/* 「联系」普通功能键：唤出工牌 */}
          <button
            type="button"
            onClick={toggle}
            onPointerEnter={warm}
            onFocus={warm}
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            {hideIcons ? null : (
              <span
                className="nav-ico"
                style={{ ["--icon" as string]: "url(/icons/contact.svg)" } as React.CSSProperties}
                aria-hidden
              />
            )}
            {nav.contact}
          </button>
          <Link
            href={toggleHref}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {hideIcons ? null : (
              <span
                className="nav-ico"
                style={{ ["--icon" as string]: "url(/icons/translate.svg)" } as React.CSSProperties}
                aria-hidden
              />
            )}
            {nav.langLabel}
          </Link>
        </div>

        {/* 移动端按钮 */}
        <button
          className="flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-fg transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-fg transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-fg transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* 移动端抽屉 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 py-2 text-lg ${
                    isHome && section === i ? "text-accent" : "text-fg"
                  }`}
                >
                  <span
                    className="nav-ico"
                    style={
                      { ["--icon" as string]: `url(${l.icon})` } as React.CSSProperties
                    }
                    aria-hidden
                  />
                  {l.label}
                </Link>
              ))}
              {/* 联系：唤出工牌 */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  toggle();
                }}
                onPointerEnter={warm}
                onFocus={warm}
                className="flex items-center gap-3 py-2 text-left text-lg text-fg"
              >
                <span
                  className="nav-ico"
                  style={{ ["--icon" as string]: "url(/icons/contact.svg)" } as React.CSSProperties}
                  aria-hidden
                />
                {nav.contact}
              </button>
              <Link
                href={toggleHref}
                onClick={() => setOpen(false)}
                className="mt-2 flex w-fit items-center gap-2 rounded-full border border-line px-4 py-1.5 font-mono text-sm text-fg"
              >
                <span
                  className="nav-ico"
                  style={{ ["--icon" as string]: "url(/icons/translate.svg)" } as React.CSSProperties}
                  aria-hidden
                />
                {nav.langLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
