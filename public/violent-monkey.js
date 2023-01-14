// ==UserScript==
// @name        Twitch TV Emote Counter
// @namespace   https://github.com/nick-ng/twitch-emotes-per-second
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.1.6
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

  const oldIframeElement = document.getElementById(`${ID}-iframe`);
  if (oldIframeElement) {
    oldIframeElement.remove();
  }

  for (let i = 0; i < 3; i++) {
    const tempOldElement = document.getElementById(`${ID}-${i}`);
    if (tempOldElement) {
      tempOldElement.remove();
    }
  }

  let currentChannel = null;

  /**
   * helper functions
   */
  let counter = 0;
  const getNextElementId = () => `${ID}-${counter++}`;

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
    id: getNextElementId(),
  });
  mainEl.classList.add(`parent-${ID}`);

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

    const oldIframeElement = document.getElementById(`${ID}-iframe`);
    if (oldIframeElement) {
      oldIframeElement.remove();
    }

    const url = `https://emotes-per-second.pux.one${
      location.pathname
    }?iframe=true&parenturl=${encodeURIComponent(location.href)}`;

    makeElement("iframe", bodyEl, null, {
      src: url,
      style: ["position: absolute;", "opacity: 0;"].join(""),
      id: `${ID}-iframe`,
    });
  };

  makeIframe();

  const headEl = document.getElementsByTagName("head")[0];
  makeElement(
    "style",
    headEl,
    `
  .parent-hover-${ID} {
    display: none;
  }

  .parent-${ID}:hover .parent-hover-${ID} {
    display: block;
  }
  `,
    { id: getNextElementId() }
  );

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
              "position: relative",
            ].join(";"),
          });
          tempEmoteCard.classList.add(`parent-${ID}`);
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
            style: ["color: white;", "font-weight: bold;"].join(";"),
          });
          const tempTooltip = makeElement("div", tempEmoteCard, emote, {
            style: [
              "top: 0",
              "bottom: 0",
              "margin-top: auto",
              "margin-bottom: auto",
              "right: calc(100% + 2px)",
              "position: absolute",
              "border: 2px solid gray",
              "color: white",
              "background-color: black;",
              "padding: 0 3px",
              "height: min-content",
            ].join(";"),
          });
          tempTooltip.classList.add(`parent-hover-${ID}`);
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
