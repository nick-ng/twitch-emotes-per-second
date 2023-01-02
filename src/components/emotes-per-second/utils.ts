export const fetchJson = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};
