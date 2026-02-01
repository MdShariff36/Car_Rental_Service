// FILE: assets/js/base/helpers.js

export const formatCurrency = (amount, currency = "INR") => {
  if (!amount && amount !== 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date, format = "short") => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    time: { hour: "2-digit", minute: "2-digit" },
    date: { year: "numeric", month: "2-digit", day: "2-digit" },
  };

  return d.toLocaleDateString("en-IN", options[format] || options.short);
};

export const formatDateTime = (date) => {
  return formatDate(date, "long");
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getQueryParams = () => {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
};

export const setQueryParams = (params) => {
  const url = new URL(window.location.href);
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url);
};

export const sanitizeHTML = (str) => {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + "...";
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch (e) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateInPast = (date) => {
  return new Date(date) < new Date();
};

export const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
};

export const scrollToElement = (element, offset = 0) => {
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export const parseJSON = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const sortBy = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter((item) => {
    return keys.some((key) => {
      const value = item[key]?.toString().toLowerCase() || "";
      return value.includes(term);
    });
  });
};

export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
