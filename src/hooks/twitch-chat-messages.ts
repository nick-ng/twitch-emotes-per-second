import { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";

import type { Emote } from "../schemas";

interface TwitchChatMessage {
  id: string;
  channel: string;
  user: string;
  color: string;
  originalMessage: string;
  message: string;
  self: boolean;
  timestamp: number;
  emoteCounts: (Emote & { count: number })[];
}

export function useTwitchChatMessages(channel: string | null) {
  const [messages, setMessages] = useState<TwitchChatMessage[]>([]);
  const [channelInfo, setChannelInfo] = useState({ roomId: "" });

  const addTestMessage = useRef((messageText: string) => {
    setMessages((prev) => {
      return [
        {
          id: Date.now().toString(),
          channel: channel || "",
          user: "test",
          color: "black",
          originalMessage: messageText,
          message: messageText,
          self: false,
          timestamp: Date.now(),
          emoteCounts: [] as (Emote & { count: number })[],
        },
      ].concat(prev);
    });
  }).current;

  useEffect(() => {
    if (!channel) {
      return;
    }
    console.info("connecting to ", channel);
    const client = new tmi.Client({
      options: {},
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [channel],
    });

    client
      .connect()
      .then((_e) => {
        console.log(`connected to ${channel}`);
      })
      .catch((e) => {
        console.error(e);
      });

    client.on("message", (channel, tags, message, self) => {
      setChannelInfo((prev) => {
        if (tags["room-id"] && tags["room-id"] !== prev.roomId) {
          return { ...prev, roomId: tags["room-id"] };
        }

        return prev;
      });
      setMessages((prev) => {
        let tempMessage = [...message];
        const emoteCounts: (Emote & { count: number })[] = [];

        if (tags.emotes) {
          Object.entries(tags.emotes).forEach(([emoteId, positions]) => {
            let emote = "";

            for (const position of positions) {
              const [start, end] = position.split("-");
              const startNumber = parseInt(start, 10);
              const endNumber = parseInt(end, 10);

              if (isNaN(startNumber) || isNaN(endNumber)) {
                continue;
              }

              if (!emote) {
                emote = message.slice(startNumber, endNumber + 1);
              }

              for (let i = startNumber; i <= endNumber; i++) {
                tempMessage[i] = " ";
              }
            }

            emoteCounts.push({
              id: emoteId,
              emote,
              imageUrl: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/2.0`,
              regexp: emote.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
              score: 99999,
              source: "Twitch",
              count: positions.length,
            });
          });
        }

        return [
          {
            id: `${tags.id}-${tags["tmi-sent-ts"]}` || Date.now().toString(),
            channel,
            user: tags["display-name"] || "<unknown>",
            color: tags.color || "black",
            originalMessage: message,
            message: tempMessage.join(""),
            self,
            timestamp: parseInt(tags["tmi-sent-ts"] || "0", 10),
            emoteCounts,
          },
        ]
          .concat(prev)
          .slice(0, 10000);
      });
    });

    return () => {
      console.info("disconnecting from ", channel);
      client.removeAllListeners();
      client.disconnect();
    };
  }, [channel]);

  return { messages, addTestMessage, channelInfo };
}
