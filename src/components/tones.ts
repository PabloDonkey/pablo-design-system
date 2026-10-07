/** The colour names shared by PChip and PButton. */
export type Tone = "neutral" | "accent" | "warning" | "danger";
export const tones = ["neutral", "accent", "warning", "danger"] as const satisfies readonly Tone[];
