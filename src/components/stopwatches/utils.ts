export const msToString = (ms: number) => {
  let temp = ms;
  const minutes = Math.floor(temp / (1000 * 60))
    .toString()
    .padStart(2, "0");

  temp = temp % (1000 * 60);
  const seconds = Math.floor(temp / 1000)
    .toString()
    .padStart(2, "0");

  temp = temp % 1000;
  const tenths = Math.floor(temp / 100)
    .toString()
    .padStart(1, "0");

  return `${minutes}:${seconds}.${tenths}`;
};
