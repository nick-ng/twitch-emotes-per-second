// ==UserScript==
// @name        Twitch TV Emote Counter
// @namespace   https://github.com/nick-ng/twitch-emotes-per-second
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.1.5
// @author      https://github.com/nick-ng
// @description Show emote counters on Twitch
// @downloadURL https://emotes-per-second.pux.one/violent-monkey.js
// @run-at      document-idle
// ==/UserScript==

(() => {
  const EMOTE_COUNT_THRESHOLD = 1;
  const EMOTE_LIMIT = 10;
  const MIN_SIZE_PX = 32;
  const MAX_SIZE_PX = 100;
  const NORMAL_SIZE_PX = 56;
  const NORMAL_COUNT = 3;

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
      "top: 50px;",
      "right: 340px;",
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

  const getImageSize = (thisCount, maxCount = 3) => {
    const maxSize = Math.min(
      MAX_SIZE_PX,
      (maxCount / NORMAL_COUNT) * NORMAL_SIZE_PX
    );

    return Math.max(MIN_SIZE_PX, (thisCount / maxCount) * maxSize);
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

    const isTheaterMode =
      [...document.getElementsByClassName("right-column--theatre")].length > 0;

    const isTheaterModeChatCollapsed =
      [
        ...document.getElementsByClassName(
          "right-column--collapsed right-column--theatre"
        ),
      ].length > 0;

    const isNormalChatCollapsed =
      [
        ...document.getElementsByClassName(
          "channel-root__right-column channel-root__right-column--expanded"
        ),
      ].length === 0;

    if (
      (isTheaterMode && isTheaterModeChatCollapsed) ||
      isNormalChatCollapsed
    ) {
      return;
    }

    const maxCount = Math.max(...data.emoteCounts.map((a) => a.count)) || 0;

    data.emoteCounts
      ?.sort((a, b) => b.count - a.count)
      .slice(0, EMOTE_LIMIT)
      .forEach((emoteCount) => {
        const { count, emote, imageUrl } = emoteCount;
        if (count >= EMOTE_COUNT_THRESHOLD) {
          const tempEmoteCard = makeElement("div", mainEl, null, {
            style: [
              "text-align: center;",
              "background-color: black;",
              "border: 2px solid gray",
              "display: flex",
              "flex-direction: row",
              "align-items: center",
            ].join(";"),
          });
          makeElement("img", tempEmoteCard, null, {
            style: [
              `height: ${getImageSize(count, maxCount)}px;`,
              "display: block",
            ].join(";"),
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

  // Check if you've gone to watch a different streamer
  bodyEl.addEventListener("click", (_event) => {
    setTimeout(() => {
      makeIframe();
    }, 1000);
  });

  // Check if the streamer raided someone.
  setInterval(() => {
    makeIframe();
  }, 10000);
})();
