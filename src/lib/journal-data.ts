import type { JournalArticle } from "./types";

const editorialDefaults = {
  author: "Morrow concept studio",
  authorRole: "Sample editorial — fictional brand",
  publishedAt: "2026-09-09",
  readTimeMinutes: 2,
  heroImage: "/images/morrow-hero.png",
};
export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    ...editorialDefaults, slug: "daily-rotation-guide",
    title: "A shoe rotation that fits your day",
    subtitle: "Choose by the task, not by a rule that says you need more pairs.",
    category: "Fit & Mechanics",
    excerpt: "A commute, a trail and a studio session can ask different things of a shoe. This sample guide starts with what you already own.",
    content: [
      { heading: "Start with your routine", body: "Write down the places you go and the surfaces you use. Compare those needs with each pair’s stated use case. There is no minimum collection size and no injury-prevention promise." },
      { heading: "Make room for care", body: "Follow the care label. Let wet footwear air-dry away from direct heat before storing it. Check for wear rather than relying on an invented mileage deadline." },
      { heading: "Buy only for a real gap", body: "If an existing pair works for the task, a new pair is not automatically necessary. Sample Morrow styles illustrate different design directions, not clinically tested outcomes." },
    ], relatedProductSlugs: ["daybreak-one", "softstep-guide"],
  },
  {
    ...editorialDefaults, slug: "midsole-foam-anatomy",
    title: "Cushioning, without the claims",
    subtitle: "A plain-language key to the sample catalog.",
    category: "Design & Materials",
    excerpt: "Soft, balanced and responsive describe intended feel in this concept. They are not laboratory scores.",
    content: [
      { heading: "Read the label in context", body: "In this catalog, soft means a gentler intended step-in feel; responsive suggests a quicker rebound; balanced sits between them. Personal preference is not a universal ranking." },
      { heading: "What we have not tested", body: "No physical Morrow prototypes or supplier reports support energy-return, durability or material-composition claims. Those facts must be verified before a real product launch." },
    ], relatedProductSlugs: ["tempo-floor", "daybreak-one"],
  },
  {
    ...editorialDefaults, slug: "sustainability-progress-report-2026",
    title: "Responsibility starts with evidence",
    subtitle: "A reporting framework, not an environmental results report.",
    category: "Sustainability",
    excerpt: "There are no verified Morrow environmental results, audited facilities or take-back programs in this demo.",
    content: [
      { heading: "Describe the scope", body: "A future materials claim needs a specific product, component, method and reporting period. Percentages without a clear denominator do not belong in a product story." },
      { heading: "Show what supports the statement", body: "Keep supplier evidence, test methods, exclusions and review dates alongside the approved wording. Publish uncertainty and limitations where they affect interpretation." },
      { heading: "Do not promise an unavailable service", body: "This concept has no recycling or repair collection service. A real program would need operating partners, eligibility rules and a documented destination for collected materials." },
    ], relatedProductSlugs: [],
  },
  {
    ...editorialDefaults, slug: "neutral-vs-stability-footwear",
    title: "Structure is a preference, not a diagnosis",
    subtitle: "Understanding the sample support labels.",
    category: "Fit & Mechanics",
    excerpt: "Neutral, guided and maximum are catalog groupings. The finder does not assess gait, diagnose pain or prescribe footwear.",
    content: [
      { heading: "Compare the intended construction", body: "Neutral concepts omit added guidance. Guided concepts add structure. Maximum denotes the most structured sample category. These labels do not establish medical suitability." },
      { heading: "Keep the decision grounded", body: "Use the size guide and product description to prepare questions before a fitting. This demo cannot determine which shoe is appropriate for an injury or an individual clinical need." },
    ], relatedProductSlugs: ["softstep-guide", "daybreak-one"],
  },
  {
    ...editorialDefaults, slug: "care-between-outings",
    title: "Between one outing and the next",
    subtitle: "A small care routine without a durability guarantee.",
    category: "Design & Materials",
    excerpt: "Read the material-specific care label first. This sample routine keeps the basics visible.",
    content: [
      { heading: "Clear, clean, dry", body: "Remove loose dry dirt gently. If the manufacturer allows it, spot-clean with mild soap and cool water. Avoid machine washing unless the actual care instructions permit it." },
      { heading: "Store with room to breathe", body: "Allow footwear to dry before storage and keep it away from concentrated heat. Stop using a cleaning method if it changes the material’s color or texture." },
    ], relatedProductSlugs: ["daybreak-one"],
  },
  {
    ...editorialDefaults, slug: "the-long-way-home",
    title: "The long way home",
    subtitle: "An editorial note about making room for a detour.",
    category: "Culture & Movement",
    excerpt: "A different corner. A familiar street at a different hour. Not every journey needs a performance metric.",
    content: [
      { heading: "Notice the route", body: "This campaign concept is about everyday movement: the pause outside a bookshop, a walk with a friend, the choice to take a quieter street." },
      { heading: "Leave the stopwatch behind", body: "Morrow is a fictional brand exploring how a useful object can fit into a day. The story is an invitation to look around, not a promise that shoes will change your life." },
    ], relatedProductSlugs: ["daybreak-one", "softstep-guide"],
  },
];
