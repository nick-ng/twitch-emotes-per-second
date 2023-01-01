import { useEffect, useState } from "react";

import type { SevenTvEmote } from "../../schemas";
import { SevenTvEmoteArraySchema } from "../../schemas";
import { useOptions } from "../../hooks/options-context";
import { useTwitchChatMessages } from "../../hooks/twitch-chat-messages";

const getJson = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

const updateBetterTTVEmotes = async () => {
  // https://api.betterttv.net/3/cached/emotes/global
  // https://api.betterttv.net/3/cached/users/twitch/132415238
};

const updateSevenTVEmotes = async (roomId: string) => {
  const temp = await Promise.all([
    // getJson("https://api.7tv.app/v2/emotes/global"),
    getJson(`https://api.7tv.app/v2/users/${roomId}/emotes`),
  ]);

  return SevenTvEmoteArraySchema.parse(temp.flat());
};

export default function EmotesPerSecond() {
  const { options } = useOptions();
  const { channel } = options;
  const { messages, channelInfo } = useTwitchChatMessages(channel);

  const [sevenTVEmotes, setSevenTVEmotes] = useState<SevenTvEmote[]>([]);

  useEffect(() => {
    (async () => {
      if (channelInfo.roomId) {
        const temp = await updateSevenTVEmotes(channelInfo.roomId);
        setSevenTVEmotes(temp.sort((a, b) => b.name.length - a.name.length));
      }
    })();
  }, [channelInfo.roomId]);

  const oldestMessage = messages[messages.length - 1];
  const oldestMessageAgeMinutes =
    oldestMessage &&
    (Date.now() - new Date(oldestMessage.timestamp).valueOf()) / (1000 * 60);

  return (
    <div>
      {oldestMessage && (
        <div>
          Oldest Message Age: {oldestMessageAgeMinutes.toFixed(3)} minutes
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th className="px-1 text-right">User</th>
            <th className="px-1 text-left">Message</th>
            <th className="px-1 text-left">Emotes</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => {
            let tempMessage = m.message;
            return (
              <tr key={m.id}>
                <td className="px-1 text-right" style={{ color: m.color }}>
                  {m.user}
                </td>
                <td className="px-1">{m.message}</td>
                <td className="px-1">
                  {sevenTVEmotes
                    .filter((e) => {
                      if (tempMessage.includes(e.name)) {
                        tempMessage = tempMessage.replaceAll(e.name, " ");
                        return true;
                      }

                      return false;
                    })
                    .map((e) => e.name)
                    .join(", ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
