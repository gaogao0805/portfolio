"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createBadgeTexture } from "./createBadgeTexture";
import { site } from "@/content/site";

// 3D 工牌只在客户端、且被打开时才加载
const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => null,
});

type LanyardCtx = {
  open: boolean;
  toggle: () => void;
  show: () => void;
  hide: () => void;
};

const Ctx = createContext<LanyardCtx>({
  open: false,
  toggle: () => {},
  show: () => {},
  hide: () => {},
});

export const useLanyard = () => useContext(Ctx);

export function LanyardProvider({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState<string | null>(null);
  const pathname = usePathname();

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  // 切换页面时自动收起工牌（首次挂载不触发）
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setOpen(false);
  }, [pathname]);

  // Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 只有在打开时才生成工牌正面（之前是进页面就预生成，会有残留）
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const make = (avatar: HTMLImageElement | null) => {
      if (!cancelled)
        setFront(
          createBadgeTexture({
            name: site.name,
            role,
            email: site.email,
            phone: site.showPhone ? site.phone : undefined,
            avatar,
          })
        );
    };
    if (site.avatar) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => make(img);
      img.onerror = () => make(null);
      img.src = site.avatar;
    } else {
      make(null);
    }
    return () => {
      cancelled = true;
    };
  }, [open, role]);

  return (
    <Ctx.Provider value={{ open, toggle, show, hide }}>
      {children}
      {open && front ? (
        <div className="pointer-events-none fixed inset-0 z-30">
          <Lanyard
            overlay
            position={[0, 0, 16]}
            gravity={[0, -40, 0]}
            frontImage={front}
            email={site.email}
            phone={site.showPhone ? site.phone : undefined}
          />
        </div>
      ) : null}
    </Ctx.Provider>
  );
}
