/**
 * Scrape Emote info from www.twitchemotes.com
 */
import fs from "fs";
import { JSDOM } from "jsdom";

const BASE_URL = "https://www.twitchemotes.com/";

const main = async () => {
  try {
    const dom = await JSDOM.fromURL(BASE_URL);

    const {
      window: { document },
    } = dom;

    const centers = [...document.querySelectorAll("center")];

    const emotes = centers
      .map((c) => {
        const img = c.querySelector("img");

        const imageUrl = img.getAttribute("src").replace(/\/1.0$/, "/2.0");

        const emote = c.textContent;

        const id = imageUrl
          .replace("https://static-cdn.jtvnw.net/emoticons/v1/", "")
          .replace("/2.0", "");

        console.log({ id, emote, imageUrl });

        return {
          id,
          emote,
          imageUrl,
          regexp: emote.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
          source: "Twitch",
          score: emote.length + 10000.99,
        };
      })
      .filter((emote) => !["80393"].includes(emote.id));

    fs.writeFileSync(
      `./public/twitch-emotes.json`,
      JSON.stringify(emotes, null, "  ")
    );
  } catch (e) {
    console.error(e);
  }
};

main();

// https://static-cdn.jtvnw.net/emoticons/v1/555555628/2.0
