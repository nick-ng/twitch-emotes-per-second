// ==UserScript==
// @name        Twitch TV Emote Counter
// @namespace   https://github.com/nick-ng/twitch-emotes-per-second
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.1.1
// @author      https://github.com/nick-ng
// @description Show emote counters on Twitch
// @downloadURL https://raw.githubusercontent.com/nick-ng/twitch-emotes-per-second/main/violent-monkey.js
// @run-at      document-idle
// ==/UserScript==

(() => {
  const EMOTE_COUNT_THRESHOLD = 1;
  const EMOTE_LIMIT = 10;
  const SIZE_ADJUSTMENT = 5;

  const ID = "0628c876-ebae-4107-8f68-377e9d5e144f";
  const oldElement = document.getElementById(ID);
  if (oldElement) {
    oldElement.remove();
  }
  const oldElement1 = document.getElementById(`${ID}-1`);
  if (oldElement1) {
    oldElement1.remove();
  }
  let currentChannel = null;

  /**
   * helper functions
   */
  const makeElement = (tag, parent, text, attributes) => {
    const tempElement = document.createElement(tag);
    if (text) {
      tempElement.textContent = text;
    }
    if (parent) {
      parent.appendChild(tempElement);
    }
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        tempElement.setAttribute(key, value);
      });
    }
    return tempElement;
  };

  /**
   * DOM Elements
   */
  const bodyEl = document.getElementsByTagName("body")[0];
  const mainEl = makeElement("div", bodyEl, null, {
    style: [
      "position: absolute;",
      "top: 0;",
      "right: 0;",
      "z-index: 9001;",
      "display: flex;",
      `flex-direction: ${"column"}`,
      "align-items: flex-end",
    ].join(";"),
    id: ID,
  });

  const makeIframe = () => {
    if (
      ["/directory", "/u", "/settings"].some((pn) =>
        location.pathname.startsWith(pn)
      ) ||
      location.pathname === currentChannel
    ) {
      return;
    }

    currentChannel = location.pathname;

    const oldElement1 = document.getElementById(`${ID}-1`);
    if (oldElement1) {
      oldElement1.remove();
    }

    const url = `https://emotes-per-second.pux.one${
      location.pathname
    }?iframe=true&parenturl=${encodeURIComponent(location.href)}`;

    makeElement("iframe", bodyEl, null, {
      src: url,
      style: ["position: absolute;", "opacity: 0;"].join(""),
      id: `${ID}-1`,
    });
  };

  makeIframe();

  /**
   * Functions
   */
  const clearMainEl = () => {
    [...mainEl.childNodes].forEach((childNode) => {
      childNode.remove();
    });
  };

  /**
   * Event Handlers
   */
  window.addEventListener("message", (event) => {
    if (!mainEl) {
      return;
    }
    const { data } = event;
    if (!data.emoteCounts) {
      return;
    }

    clearMainEl();

    const maxCount = Math.max(...data.emoteCounts.map((a) => a.count)) || 0;
    const baseSize = Math.min(64, 32 + (maxCount - 1) * 16);

    data.emoteCounts
      ?.sort((a, b) => b.count - a.count)
      .slice(0, EMOTE_LIMIT)
      .forEach((emoteCount) => {
        const { count, emote, imageUrl } = emoteCount;
        if (count >= EMOTE_COUNT_THRESHOLD) {
          const px = Math.max(
            24,
            Math.min(
              64,
              (baseSize * count) / Math.min(maxCount, SIZE_ADJUSTMENT)
            )
          );
          const tempEmoteCard = makeElement("div", mainEl, null, {
            style: [
              "text-align: center;",
              "background-color: black;",
              "border: 1px solid gray",
              "display: flex",
              "flex-direction: row",
              "align-items: center",
            ].join(";"),
          });
          makeElement("img", tempEmoteCard, null, {
            style: [`height: ${px}px;`, "display: block"].join(";"),
            src: imageUrl,
            title: emote,
            alt: emote,
          });
          makeElement("span", tempEmoteCard, `×${count}`, {
            style: ["color: white;", "font-weight: bold;"].join(""),
          });
        }
      });
  });

  bodyEl.addEventListener("click", (event) => {
    setTimeout(() => {
      makeIframe();
    }, 1000);
  });
})();
