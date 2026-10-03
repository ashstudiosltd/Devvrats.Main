"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  src?: string; // file inside /public
  alt?: string;
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function ScrollImageSection({
  src = "/imagesection.jpg",
  alt = "Section image",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Image's own aspect ratio (width / height). Updated once the image loads.
  const [ratio, setRatio] = useState(3 / 2);

  // If the image was already loaded before hydration, onLoad may be missed
  useEffect(() => {
    const img = layerRef.current?.querySelector("img");
    if (img && img.complete && img.naturalWidth) {
      setRatio(img.naturalWidth / img.naturalHeight);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    const zoom = zoomRef.current;
    if (!section || !layer || !zoom) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

    let target = 0; // from scroll (0 → 1)
    let current = 0; // smoothed value that is drawn
    let raf = 0;
    let last = 0;
    let revealed = false;

    const readScroll = () => {
      const vh = window.innerHeight;
      // offsetTop/offsetHeight ignore transforms, so the animation can't feed back into itself
      const layerTop = section.getBoundingClientRect().top + layer.offsetTop;
      const h = layer.offsetHeight;

      // Starts the moment the image's top edge enters the screen…
      const startY = vh;
      // …and is fully revealed as it settles in the centre (or at the top if taller than the screen)
      const endY = Math.max(0, (vh - h) / 2) + vh * 0.05;

      target = reduceMQ.matches ? 1 : clamp((startY - layerTop) / (startY - endY));
    };

    const draw = () => {
      const p = easeInOutCubic(current);

      // Opens from the centre outwards until the full image is visible
      const insetX = lerp(22, 0, p);
      const insetY = lerp(28, 0, p);
      const radius = lerp(36, 20, p);

      layer.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
      layer.style.transform = `translate3d(0, ${lerp(3, 0, p)}vh, 0)`;
      zoom.style.transform = `scale(${lerp(1.1, 1, p)})`;

      if (!revealed) {
        layer.style.opacity = "1";
        revealed = true;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - (last || now), 50);
      last = now;
      const k = 1 - Math.exp(-dt / 110); // frame-rate independent smoothing
      current += (target - current) * k;

      if (Math.abs(target - current) < 0.0005) {
        current = target;
        draw();
        raf = 0;
        last = 0;
        return;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      readScroll();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const snap = () => {
      readScroll();
      current = target;
      draw();
    };

    snap();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", snap);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", snap);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ratio]);

  return (
    // No fixed height: the section is exactly the image + the gap (p-2 = 0.5rem all round),
    // so the next section comes in as early as possible.
    <section ref={sectionRef} className="relative bg-black p-2 dark:bg-neutral-950">
      {/* Border to border: full width minus the gap, at the image's real ratio */}
      <div
        ref={layerRef}
        className="relative w-full opacity-0 will-change-transform"
        style={{ aspectRatio: ratio }}
      >
        <div ref={zoomRef} className="absolute inset-0 will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            draggable={false}
            className="select-none object-cover"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth) setRatio(img.naturalWidth / img.naturalHeight);
            }}
          />
        </div>
      </div>
    </section>
  );
}