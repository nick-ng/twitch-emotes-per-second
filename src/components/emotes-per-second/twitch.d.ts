interface TwitchPlayer {
  setChannel: (name: string) => void;
  getChannel: () => string;
}

declare class Embed {
  constructor(
    targetElementId: string,
    options: {
      allowfullscreen?: boolean;
      autoplay?: boolean;
      channel: string;
      collection?: string;
      height?: number | string;
      layout?: "video-with-chat" | "video";
      muted?: boolean;
      parent?: string[];
      theme?: "light" | "dark";
      time?: "string";
      video?: string;
      width?: number | string;
    }
  );

  public addEventListener(event: string, callback: () => void | Promise<void>);

  public getPlayer(): TwitchPlayer;
}

declare const Twitch = {
  Embed: Embed,
};
