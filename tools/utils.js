export const domToArrays = (dom) => {
  if (dom && typeof dom[Symbol.iterator] === "function") {
    return [...dom].map((a) => domToArrays(a));
  }

  return dom;
};
