// ==UserScript==
// @name        Twitch TV Emote Counter
// @namespace   https://github.com/nick-ng/twitch-emotes-per-second
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.8
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

  [...document.getElementsByClassName(ID)].forEach((el) => {
    el.remove();
  });

  let currentChannel = null;

  /**
   * helper functions
   */
  const makeElement = (tag, parent, text, attributes) => {
    const tempElement = document.createElement(tag);
    tempElement.classList.add(ID);
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

  const getMainElStyle = ({ right, top } = {}) =>
    [
      "position: absolute;",
      `top: ${top || 50}px;`,
      `right: ${right || 340}px;`,
      "z-index: 9001;",
      "display: flex;",
      `flex-direction: ${"column"}`,
      "align-items: flex-end",
    ].join(";");

  /**
   * DOM Elements
   */
  const bodyEl = document.getElementsByTagName("body")[0];
  const mainEl = makeElement("div", bodyEl, null, {
    style: getMainElStyle(),
  });
  mainEl.classList.add(`parent-${ID}`);

  const changeStreamer = () => {
    const newChannel = location.pathname.replace("/", "");
    if (
      ["/directory", "/u", "/settings"].some((pn) =>
        location.pathname.startsWith(pn)
      ) ||
      newChannel === currentChannel
    ) {
      return;
    }

    currentChannel = newChannel;

    const oldAnchorElement = document.getElementById(`${ID}-a`);
    if (oldAnchorElement) {
      oldAnchorElement.remove();
    }

    const topNavContainer = [
      ...document.getElementsByClassName("top-nav__search-container"),
    ][0];
    makeElement(
      "a",
      topNavContainer.parentElement,
      `${currentChannel}'s Nightbot Commands`,
      {
        href: `https://nightbot.tv/t/${currentChannel}/commands`,
        target: "_blank",
        id: `${ID}-a`,
      }
    );

    const oldIframeElement = document.getElementById(`${ID}-iframe`);
    if (oldIframeElement) {
      oldIframeElement.remove();
    }

    const url = `https://emotes-per-second.pux.one/?channel=${currentChannel}&iframe=true&parenturl=${encodeURIComponent(
      location.href
    )}`;

    makeElement("iframe", bodyEl, null, {
      src: url,
      style: ["position: absolute;", "opacity: 0;"].join(""),
      id: `${ID}-iframe`,
    });
  };

  setTimeout(() => {
    changeStreamer();
  }, 2000);

  const headEl = document.getElementsByTagName("head")[0];
  makeElement(
    "style",
    headEl,
    `
  .parent-hover-${ID} {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .parent-${ID}:hover .parent-hover-${ID} {
    opacity: 1;
  }
  `
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

    const playerEl = document.querySelectorAll(".persistent-player")[0];

    if (!playerEl) {
      return;
    }

    const { right: playerElEright, top: playerElTop } =
      playerEl.getBoundingClientRect();
    const rightOffset = window.innerWidth - playerElEright;

    const isChatCollapsed = rightOffset === 0;

    if (isChatCollapsed) {
      return;
    }

    mainEl.setAttribute(
      "style",
      getMainElStyle({ right: rightOffset, top: playerElTop })
    );

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
      changeStreamer();
    }, 1000);
  });

  // Check if the streamer raided someone.
  setInterval(() => {
    changeStreamer();
  }, 10000);
})();
