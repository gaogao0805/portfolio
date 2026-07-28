import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { FooterMarquee } from "@/components/FooterMarquee";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = "2026";
  return (
    <footer data-nav-theme="light" className="relative z-10 mt-auto">
      {/* Slogan 跑马灯（浅灰底、空心字、hover 实心） */}
      <FooterMarquee
        texts={[
          dict.footer.tagline,
          locale === "zh"
            ? "Designing solutions to real problems."
            : "用设计解决真实问题。",
        ]}
      />

      {/* 底部版权区域（浅灰） */}
      <div className="theme-light bg-bg-gray">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {site.email}
            </a>
            {site.socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-1 text-xs text-muted sm:items-end">
            {/* 签名 logo 落款（浅灰底上用黑色原版） */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt={site.name} className="mb-1.5 h-8 w-auto opacity-75" />
            <Link href={`/${locale}/contact`} className="hover:text-fg">
              {dict.nav.contact}
            </Link>
            <span>{dict.footer.built}</span>
            <span>
              © {year} {site.name}. {dict.footer.rights}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
