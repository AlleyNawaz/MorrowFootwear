import {
  BufferGeometry,
  Float32BufferAttribute,
  CatmullRomCurve3,
  Vector3,
  TubeGeometry,
} from "three";

// Longitudinal cross-sections form an original shoe last, independent of the renderer.
const sections = [
  [-1.95, 0.025, 0.11],
  [-1.78, 0.3, 0.3],
  [-1.45, 0.54, 0.4],
  [-1.05, 0.64, 0.44],
  [-0.55, 0.61, 0.59],
  [-0.12, 0.52, 0.86],
  [0.3, 0.46, 1.06],
  [0.66, 0.43, 1.1],
  [1.0, 0.45, 1.04],
  [1.33, 0.38, 0.91],
  [1.52, 0.1, 0.74],
  [1.55, 0.018, 0.6],
];
export function shoeGeometry(
  kind: "upper" | "sole" | "rubber" | "rim",
): BufferGeometry {
  const positions: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const count = 96;
  const rings = 72;
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const a = t * (sections.length - 1);
    const index = Math.min(Math.floor(a), sections.length - 2);
    const f = a - index;
    const s = sections[index],
      n = sections[index + 1];
    const x = s[0] + (n[0] - s[0]) * f;
    const width = s[1] + (n[1] - s[1]) * f;
    const height = s[2] + (n[2] - s[2]) * f;
    for (let j = 0; j <= count; j++) {
      const v = j / count;
      const angle = v * Math.PI * 2;
      let z = Math.cos(angle) * width;
      let y = 0;
      if (kind === "upper") {
        y = 0.14 + Math.sin(angle) * height;
        if (y < 0.14) y = 0.14;
      } else {
        const base = kind === "rubber" ? -0.38 : kind === "rim" ? 0.09 : -0.17;
        const thick = kind === "rubber" ? 0.055 : kind === "rim" ? 0.025 : 0.21;
        y = base + Math.sin(angle) * thick;
        z *= 1.08;
        y += Math.pow(Math.max(0, -x - 1), 2) * 0.15;
      }
      positions.push(x, y, z);
      uv.push(t * 5, v * 2);
    }
  }
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < count; j++) {
      // A true opening around the ankle, rather than a painted black oval.
      const offset = (i * (count + 1) + j) * 3;
      const px = positions[offset],
        py = positions[offset + 1],
        pz = positions[offset + 2];
      if (
        kind === "upper" &&
        py > 0.65 &&
        Math.pow((px - 0.87) / 0.46, 2) + Math.pow(pz / 0.29, 2) < 1
      )
        continue;
      const a = i * (count + 1) + j,
        b = a + count + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
export function cord(points: [number, number, number][], radius = 0.018) {
  return new TubeGeometry(
    new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    32,
    radius,
    6,
    false,
  );
}
