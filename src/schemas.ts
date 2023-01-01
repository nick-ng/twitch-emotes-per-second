import z from "zod";

export const CustomEmoteSchema = z.object({
  emote: z.string(),
  image: z.string().nullable(),
});

export type CustomEmote = z.infer<typeof CustomEmoteSchema>;

export const SevenTvEmoteSchema = z.object({
  id: z.string(),
  mime: z.string(),
  name: z.string(),
  urls: z.array(z.tuple([z.string(), z.string()])),
  visibility: z.number(),
});

export type SevenTvEmote = z.infer<typeof SevenTvEmoteSchema>;

export const SevenTvEmoteArraySchema = z.array(SevenTvEmoteSchema);
