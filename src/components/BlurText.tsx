// @ts-nocheck
"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom = undefined,
  animationTo = undefined,
  easing = (t) => t,
  onAnimationComplete = undefined,
  stepDuration = 0.35,
  // 强调片段：text 中首个 emText 子串用 emClassName 高亮（按字符下标匹配，逐词/逐字都安全）
  emText = "",
  emClassName = "serif-em",
  // 逐字模式下，在该字符下标之后插入一个「仅移动端生效」的整行占位，
  // 利用 flex-wrap 把标题在移动端折成两行（桌面端 display:none，保持单行）；-1 = 不折行
  mobileBreakAfter = -1,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const emStart = emText ? text.indexOf(emText) : -1;
  const emEnd = emStart >= 0 ? emStart + emText.length : -1;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap" }}>
      {(() => {
        let charOffset = 0;
        return elements.map((segment, index) => {
          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

          const spanTransition = {
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
          };
          spanTransition.ease = easing;

          // 该片段是否落在 emText 区间内
          const segStart = charOffset;
          charOffset += segment.length + (animateBy === "words" ? 1 : 0);
          const isEm =
            emStart >= 0 &&
            segStart < emEnd &&
            segStart + segment.length > emStart;

          const content = segment === " " ? " " : segment;

          const span = (
            <motion.span
              className="inline-block will-change-[transform,filter,opacity]"
              key={index}
              initial={fromSnapshot}
              animate={inView ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={
                index === elements.length - 1 ? onAnimationComplete : undefined
              }
            >
              {isEm ? <span className={emClassName}>{content}</span> : content}
              {animateBy === "words" && index < elements.length - 1 && " "}
            </motion.span>
          );
          // 指定下标后追加移动端整行占位（flex-basis:100% 强制折行）
          return index === mobileBreakAfter
            ? [span, <span key="br" aria-hidden className="hidden basis-full max-sm:block" />]
            : span;
        });
      })()}
    </p>
  );
};

export default BlurText;
