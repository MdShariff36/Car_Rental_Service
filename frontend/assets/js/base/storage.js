const KEY = "AUTO_PRIME_APP";

export const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));
export const load = () => JSON.parse(localStorage.getItem(KEY) || "{}");

export const setToken = (token) => {
  const data = load();
  data.token = token;
  save(data);
};

export const getToken = () => load()?.token || null;

export const setUser = (user) => {
  const data = load();
  data.user = user;
  save(data);
};

export const getUser = () => load()?.user || null;

export const clear = () => localStorage.removeItem(KEY);
