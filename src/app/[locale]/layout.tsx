import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LanyardProvider } from "@/components/lanyard/LanyardProvider";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 静态导出：只生成 zh / en，其它语言段返回 404
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const role = locale === "zh" ? "AI 产品设计师" : "AI Product Designer";

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      className="h-full"
    >
      <body className="noise flex min-h-full flex-col">
        <LanyardProvider role={role}>
          {/* HIDE_NAV_ICONS=1 构建时隐藏桌面导航所有图标（部署仓库用） */}
          <Nav
            locale={locale}
            nav={dict.nav}
            hideIcons={process.env.HIDE_NAV_ICONS === "1"}
          />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
        </LanyardProvider>
      </body>
    </html>
  );
}
