import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { CopyButton } from "@/components/CopyButton";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const c = dict.contact;

  return (
    <div data-nav-theme="light" className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <p className="kicker">{c.kicker}</p>
        <h1 className="display mt-4 text-6xl sm:text-8xl">{c.title}</h1>
        <p className="mt-6 max-w-xl text-xl text-muted">{c.lead}</p>
      </Reveal>

      {/* 直达联系方式 */}
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {/* 邮箱 */}
        <div className="flex flex-col justify-between gap-6 bg-bg p-8">
          <p className="font-sans text-xs uppercase tracking-wider text-muted">
            {c.emailTitle}
          </p>
          <div>
            <a
              href={`mailto:${site.email}`}
              className="display block text-2xl break-all transition-colors hover:text-accent"
            >
              {site.email}
            </a>
            <div className="mt-4">
              <CopyButton value={site.email} copy={c.copy} copied={c.copied} />
            </div>
          </div>
        </div>

        {/* 手机（可在 site.ts 关闭） */}
        {site.showPhone ? (
          <div className="flex flex-col justify-between gap-6 bg-bg p-8">
            <p className="font-sans text-xs uppercase tracking-wider text-muted">
              {c.callTitle}
            </p>
            <div>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="display block text-2xl transition-colors hover:text-accent"
              >
                {site.phone}
              </a>
              <div className="mt-4">
                <CopyButton
                  value={site.phone}
                  copy={c.copy}
                  copied={c.copied}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 社交 */}
      <Reveal>
        <section className="mt-16">
          <h2 className="font-sans text-xs uppercase tracking-wider text-muted">
            {c.socialTitle}
          </h2>
          <div className="mt-6 flex flex-col divide-y divide-line border-y border-line">
            {site.socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-5 transition-colors hover:text-accent"
              >
                <span className="display text-3xl">{s.label}</span>
                <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
