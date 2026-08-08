"use client";

import type { Locale } from "@/i18n/config";
import { HorizontalGallery } from "@/components/work/HorizontalGallery";

/**
 * 作品区：横向对焦卡片流（中轴线定焦点，滚动驱动横移 + 吸附）。
 */
export function WorkPosters({
  locale,
  title,
  titleEm,
  cta,
  hint: _hint,
}: {
  locale: Locale;
  title: string;
  titleEm?: string;
  cta: string;
  hint: string;
}) {
  return (
    <div className="relative">
      <HorizontalGallery
        locale={locale}
        cta={cta}
        title={title}
        titleEm={titleEm}
      />
    </div>
  );
}
