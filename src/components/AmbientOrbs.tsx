/**
 * 环境漂移光斑（Sora 式氛围背景层）：浅色 section 用。
 * 纯 CSS 动画、无 JS；父级需 relative + overflow-hidden，内容层需盖在 z-10。
 * 配色：品牌青 + 次强调紫 + 暖桃，全部低透明度，白底上呈粉彩感。
 */
export function AmbientOrbs() {
  return (
    <div aria-hidden className="ambient-orbs">
      <span
        style={{
          width: 480,
          height: 480,
          top: "-12%",
          left: "-8%",
          background: "rgba(13, 181, 162, 0.10)",
        }}
      />
      <span
        style={{
          width: 560,
          height: 560,
          top: "32%",
          right: "-14%",
          background: "rgba(109, 91, 255, 0.07)",
          animationDuration: "38s",
          animationDelay: "-12s",
        }}
      />
      <span
        style={{
          width: 420,
          height: 420,
          bottom: "-14%",
          left: "28%",
          background: "rgba(255, 196, 160, 0.22)",
          animationDuration: "26s",
          animationDelay: "-6s",
        }}
      />
    </div>
  );
}
