import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import type { Emote as EmoteType } from "../../schemas";
import { useOptions } from "../../hooks/options-context";
import { useTwitchChatMessages } from "../../hooks/twitch-chat-messages";
import {
  fetchBetterTTVEmotes,
  fetchGlobalBetterTTVEmotes,
  fetchFrankerfacezBetterTTVEmotes,
} from "./better-ttv";
import { fetchSevenTVEmotes, fetchGlobalSevenTVEmotes } from "./seven-tv";
import TimeStats from "./time-stats";
import TwitchEmbed from "./twitch-embed";

type EmoteCounts = EmoteType & { count: number };

interface TimeStats {
  endTime: number;
  emoteCounts: EmoteCounts[];
}

const timePeriodMS = 10000;
const updatePeriodMS = 1000;

export default function EmotesPerSecond() {
  const { urlChannel } = useParams();
  const [searchParams, _] = useSearchParams();
  const iframeMode = searchParams.get("iframe") === "true";
  const queryChannel = searchParams.get("channel");
  const parentFrameUrl =
    searchParams.get("parenturl") || "http://localhost:5173/";
  const { options, setOptions } = useOptions();
  const { channel, autoHide, showThreshold } = options;
  const { messages, channelInfo } = useTwitchChatMessages(
    queryChannel || urlChannel || channel
  );

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
        console.info(new Date().toLocaleTimeString(), "updating emotes");
        const temp = await Promise.all([
          fetchBetterTTVEmotes(channelInfo.roomId),
          fetchGlobalBetterTTVEmotes(),
          fetchFrankerfacezBetterTTVEmotes(),
          fetchSevenTVEmotes(channelInfo.roomId),
          fetchGlobalSevenTVEmotes(),
        ]);

        const tempEmotes = temp.flat().sort((a, b) => b.score - a.score);

        setEmotes(tempEmotes);
        console.info(new Date().toLocaleTimeString(), "updated emotes");
      }
    })();
  }, [
    channelInfo.roomId,
    Math.floor(checkTimestamp / updatePeriodMS / (5 * 60)),
  ]);

  useEffect(() => {
    const temp: { [key: string]: EmoteCounts } = {};
    messages
      .filter((message) => message.timestamp > checkTimestamp - timePeriodMS)
      .forEach((message) => {
        message.emoteCounts.forEach((twitchEmote) => {
          if (!temp[twitchEmote.emote]) {
            temp[twitchEmote.emote] = { ...twitchEmote };
          } else {
            temp[twitchEmote.emote].count =
              temp[twitchEmote.emote].count + twitchEmote.count;
          }
        });

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

  const totalEmotes =
    timeStats[0]?.emoteCounts.reduce((prev, curr) => prev + curr.count, 0) || 0;

  useEffect(() => {
    if (!iframeMode || timeStats.length === 0) {
      return;
    }

    window.parent.postMessage(
      {
        emoteCounts: timeStats[0].emoteCounts,
        totalEmotes: totalEmotes,
      },
      parentFrameUrl
    );
  }, [timeStats]);

  if (iframeMode) {
    return <div>iframe mode</div>;
  }

  return (
    <div className="relative flex flex-row items-start">
      <TwitchEmbed channel={urlChannel || channel} />
      <div className="mx-1">
        <button
          className={`absolute top-0 right-0 rounded border border-gray-300 bg-gray-800 px-2 transition-opacity hover:opacity-100 ${
            autoHide ? "opacity-0" : ""
          }`}
          onClick={() => {
            setOptions({ autoHide: !autoHide });
          }}
        >
          Auto Hide: {autoHide ? `${totalEmotes}/${showThreshold}` : "Off"}
        </button>
        <div
          className={`overflow-x-hidden transition-all duration-300 ${
            autoHide && totalEmotes < showThreshold ? "w-0" : "w-[512px]"
          }`}
        >
          <h1>Twitch Emotes Per Second</h1>
          {urlChannel ? (
            <h2>{urlChannel}</h2>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setOptions({ channel: tempChannel });
              }}
            >
              <label>
                Channel:{" "}
                <input
                  className="inline-block rounded-r-none pl-0.5"
                  type="text"
                  value={tempChannel}
                  onChange={(e) => {
                    setTempChannel(e.target.value);
                  }}
                />
              </label>
              <button
                className="my-0.5 inline-block rounded-r border border-gray-300 bg-gray-800 px-2"
                disabled={tempChannel === channel}
              >
                Save
              </button>
            </form>
          )}
          <label className="">
            Auto Show Total Emote Count: {totalEmotes}/
            <input
              className="w-14"
              type="number"
              value={showThreshold}
              onChange={(e) => {
                const temp = parseInt(e.target.value);

                if (isNaN(temp)) {
                  setOptions({ showThreshold: 0 });
                } else {
                  setOptions({ showThreshold: temp });
                }
              }}
            />
          </label>
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
      </div>
    </div>
  );
}
