import type { Emote as EmoteType } from "../../schemas";

export type EmoteCounts = EmoteType & { count: number };

export type TimeStat = {
  endTime: number;
  emoteCounts: EmoteCounts[];
};
