export type PartId = "whole" | "upper" | "heel" | "midsole" | "outsole";
export interface Configuration {
  upper: string;
  accent: string;
  sole: string;
  laces: "cross" | "straight";
}
export const initialConfiguration: Configuration = {
  upper: "#d4cdbd",
  accent: "#c62c25",
  sole: "#e5dece",
  laces: "cross",
};
export const materialStories: {
  id: PartId;
  label: string;
  title: string;
  copy: string;
  point: [number, number, number];
}[] = [
  {
    id: "upper",
    label: "01 / TEXTILE",
    title: "Structure you can see.",
    copy: "A woven surface, an open collar, and a flexible forefoot. Explore the textile geometry of this original concept.",
    point: [-0.6, 0.7, 0.58],
  },
  {
    id: "heel",
    label: "02 / SUPPORT",
    title: "A considered hold.",
    copy: "The rear frame wraps the heel. Its separate construction becomes visible when you open the assembly.",
    point: [1.1, 0.8, 0.38],
  },
  {
    id: "midsole",
    label: "03 / CUSHIONING",
    title: "Room for the ride.",
    copy: "A sculpted foam layer follows the foot from heel to toe. Surface grain and a recessed channel reveal its form.",
    point: [0.1, -0.1, 0.65],
  },
  {
    id: "outsole",
    label: "04 / CONTACT",
    title: "Every contact counts.",
    copy: "Segmented rubber tread follows the sole. Rotate underneath to inspect the contact pattern.",
    point: [-0.5, -0.4, 0.5],
  },
];
export const storyStates = [
  { rotation: [0.08, -0.35, -0.17], position: [0, 0, 0], scale: 1, explode: 0 },
  {
    rotation: [0.18, 0.5, -0.1],
    position: [0.25, 0, 0],
    scale: 0.95,
    explode: 0,
  },
  {
    rotation: [0.12, -0.13, 0.04],
    position: [0.45, -0.15, 0],
    scale: 0.82,
    explode: 1,
  },
  {
    rotation: [0.22, -0.4, -0.12],
    position: [0.9, -0.3, 0],
    scale: 1.25,
    explode: 0,
  },
  {
    rotation: [-0.25, 0.3, 0.12],
    position: [0.2, 0.1, 0],
    scale: 0.9,
    explode: 0,
  },
  { rotation: [0.1, -0.3, -0.1], position: [0, 0, 0], scale: 1, explode: 0 },
] as const;
