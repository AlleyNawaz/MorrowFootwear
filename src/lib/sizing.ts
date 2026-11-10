import type { SizeSystem } from "./types";

export interface SizeChartEntry {
  usMen: string;
  usWomen: string;
  uk: string;
  eu: string;
  cm: string;
  footLengthInches: string;
}

export const SIZE_CHART: SizeChartEntry[] = [
  { usMen: "4", usWomen: "5.5", uk: "3.5", eu: "36", cm: "22.0", footLengthInches: "8.7" },
  { usMen: "4.5", usWomen: "6", uk: "4", eu: "36.5", cm: "22.5", footLengthInches: "8.9" },
  { usMen: "5", usWomen: "6.5", uk: "4.5", eu: "37.5", cm: "23.0", footLengthInches: "9.1" },
  { usMen: "5.5", usWomen: "7", uk: "5", eu: "38", cm: "23.5", footLengthInches: "9.3" },
  { usMen: "6", usWomen: "7.5", uk: "5.5", eu: "38.5", cm: "24.0", footLengthInches: "9.5" },
  { usMen: "6.5", usWomen: "8", uk: "6", eu: "39", cm: "24.5", footLengthInches: "9.6" },
  { usMen: "7", usWomen: "8.5", uk: "6.5", eu: "40", cm: "25.0", footLengthInches: "9.8" },
  { usMen: "7.5", usWomen: "9", uk: "7", eu: "40.5", cm: "25.5", footLengthInches: "10.0" },
  { usMen: "8", usWomen: "9.5", uk: "7.5", eu: "41", cm: "26.0", footLengthInches: "10.2" },
  { usMen: "8.5", usWomen: "10", uk: "8", eu: "42", cm: "26.5", footLengthInches: "10.4" },
  { usMen: "9", usWomen: "10.5", uk: "8.5", eu: "42.5", cm: "27.0", footLengthInches: "10.6" },
  { usMen: "9.5", usWomen: "11", uk: "9", eu: "43", cm: "27.5", footLengthInches: "10.8" },
  { usMen: "10", usWomen: "11.5", uk: "9.5", eu: "44", cm: "28.0", footLengthInches: "11.0" },
  { usMen: "10.5", usWomen: "12", uk: "10", eu: "44.5", cm: "28.5", footLengthInches: "11.2" },
  { usMen: "11", usWomen: "12.5", uk: "10.5", eu: "45", cm: "29.0", footLengthInches: "11.4" },
  { usMen: "11.5", usWomen: "13", uk: "11", eu: "45.5", cm: "29.5", footLengthInches: "11.6" },
  { usMen: "12", usWomen: "13.5", uk: "11.5", eu: "46", cm: "30.0", footLengthInches: "11.8" },
  { usMen: "13", usWomen: "14.5", uk: "12.5", eu: "47.5", cm: "31.0", footLengthInches: "12.2" },
];

export function convertSize(
  value: string,
  fromSystem: SizeSystem,
  toSystem: SizeSystem,
  gender: "Men" | "Women" | "Unisex" = "Men"
): string {
  if (fromSystem === toSystem) return value;

  const row = SIZE_CHART.find((entry) => {
    if (fromSystem === "US") {
      return gender === "Women" ? entry.usWomen === value : entry.usMen === value;
    }
    if (fromSystem === "UK") return entry.uk === value;
    if (fromSystem === "EU") return entry.eu === value;
    if (fromSystem === "CM") return entry.cm === value;
    return false;
  });

  if (!row) return value;

  if (toSystem === "US") {
    return gender === "Women" ? row.usWomen : row.usMen;
  }
  if (toSystem === "UK") return row.uk;
  if (toSystem === "EU") return row.eu;
  if (toSystem === "CM") return row.cm;

  return value;
}

export function recommendSizeFromCm(centimeters: number, gender: "Men" | "Women" | "Unisex" = "Men"): SizeChartEntry | null {
  void gender;
  // Add 0.5 - 1.0cm for active running toe clearance
  const targetCm = centimeters + 0.5;
  if (!Number.isFinite(centimeters) || targetCm < Number(SIZE_CHART[0].cm) || targetCm > Number(SIZE_CHART[SIZE_CHART.length - 1].cm)) return null;
  for (const entry of SIZE_CHART) {
    if (parseFloat(entry.cm) >= targetCm) {
      return entry;
    }
  }
  return null;
}

/** Preserve the source system when no regional conversion is available. */
export function productSizeLabel(value: string, system: SizeSystem): string {
  if (system === "US") return value;
  if (!SIZE_CHART.some(row => row.usMen === value)) return `US ${value}`;
  return convertSize(value, "US", system, "Men");
}
