import { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";

interface TwitchChatMessage {
  id: string;
  channel: string;
  user: string;
  color: string;
  message: string;
  self: boolean;
  timestamp: number;
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
          message: messageText,
          self: false,
          timestamp: Date.now(),
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
      .then((_e) => {})
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
        return [
          {
            id: `${tags.id}-${tags["tmi-sent-ts"]}` || Date.now().toString(),
            channel,
            user: tags["display-name"] || "<unknown>",
            color: tags.color || "black",
            message,
            self,
            timestamp: parseInt(tags["tmi-sent-ts"] || "0", 10),
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
