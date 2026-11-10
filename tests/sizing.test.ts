import { describe, it, expect } from "vitest";
import { convertSize, recommendSizeFromCm, productSizeLabel, SIZE_CHART } from "../src/lib/sizing";

describe("Size System Conversion", () => {
  it("does not relabel unsupported US sizes as EU or centimeters", () => {
    expect(productSizeLabel("14", "EU")).toBe("US 14");
    expect(productSizeLabel("10K", "CM")).toBe("US 10K");
    expect(productSizeLabel("9", "EU")).toBe("42.5");
  });
  it("returns no recommendation outside the sample chart", () => {
    for (const value of [0, -1, 21, 31, 100, NaN, Infinity]) expect(recommendSizeFromCm(value)).toBeNull();
  });
  it("converts US Men 9 to EU 42.5", () => {
    const eu = convertSize("9", "US", "EU", "Men");
    expect(eu).toBe("42.5");
  });

  it("converts US Women 8 to EU 39", () => {
    const eu = convertSize("8", "US", "EU", "Women");
    expect(eu).toBe("39");
  });

  it("converts US Men 10 to UK 9.5 and CM 28.0", () => {
    const uk = convertSize("10", "US", "UK", "Men");
    const cm = convertSize("10", "US", "CM", "Men");
    expect(uk).toBe("9.5");
    expect(cm).toBe("28.0");
  });

  it("recommends appropriate size with toe clearance from foot measurement in cm", () => {
    // A 26.0cm foot + 0.5cm clearance = 26.5cm -> US Men 8.5
    const rec = recommendSizeFromCm(26.0, "Men");
    expect(rec).toBeDefined();
    expect(rec?.usMen).toBe("8.5");
    expect(rec?.cm).toBe("26.5");
  });

  it("size chart entries have monotonic increments", () => {
    for (let i = 1; i < SIZE_CHART.length; i++) {
      const prevCm = parseFloat(SIZE_CHART[i - 1].cm);
      const currCm = parseFloat(SIZE_CHART[i].cm);
      expect(currCm).toBeGreaterThan(prevCm);
    }
  });
});
