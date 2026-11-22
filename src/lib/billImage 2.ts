"use client";

import type { Line } from "@/lib/cart";
import { inr } from "@/lib/money";

/**
 * Draws the order as a handwritten ledger page (1080×1350, Instagram/WhatsApp friendly)
 * and returns it as a PNG blob. Uses the site's own fonts.
 */
export async function drawBill(o: {
  items: Line[];
  total: number;
  free: boolean;
  storeName: string;
  lang: "en" | "gu";
}): Promise<Blob> {
  const W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const hand = css.getPropertyValue("--font-caveat").trim() || "cursive";
  const mono = css.getPropertyValue("--font-plex-mono").trim() || "monospace";
  const serif = css.getPropertyValue("--font-fraunces").trim() || "serif";
  const gu = css.getPropertyValue("--font-anek-gu").trim() || "sans-serif";
  await document.fonts?.ready;

  // paper + rules + margin
  g.fillStyle = "#fbf3df";
  g.fillRect(0, 0, W, H);
  g.strokeStyle = "#a9bfdc";
  g.lineWidth = 2;
  for (let y = 300; y < H - 60; y += 62) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke();
  }
  g.strokeStyle = "rgba(200,55,45,.75)";
  [150, 158].forEach((x) => {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, H);
    g.stroke();
  });

  // red cloth header
  g.fillStyle = "#9e1b17";
  g.fillRect(0, 0, W, 190);
  g.fillStyle = "#e3a21a";
  for (let x = 0; x < W; x += 26) g.fillRect(x, 178, 14, 4);
  g.fillStyle = "#fffcf4";
  g.font = `600 64px ${serif}`;
  g.fillText("Karnavati Dairy", 60, 100);
  g.font = `400 34px ${gu}`;
  g.fillStyle = "#e3a21a";
  g.fillText(o.lang === "gu" ? "મારો હિસાબ · કર્ણાવતી ડેરી" : "My hisaab · કર્ણાવતી ડેરી", 60, 150);

  // date + shop
  const d = new Date();
  g.fillStyle = "#4a4f63";
  g.font = `400 30px ${mono}`;
  g.fillText(d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), 180, 260);
  g.textAlign = "right";
  g.fillText(o.storeName, W - 60, 260);
  g.textAlign = "left";

  // lines, handwritten
  let y = 352;
  const maxLines = 12;
  o.items.slice(0, maxLines).forEach((it, i) => {
    g.fillStyle = "#1c2236";
    const name = o.lang === "gu" ? `${it.sku.nameGu} (${it.sku.packGu})` : `${it.sku.name} (${it.sku.pack})`;
    g.font = o.lang === "gu" ? `500 36px ${gu}` : `500 46px ${hand}`;
    g.fillText(fit(g, `${i + 1}. ${name}`, 620), 180, y);
    g.font = `400 40px ${hand}`;
    g.fillStyle = "#4a4f63";
    g.fillText(`× ${it.qty}`, 820, y);
    g.textAlign = "right";
    g.fillStyle = "#1c2236";
    g.font = `600 34px ${mono}`;
    g.fillText(inr(it.total), W - 60, y);
    g.textAlign = "left";
    y += 62;
  });
  if (o.items.length > maxLines) {
    g.font = `400 40px ${hand}`;
    g.fillStyle = "#4a4f63";
    g.fillText(o.lang === "gu" ? `…અને ${o.items.length - maxLines} વધુ` : `…and ${o.items.length - maxLines} more`, 180, y);
    y += 62;
  }

  // total, double-underlined like a ledger
  y += 20;
  g.strokeStyle = "#1c2236";
  g.lineWidth = 3;
  [0, 10].forEach((o2) => {
    g.beginPath();
    g.moveTo(640, y - 46 + o2);
    g.lineTo(W - 60, y - 46 + o2);
    g.stroke();
  });
  g.font = o.lang === "gu" ? `600 40px ${gu}` : `600 52px ${hand}`;
  g.fillText(o.lang === "gu" ? "કુલ" : "Total", 180, y + 10);
  g.textAlign = "right";
  g.font = `600 58px ${mono}`;
  g.fillStyle = "#9e1b17";
  g.fillText(inr(o.total), W - 60, y + 14);
  g.textAlign = "left";

  // rubber stamp
  if (o.free) {
    g.save();
    g.translate(760, Math.min(y + 170, H - 170));
    g.rotate(-0.14);
    g.strokeStyle = "#2f6b3a";
    g.fillStyle = "#2f6b3a";
    g.lineWidth = 6;
    g.strokeRect(-210, -62, 420, 124);
    g.lineWidth = 2;
    g.strokeRect(-198, -50, 396, 100);
    g.font = `700 44px ${mono}`;
    g.textAlign = "center";
    g.fillText(o.lang === "gu" ? "" : "FREE DELIVERY", 0, 16);
    if (o.lang === "gu") {
      g.font = `700 52px ${gu}`;
      g.fillText("મફત ડિલિવરી", 0, 18);
    }
    g.restore();
  }

  // footer
  g.fillStyle = "#9e1b17";
  g.font = `400 34px ${hand}`;
  g.fillText(o.lang === "gu" ? "તાજું, શહેર જાગે એ પહેલાં." : "Fresh before the city wakes.", 180, H - 70);

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
}

function fit(g: CanvasRenderingContext2D, text: string, max: number) {
  if (g.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 4 && g.measureText(t + "…").width > max) t = t.slice(0, -1);
  return t + "…";
}

/** Share the picture (phones) or download it (desktop). */
export async function shareOrSave(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "My Karnavati hisaab" });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "saved";
}
