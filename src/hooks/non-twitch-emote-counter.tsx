import { useState, useEffect } from "react";

import type { Emote } from "../schemas";
import {
  fetchBetterTTVEmotes,
  fetchFrankerfacezBetterTTVEmotes,
  fetchGlobalBetterTTVEmotes,
} from "./utils/better-ttv";
import { fetchGlobalSevenTVEmotes, fetchSevenTVEmotes } from "./utils/seven-tv";

export function useNonTwitchEmoteCounter() {
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);

  const countEmotes = (message: string) => {
    let tempMessage = message;
    const emoteCounts = [];

    for (const emote of emotes) {
      const re = new RegExp(emote.regexp, "g");
      const matches = [...tempMessage.matchAll(re)];
      if (matches.length > 0) {
        emoteCounts.push({ count: matches.length, ...emote });

        tempMessage = tempMessage.replaceAll(emote.emote, " ");
      }
    }

    return emoteCounts;
  };

  useEffect(() => {
    (async () => {
      if (roomId) {
        console.info(new Date().toLocaleTimeString(), "updating emotes");
        const temp = await Promise.all([
          fetchBetterTTVEmotes(roomId),
          fetchGlobalBetterTTVEmotes(),
          fetchFrankerfacezBetterTTVEmotes(),
          fetchSevenTVEmotes(roomId),
          fetchGlobalSevenTVEmotes(),
        ]);

        const tempEmotes = temp.flat().sort((a, b) => b.score - a.score);

        setEmotes(tempEmotes);
        console.info(new Date().toLocaleTimeString(), "updated emotes");
      }
    })();
  }, [roomId]);

  return {
    countEmotes,
    setRoomId,
  };
}
