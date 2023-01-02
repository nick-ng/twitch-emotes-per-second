import z from "zod";

export const EmoteSchema = z.object({
  id: z.string(),
  emote: z.string(),
  imageUrl: z.string(),
  regexp: z.string(),
  source: z.string(),
  score: z.number(),
});

export type Emote = z.infer<typeof EmoteSchema>;

export const SevenTvEmoteSchema = z.object({
  id: z.string(),
  mime: z.string(),
  name: z.string(),
  urls: z.array(z.tuple([z.string(), z.string()])),
  visibility: z.number(),
});

export type SevenTvEmote = z.infer<typeof SevenTvEmoteSchema>;

export const SevenTvEmoteArraySchema = z.array(SevenTvEmoteSchema);

export const BetterTTVEmoteSchema = z.object({
  code: z.string(),
  id: z.string(),
  imageType: z.string(),
});
