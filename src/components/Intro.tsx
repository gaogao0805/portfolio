"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const SEEN_KEY = "intro-seen-v1";

/**
 * 首次进场序列（每个会话一次，且只在首页）：黑场 → 签名 logo 从左到右
 * 扫入点亮 → 停顿 → 整体上滑退场。sessionStorage 记位，刷新不再播。
 * 挂载后才渲染（SSR 无感），播放期间锁滚动。
 */
export function Intro() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  // 只在首页播：从详情页/外链进来的用户不该被进场动画拦
  const isHome = /^\/(zh|en)\/?$/.test(pathname);

  useEffect(() => {
    if (!isHome || sessionStorage.getItem(SEEN_KEY)) return;
    setShow(true);
    document.body.style.overflow = "hidden";
    const done = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      setShow(false);
      document.body.style.overflow = "";
    }, 1900);
    return () => {
      clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, [isHome]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg"
          exit={{ y: "-100%", transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* 签名扫入：从左到右揭开（clip-path 扫场），随后微微发光 */}
          <motion.img
            src="/logo.svg"
            alt=""
            className="h-16 w-auto invert sm:h-24"
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
            // eslint-disable-next-line @next/next/no-img-element
          />
          <motion.div
            className="absolute inset-x-0 bottom-16 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
              Portfolio
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
