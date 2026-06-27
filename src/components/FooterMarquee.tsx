"use client";

import { useState } from "react";

export function FooterMarquee({ texts }: { texts: string[] }) {
  const [hovered, setHovered] = useState(false);

  const joined = texts.join("  ·  ");
  const segment = `${joined}  ·  `;

  const textStyle: React.CSSProperties = {
    WebkitTextStroke: hovered ? "0px" : "2px var(--color-fg)",
    color: hovered ? "var(--color-fg)" : "#f5f5f5",
    paintOrder: "stroke fill",
    transition: "color 0.3s ease, -webkit-text-stroke 0.3s ease",
    paddingRight: "0.5em",
  };

  return (
    <div
      className="theme-light overflow-hidden bg-bg-gray py-10 sm:py-14"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        @keyframes footer-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: "footer-marquee 18s linear infinite",
          animationPlayState: hovered ? "paused" : "running",
        }}
      >
        <span className="display inline-block text-5xl sm:text-7xl lg:text-8xl" style={{...textStyle, fontFamily: '"Space Grotesk", ui-sans-serif, system-ui, "PingFang SC", sans-serif'}}>
          {segment}{segment}
        </span>
        <span className="display inline-block text-5xl sm:text-7xl lg:text-8xl" style={{...textStyle, fontFamily: '"Space Grotesk", ui-sans-serif, system-ui, "PingFang SC", sans-serif'}} aria-hidden>
          {segment}{segment}
        </span>
      </div>
    </div>
  );
}
