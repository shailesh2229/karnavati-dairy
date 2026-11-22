"use client";

import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";
import T from "@/components/T";

type Tilt = { x: number; y: number }; // -1..1, which way the phone leans

/**
 * A pool of milk you can touch — and, on phones, tilt.
 * Height-field ripple simulation on a low-res canvas, upscaled (cheap on phones).
 * Tilting pushes waves toward the low side and slides the light across the surface.
 */
export default function MilkSurface({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tilt = useRef<Tilt>({ x: 0, y: 0 });
  const [tiltState, setTiltState] = useState<"unavailable" | "idle" | "on" | "denied">("unavailable");
  const [lean, setLean] = useState<Tilt>({ x: 0, y: 0 });

  // offer tilt only on touch devices that have motion sensors
  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check after mount
    if (touch && "DeviceOrientationEvent" in window) setTiltState("idle");
  }, []);

  useEffect(() => {
    if (tiltState !== "on") return;
    let last = 0;
    const onOrient = (e: DeviceOrientationEvent) => {
      const gx = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 35));
      const gy = Math.max(-1, Math.min(1, ((e.beta ?? 45) - 45) / 35)); // ~45° is how people hold a phone
      tilt.current = { x: gx, y: gy };
      const now = performance.now();
      if (now - last > 60) {
        last = now;
        setLean({ x: gx, y: gy });
      }
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [tiltState]);

  const enableTilt = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<"granted" | "denied"> };
    try {
      if (typeof DOE.requestPermission === "function") {
        const r = await DOE.requestPermission();
        if (r !== "granted") return setTiltState("denied");
      }
      setTiltState("on");
      play("slosh");
    } catch {
      setTiltState("denied");
    }
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SCALE = 6;
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

      // tilt: milk piles up against the low wall, sending waves back across
      const { x: tx, y: ty } = tilt.current;
      const mag = Math.hypot(tx, ty);
      if (mag > 0.08 && frame % 3 === 0) {
        const n = 6;
        for (let k = 0; k < n; k++) {
          const along = 2 + Math.random() * ((Math.abs(tx) > Math.abs(ty) ? H : W) - 4);
          if (Math.abs(tx) > Math.abs(ty)) disturb(tx > 0 ? W - 3 : 2, along, 120 * mag, 1);
          else disturb(along, ty > 0 ? H - 3 : 2, 120 * mag, 1);
        }
      }

      for (let y = 1; y < H - 1; y++)
        for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          b[i] = ((a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) / 2 - b[i]) * 0.965;
        }
      [a, b] = [b, a];
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

  return (
    <div className={className}>
      <canvas ref={ref} className="h-full w-full touch-pan-y" aria-hidden />
      {/* the light on the milk slides toward the low side as you tilt */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-[background-position] duration-300"
        style={{
          backgroundImage: "radial-gradient(40% 30% at 50% 50%, rgb(255 255 255 / 0.55), transparent 70%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "160% 160%",
          backgroundPosition: `${50 + lean.x * 40}% ${50 + lean.y * 40}%`,
          opacity: tiltState === "on" ? 1 : 0,
        }}
      />
      {tiltState !== "unavailable" && (
        <button
          type="button"
          onClick={tiltState === "on" ? () => setTiltState("idle") : enableTilt}
          className="absolute right-4 top-1/3 z-10 flex items-center gap-2 rounded-full border-2 border-ink bg-milk/85 px-3.5 py-2 text-sm font-semibold text-ink shadow-[0_3px_0_var(--color-ink)] backdrop-blur active:translate-y-0.5 active:shadow-none"
        >
          <span aria-hidden className={tiltState === "on" ? "inline-block animate-[wiggle_1.2s_ease-in-out_infinite]" : ""}>
            📱
          </span>
          {tiltState === "on" ? (
            <T en="Tilting · stop" gu="નમાવો છો · બંધ" />
          ) : tiltState === "denied" ? (
            <T en="Motion is off" gu="મોશન બંધ છે" />
          ) : (
            <T en="Tilt to pour" gu="નમાવીને રેડો" />
          )}
        </button>
      )}
    </div>
  );
}
