/** The colour names shared by PChip and PButton. */
export const tones = ["neutral", "accent", "warning", "danger"] as const;
export type Tone = (typeof tones)[number];
