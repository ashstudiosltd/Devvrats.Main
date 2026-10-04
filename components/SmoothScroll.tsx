"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NORMAL = {
  wheelMultiplier: 1,
  lerp: 0.1,
};

const SLOW = {
  wheelMultiplier: 0.4,
  lerp: 0.05,
};

export default function SmoothScroll({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({ ...NORMAL });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const speed = { ...NORMAL };

    const setSpeed = (to: typeof NORMAL) =>
      gsap.to(speed, {
        ...to,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => Object.assign(lenis.options, speed),
      });

    const active = new Set<Element>();

    const triggers = gsap
      .utils
      .toArray<HTMLElement>("[data-slow]")
      .map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: el.dataset.slowStart ?? "top 80%",
          end: el.dataset.slowEnd ?? "bottom 20%",
          onToggle: ({ isActive }) => {
            if (isActive) {
              active.add(el);
            } else {
              active.delete(el);
            }

            setSpeed(active.size > 0 ? SLOW : NORMAL);
          },
        })
      );

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      triggers.forEach((trigger) => trigger.kill());
      gsap.killTweensOf(speed);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}