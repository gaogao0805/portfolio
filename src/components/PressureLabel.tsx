"use client";

import TextPressure from "./TextPressure";

/**
 * 小标题版 TextPressure（青色品牌色、可变字体挤压效果）。
 * 仅支持拉丁字母 —— Compressa 可变字体没有中文。
 *
 * 关键：给容器一个与字号匹配的宽度，让 TextPressure 自动算出的字号正好等于 size，
 * 这样它就表现得像一个固定大小的小标签，而不是铺满整行的大字。
 */
export function PressureLabel({
  text,
  size = 20,
  color = "var(--color-accent)",
  className = "",
}: {
  text: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const width = Math.max(Math.round(text.length * (size / 2)), size * 2);
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width,
        height: Math.round(size * 1.5),
        verticalAlign: "middle",
      }}
    >
      <TextPressure
        text={text}
        flex={false}
        italic={false}
        weight
        width={false}
        alpha={false}
        stroke={false}
        textColor={color}
        minFontSize={size}
        minWeight={520}
      />
    </span>
  );
}
