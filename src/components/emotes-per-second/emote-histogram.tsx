import type { Emote as EmoteType } from "../../schemas";
import type { EmoteCounts, TimeStat } from "./types";

interface EmoteHistogramProps {
  timeStats: TimeStat[];
}

export default function EmoteHistogram({ timeStats }: EmoteHistogramProps) {
  return (
    <div>
      {timeStats.map(({ emoteCounts, endTime }) => (
        <div>{}</div>
      ))}
    </div>
  );
}
