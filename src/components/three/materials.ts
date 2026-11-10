import { CanvasTexture, RepeatWrapping } from "three";

// Small deterministic procedural maps: no network textures or expensive shader passes.
export function textileTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#a4a4a4";
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 8)
    for (let x = 0; x < 256; x += 6) {
      ctx.strokeStyle = (x + y) % 3 ? "#ccc" : "#eee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 3, y + 5);
      ctx.lineTo(x + 6, y);
      ctx.stroke();
    }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.2, 1.2);
  return texture;
}
