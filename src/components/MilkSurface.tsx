"use client";

import { useEffect, useRef } from "react";

/**
 * A pool of milk you can touch. A small height-field ripple simulation on a canvas:
 * pointer / finger movement disturbs the surface, and a drop falls now and then.
 * Rendered at low resolution and upscaled, so it stays cheap on phones.
 */
export default function MilkSurface({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SCALE = 6; // px per cell
    let W = 0, H = 0;
    let a = new Float32Array(0), b = new Float32Array(0);
    let img: ImageData;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(8, Math.ceil(r.width / SCALE));
      H = Math.max(8, Math.ceil(r.height / SCALE));
      canvas.width = W;
      canvas.height = H;
      a = new Float32Array(W * H);
      b = new Float32Array(W * H);
      img = ctx.createImageData(W, H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const disturb = (cx: number, cy: number, strength: number, radius = 2) => {
      const x0 = Math.round(cx), y0 = Math.round(cy);
      for (let y = -radius; y <= radius; y++)
        for (let x = -radius; x <= radius; x++) {
          const xx = x0 + x, yy = y0 + y;
          if (xx > 1 && yy > 1 && xx < W - 1 && yy < H - 1 && x * x + y * y <= radius * radius) a[yy * W + xx] += strength;
        }
    };

    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * W;
      const y = ((e.clientY - r.top) / r.height) * H;
      if (last) {
        const steps = Math.ceil(Math.hypot(x - last.x, y - last.y));
        for (let i = 0; i < steps; i++) disturb(last.x + ((x - last.x) * i) / steps, last.y + ((y - last.y) * i) / steps, 70, 1);
      }
      last = { x, y };
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      disturb(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H, 520, 3);
    };
    const onLeave = () => (last = null);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);

    // milk colours: deep shadow -> cream -> highlight
    const shade = (v: number) => {
      const t = Math.max(-1, Math.min(1, v / 60));
      if (t >= 0) return [255 - 4 * (1 - t), 252 - 2 * (1 - t) + 3 * t, 244 + 9 * t];
      const k = -t;
      return [255 - 40 * k, 250 - 46 * k, 238 - 58 * k];
    };

    let raf = 0, visible = true, frame = 0;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const step = () => {
      raf = requestAnimationFrame(step);
      if (!visible) return;
      frame++;
      if (!reduce && frame % 110 === 0) disturb(2 + Math.random() * (W - 4), 2 + Math.random() * (H - 4), 380, 1);
      // wave propagation
      for (let y = 1; y < H - 1; y++)
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          b[i] = ((a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) / 2 - b[i]) * 0.965;
        }
      [a, b] = [b, a];
      // shade by slope (light from top-left)
      const d = img.data;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const sl = (a[i] - (a[i + W + 1] ?? 0)) * 1.6;
          const [r, g, bl] = shade(sl);
          const o = i * 4;
          d[o] = r; d[o + 1] = g; d[o + 2] = bl; d[o + 3] = 255;
        }
      ctx.putImageData(img, 0, 0);
    };
    if (reduce) {
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(0, 0, W, H);
    } else step();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={`h-full w-full touch-pan-y [image-rendering:auto] ${className}`} aria-hidden />;
}
