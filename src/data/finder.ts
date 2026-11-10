import type { FinderField } from "@/lib/finder";
export const finderQuestions: { key: FinderField; title: string; description: string; options: string[] }[] = [
  { key: "activity", title: "Where will you take them?", description: "Start with what you do most. You can skip any question.", options: ["Running", "Walking", "Training", "Trail", "Lifestyle"] },
  { key: "cushioning", title: "What feel do you prefer?", description: "Soft is a gentler step-in feel. Responsive describes a quicker rebound. Balanced sits between them. These are sample design categories, not measured results.", options: ["Soft", "Balanced", "Responsive"] },
  { key: "support", title: "How much structure do you like?", description: "Neutral has no added guidance. Guided adds structure. Maximum is the most structured option. Choose a preference, not a diagnosis.", options: ["Neutral", "Guided", "Maximum"] },
  { key: "surface", title: "What is underfoot?", description: "Match your usual surface. Sample terrain descriptions help narrow the range.", options: ["road", "trail", "indoor"] },
];
