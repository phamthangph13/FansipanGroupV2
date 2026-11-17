"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HeroFrame = { src: string; alt: string };

export function HeroCrossfade({ frames }: { frames: HeroFrame[] }) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setReady(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || frames.length < 2) return;

    const start = () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(() => {
        if (document.hidden) return;
        setActive((current) => (current + 1) % frames.length);
      }, 5600);
    };

    start();
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer.current) clearInterval(timer.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [frames.length]);

  return (
    <>
      {frames.map((frame, index) => (
        <div
          key={frame.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1600ms] ease-out",
            ready && index === active ? "opacity-100" : "opacity-0",
            index === 0 && !ready && "opacity-100",
          )}
          aria-hidden={ready && index !== active}
        >
          <Image
            src={frame.src}
            alt={frame.alt}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
    </>
  );
}
