import { useEffect, useRef } from "react";

const PLAYER_DIV_ID = "twitch-embed";

interface TwitchEmbedProps {
  channel?: string | null;
}

export default function TwitchEmbed({ channel }: TwitchEmbedProps) {
  const twitchPlayer = useRef<Embed | null>(null);

  useEffect(() => {
    if (channel) {
      if (!twitchPlayer.current) {
        twitchPlayer.current = new Twitch.Embed(PLAYER_DIV_ID, {
          width: "100%",
          height: "100%",
          channel,
          theme: "dark",
          muted: false,
        });
      } else {
        const player = twitchPlayer.current.getPlayer();
        if (player.getChannel() !== channel) {
          player.setChannel(channel);
        }
      }
    }
  }, [channel]);

  return (
    <div
      className="h-screen flex-grow"
      // style={{ height: "calc(100vh - 40px)" }}
      id={PLAYER_DIV_ID}
    />
  );
}
