import z from "zod";

import type { Emote as EmoteType } from "../../schemas";
import { BetterTTVEmoteSchema } from "../../schemas";
import { fetchJson } from "./utils";

const ResponseSchema = z.object({
  channelEmotes: z.array(BetterTTVEmoteSchema),
  sharedEmotes: z.array(BetterTTVEmoteSchema),
});

export const fetchBetterTTVEmotes = async (
  roomId: string | number,
  platform = "twitch"
): Promise<EmoteType[]> => {
  const res = ResponseSchema.safeParse(
    await fetchJson(
      `https://api.betterttv.net/3/cached/users/${platform}/${roomId}`
    )
  );

  if (!res.success) {
    return [];
  }

  const { channelEmotes, sharedEmotes } = res.data;

  return channelEmotes.concat(sharedEmotes).map(({ code, id }) => ({
    id,
    emote: code,
    imageUrl: `https://cdn.betterttv.net/emote/${id}/2x`,
    regexp: code.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    source: "betterttv",
    score: code.length + 0.5,
  }));
};

export const fetchGlobalBetterTTVEmotes = async (
  platform = "twitch"
): Promise<EmoteType[]> => {
  const res = z
    .array(BetterTTVEmoteSchema)
    .safeParse(
      await fetchJson("https://api.betterttv.net/3/cached/emotes/global")
    );

  if (!res.success) {
    return [];
  }

  return res.data.map(({ code, id }) => ({
    id,
    emote: code,
    imageUrl: `https://cdn.betterttv.net/emote/${id}/2x`,
    regexp: code.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    source: "betterttv",
    score: code.length + 0.5,
  }));
};

// https://api.betterttv.net/3/cached/emotes/global
