import z from "zod";

import type { Emote as EmoteType } from "../../schemas";
import { TwitchEmoteSchema, EmoteSchema } from "../../schemas";
import { fetchJson } from "./utils";

const ResponseSchema = z.object({ data: z.array(TwitchEmoteSchema) });

export const fetchTwitchEmotes = async (
  roomId: string | number
): Promise<EmoteType[]> => {
  const res = ResponseSchema.safeParse(
    await fetchJson(
      `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${roomId}`,
      {
        headers: {
          Authorization: "Bearer cfabdegwdoklmawdzdo98xt2fo512y",
          "Client-Id": "uo6dggojyb8d6soh92zknwmi5ej1q2",
        },
      }
    )
  );

  if (!res.success) {
    return [];
  }

  const { data } = res.data;

  return data.map(({ id, name, images }) => ({
    id,
    emote: name,
    imageUrl: Object.values(images)[1] || Object.values(images)[0] || "",
    regexp: name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
    source: "Twitch",
    score: name.length + 0.9,
  }));
};

export const fetchGlobalTwitchEmotes = async (): Promise<EmoteType[]> => {
  const res = z
    .array(EmoteSchema)
    .safeParse(await fetchJson("/twitch-emotes.json"));

  if (!res.success) {
    return [];
  }

  return res.data;
};
