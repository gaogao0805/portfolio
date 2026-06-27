"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const rows = [
  { top: "5%", duration: 22, delay: 0 },
  { top: "25%", duration: 18, delay: -4 },
  { top: "45%", duration: 25, delay: -8 },
  { top: "65%", duration: 20, delay: -2 },
  { top: "82%", duration: 23, delay: -6 },
];

const ease = [0.22, 1, 0.36, 1] as const;

function ChatBubble({
  children,
  delay = 0,
  side,
}: {
  children: React.ReactNode;
  delay?: number;
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px 0px", amount: 0.3 });
  const fromX = side === "left" ? -40 : 40;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromX, y: 10 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: fromX, y: 10 }}
      transition={{ duration: 0.5, delay: inView ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

export function NewsDanmaku({
  images,
  quote,
  question,
  answer,
}: {
  images: string[];
  quote: string;
  question: string;
  answer: string;
}) {
  return (
    <div data-nav-theme="dark" className="bg-[#0a0a10]">
      <style>{`
        @keyframes danmaku {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* 弹幕区 */}
      <div className="relative overflow-hidden" style={{ height: "55vh", minHeight: 320 }}>
        {images.map((src, i) => {
          const row = rows[i % rows.length];
          return (
            <div
              key={i}
              className="absolute whitespace-nowrap"
              style={{
                top: row.top,
                animation: `danmaku ${row.duration}s linear infinite`,
                animationDelay: `${row.delay}s`,
                opacity: 0.35,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-auto max-h-16 rounded-md border border-white/10 sm:max-h-20"
                draggable={false}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 px-6">
          <p className="max-w-2xl text-center text-lg leading-relaxed text-white/90 sm:text-2xl md:text-3xl">
            {quote}
          </p>
        </div>
      </div>

      {/* 对话式故事线 */}
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-6">
          {/* 左：问题（默认头像） */}
          <ChatBubble side="left" delay={0.1}>
            <div className="flex items-end gap-3 pr-12 sm:pr-24">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-white/8 px-5 py-4">
                <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                  {question}
                </p>
              </div>
            </div>
          </ChatBubble>

          {/* 右：回答（用户头像） */}
          <ChatBubble side="right" delay={0.4}>
            <div className="flex items-end gap-3 pl-12 sm:pl-24">
              <div className="order-2 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.jpg"
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              </div>
              <div className="order-1 rounded-2xl rounded-br-sm bg-accent/15 px-5 py-4">
                <p className="text-base leading-relaxed text-white/80 sm:text-lg">
                  {answer}
                </p>
              </div>
            </div>
          </ChatBubble>
        </div>
      </div>
    </div>
  );
}
