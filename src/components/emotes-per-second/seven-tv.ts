import z from "zod";

import type { Emote as EmoteType } from "../../schemas";
import { SevenTvEmoteSchema } from "../../schemas";
import { fetchJson } from "./utils";

const ResponseSchema = z.array(SevenTvEmoteSchema);

export const fetchSevenTVEmotes = async (
  roomId: string | number
): Promise<EmoteType[]> => {
  const res = ResponseSchema.safeParse(
    await fetchJson(`https://api.7tv.app/v2/users/${roomId}/emotes`)
  );

  if (!res.success) {
    return [];
  }

  return res.data.map(({ id, name, urls }) => ({
    id,
    emote: name,
    imageUrl: urls[1][1] || "",
    regexp: name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    source: "7TV",
    score: name.length + 0.8,
  }));
};

export const fetchGlobalSevenTVEmotes = async (): Promise<EmoteType[]> => {
  const res = ResponseSchema.safeParse(
    await fetchJson("https://api.7tv.app/v2/emotes/global")
  );

  if (!res.success) {
    return [];
  }

  return res.data.map(({ id, name, urls }) => ({
    id,
    emote: name,
    imageUrl: urls[1][1] || "",
    regexp: name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    source: "7TV",
    score: name.length + 0.6,
  }));
};
// "https://api.7tv.app/v2/emotes/global"
