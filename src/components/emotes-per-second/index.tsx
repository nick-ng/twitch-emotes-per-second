import { useEffect, useRef, useState } from "react";

import type { Emote as EmoteType } from "../../schemas";
import { useOptions } from "../../hooks/options-context";
import { useTwitchChatMessages } from "../../hooks/twitch-chat-messages";
import { fetchBetterTTVEmotes, fetchGlobalBetterTTVEmotes } from "./better-ttv";
import { fetchSevenTVEmotes, fetchGlobalSevenTVEmotes } from "./seven-tv";
import TimeStats from "./time-stats";

type EmoteCounts = EmoteType & { count: number };

interface TimeStats {
  endTime: number;
  emoteCounts: EmoteCounts[];
}

const timePeriodMS = 10000;
const updatePeriodMS = 1000;

export default function EmotesPerSecond() {
  const { options, setOptions } = useOptions();
  const { channel } = options;
  const { messages, channelInfo } = useTwitchChatMessages(channel);

  const [tempChannel, setTempChannel] = useState(channel || "");
  const [emotes, setEmotes] = useState<EmoteType[]>([]);
  const [timeStats, setTimeStats] = useState<TimeStats[]>([]);
  const [checkTimestamp, setCheckTimestamp] = useState(
    Math.floor(Date.now() / 5000) * 5000
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      if (channelInfo.roomId) {
        console.info("updating emotes");
        const temp = await Promise.all([
          fetchBetterTTVEmotes(channelInfo.roomId),
          fetchGlobalBetterTTVEmotes(),
          fetchSevenTVEmotes(channelInfo.roomId),
          fetchGlobalSevenTVEmotes(),
        ]);
        setEmotes(temp.flat().sort((a, b) => b.score - a.score));
      }
    })();
  }, [
    channelInfo.roomId,
    Math.floor(checkTimestamp / updatePeriodMS / (30 * 60)),
  ]);

  useEffect(() => {
    const temp: { [key: string]: EmoteCounts } = {};
    messages
      .filter((message) => message.timestamp > checkTimestamp - timePeriodMS)
      .forEach((message) => {
        let tempMessage = message.message;
        for (const emote of emotes) {
          const re = new RegExp(emote.regexp, "g");
          const matches = [...tempMessage.matchAll(re)];
          if (matches.length > 0) {
            if (!temp[emote.emote]) {
              temp[emote.emote] = { count: 0, ...emote };
            }

            temp[emote.emote].count = temp[emote.emote].count + matches.length;

            tempMessage = tempMessage.replaceAll(emote.emote, " ");
          }
        }
      });

    setTimeStats((prev) => {
      return [
        {
          endTime: Date.now(),
          emoteCounts: Object.values(temp),
        },
      ]
        .concat(prev)
        .slice(0, 100);
    });
  }, [checkTimestamp]);

  useEffect(() => {
    if (typeof timeoutRef.current === "number") {
      clearTimeout(timeoutRef.current);
    }

    const updatecheckTimestamp = () => {
      setCheckTimestamp((prev) => {
        if (Date.now() - updatePeriodMS > prev) {
          return prev + updatePeriodMS;
        }

        return prev;
      });

      timeoutRef.current = setTimeout(() => {
        updatecheckTimestamp();
      }, updatePeriodMS / 5.1);
    };

    updatecheckTimestamp();

    return () => {
      if (typeof timeoutRef.current === "number") {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const oldestMessage = messages[messages.length - 1];
  const oldestMessageAgeMinutes =
    oldestMessage &&
    (Date.now() - new Date(oldestMessage.timestamp).valueOf()) / (1000 * 60);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOptions({ channel: tempChannel });
        }}
      >
        <label>
          Channel:{" "}
          <input
            className="inline-block rounded-r-none"
            type="text"
            value={tempChannel}
            onChange={(e) => {
              setTempChannel(e.target.value);
            }}
          />
        </label>
        <button
          className="my-0.5 inline-block rounded-r border border-gray-300 bg-white px-2 dark:bg-gray-800"
          disabled={tempChannel === channel}
        >
          Save
        </button>
      </form>
      {oldestMessage && (
        <div>
          Oldest Message Age: {Math.floor(oldestMessageAgeMinutes)}:
          {Math.floor((oldestMessageAgeMinutes % 1) * 60)
            .toString()
            .padStart(2, "0")}{" "}
          minutes
        </div>
      )}
      {timeStats.length > 0 && (
        <TimeStats
          emoteCounts={timeStats[0].emoteCounts}
          endTime={timeStats[0].endTime}
          timePeriodMS={timePeriodMS}
        />
      )}
      <details>
        <summary>Past Stats</summary>
        {timeStats.slice(1).map(({ emoteCounts, endTime }, i) => (
          <div className="my-0.5" key={endTime}>
            <TimeStats
              emoteCounts={emoteCounts}
              endTime={endTime}
              timePeriodMS={timePeriodMS}
            />
          </div>
        ))}
      </details>
    </div>
  );
}
