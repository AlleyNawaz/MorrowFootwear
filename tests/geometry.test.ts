import { describe, it, expect } from "vitest";
import { shoeGeometry } from "../src/components/three/geometry";
import { initialConfiguration, storyStates } from "../src/data/experience";

describe("procedural product geometry", () => {
  for (const part of ["upper", "sole", "rubber", "rim"] as const) {
    it(`${part} has finite indexed geometry within the vertex budget`, () => {
      const geometry = shoeGeometry(part);
      const position = geometry.getAttribute("position");
      expect(position.count).toBeLessThan(8000);
      expect(Array.from(position.array).every(Number.isFinite)).toBe(true);
      expect(geometry.getIndex()?.count).toBeGreaterThan(0);
      geometry.computeBoundingBox();
      expect(geometry.boundingBox?.max.x).toBeGreaterThan(1);
      geometry.dispose();
    });
  }
  it("has coherent narrative endpoints and default configuration", () => {
    expect(storyStates).toHaveLength(6);
    expect(storyStates[0].explode).toBe(0);
    expect(storyStates[5].explode).toBe(0);
    expect(initialConfiguration.laces).toBe("cross");
  });
});
