export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export const createEl = (tag, attrs = {}) => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

export const serializeForm = (form) => {
  const data = {};
  new FormData(form).forEach((v, k) => (data[k] = v.trim()));
  return data;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
