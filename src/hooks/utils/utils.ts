export const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  return await res.json();
};
