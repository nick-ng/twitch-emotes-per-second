/**
 * Scrape Tera Raid info from serebii.net
 */
import fs from "fs";
import { JSDOM } from "jsdom";

const BASE_URL = "https://serebii.net";

const main = async (stars) => {
  try {
    const dom = await JSDOM.fromURL(
      `${BASE_URL}/scarletviolet/teraraidbattles/${stars}star.shtml`
    );

    const {
      window: { document },
    } = dom;

    const trs = [...document.querySelectorAll(".trainer > tbody > tr")];

    const trs1 = trs.filter((tr) => {
      const textContent = tr.textContent.trim();
      if (!textContent) {
        return false;
      }

      if (textContent.match(/item drops:/i)) {
        return false;
      }

      return true;
    });
    const trs2 = trs1.map((tr) => [...tr.children]);
    const [_heading, ...rawRaidInfo] = trs2;

    const raidInfo = [];

    let counter = 0;
    while (rawRaidInfo.length > 0) {
      const pokemons = rawRaidInfo.shift().map((a) => a.textContent);
      rawRaidInfo.shift(); // gameExclusive
      rawRaidInfo.shift(); // levels
      rawRaidInfo.shift(); // teraInfo
      rawRaidInfo.shift(); // abilityInfo
      const moves = rawRaidInfo
        .shift()
        .map((dom) =>
          [...dom.querySelectorAll("a")]
            .map((a) => a.textContent)
            .filter((a) => a)
        );
      for (let i = 0; i < pokemons.length; i++) {
        raidInfo.push({
          id: `${stars}-${counter++}`,
          stars,
          pokemon: pokemons[i],
          moves: moves[i],
        });
      }
    }

    fs.writeFileSync(
      `./public/serebii-${stars}-star-raid.json`,
      JSON.stringify(raidInfo, null, "  ")
    );
  } catch (e) {
    console.error(e);
  }
};

main(6);
main(5);
main(4);
