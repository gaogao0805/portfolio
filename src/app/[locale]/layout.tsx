import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Nav } from "@/components/Nav";
import { Dock } from "@/components/Dock";
import { Footer } from "@/components/Footer";
import { LanyardProvider } from "@/components/lanyard/LanyardProvider";
import { Intro } from "@/components/Intro";

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
      <body className="flex min-h-full flex-col">
        {/* 进站一律从顶部开始（带 # 锚点的链接除外）：
            关浏览器滚动恢复 + 前 2 秒每 100ms 强制回顶——部分手机浏览器
            不支持 scrollRestoration，或在 load 后很久才恢复上次位置 */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("scrollRestoration"in history)history.scrollRestoration="manual";if(!location.hash){var t=function(){scrollTo({top:0,left:0,behavior:"instant"})};t();addEventListener("DOMContentLoaded",t);addEventListener("load",t);var i=setInterval(t,100);setTimeout(function(){clearInterval(i)},2000)}`,
          }}
        />
        <LanyardProvider role={role}>
          <Intro />
          <Nav locale={locale} nav={dict.nav} />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
          {/* 底部悬浮 Dock：全站主导航（手机导航栏式） */}
          <Dock locale={locale} nav={dict.nav} />
        </LanyardProvider>
      </body>
    </html>
  );
}
