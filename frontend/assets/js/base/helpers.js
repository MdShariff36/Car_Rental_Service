export const qs = (s) => document.querySelector(s);
export const qsa = (s) => document.querySelectorAll(s);

export const formatPrice = (n) => `₹${Number(n).toLocaleString()}`;
