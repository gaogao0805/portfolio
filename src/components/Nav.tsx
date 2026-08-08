"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { otherLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { useLanyard } from "@/components/lanyard/LanyardProvider";

/**
 * 顶部 header —— 非常驻、无分割线，与页面融为一体（随滚动离场）。
 * 只留：logo、简历、联系（唤出工牌）、中英切换；
 * 主导航已移至底部悬浮 Dock（components/Dock.tsx）。
 */
export function Nav({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const { toggle, warm } = useLanyard();

  // 语言切换
  const other = otherLocale(locale);
  const swapped = pathname.replace(/^\/(zh|en)/, `/${other}`);
  const toggleHref = swapped.startsWith(`/${other}`) ? swapped : `/${other}`;

  // 简历页的右上按钮换成「首页」（回首页顶部）；其他页面点「简历」落在关于页顶部（不再跳到中段锚点）
  const onAbout = pathname.replace(/^\/(zh|en)/, "").startsWith("/about");

  return (
    <header className="relative z-40">
      <nav className="mx-auto flex items-center justify-between px-5 py-4 sm:px-10">
        <Link
          href={`/${locale}#top`}
          className="flex items-center gap-2"
          aria-label={site.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="h-7 w-auto" />
          <span className="serif-brand text-[1.65rem] leading-none tracking-tight">
            {site.name}
            <span className="text-accent">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href={onAbout ? `/${locale}` : `/${locale}/about`}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {onAbout ? nav.home : nav.resume}
          </Link>
          {/* 「联系」：唤出 3D 工牌（移动端隐藏——左下 N 浮钮同能唤出） */}
          <button
            type="button"
            onClick={toggle}
            onPointerEnter={warm}
            onFocus={warm}
            className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            {nav.contact}
          </button>
          <Link
            href={toggleHref}
            className="rounded-full border border-line px-3 py-1.5 font-sans text-xs text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {nav.langLabel}
          </Link>
        </div>
      </nav>
    </header>
  );
}
