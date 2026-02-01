// FILE: assets/js/base/storage.js

import { CONFIG } from "./config.js";
import { parseJSON } from "./helpers.js";

class Storage {
  constructor() {
    this.prefix = CONFIG.STORAGE.PREFIX;
  }

  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this._getKey(key), serialized);
      return true;
    } catch (e) {
      console.error("Storage set error:", e);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this._getKey(key));
      return item ? parseJSON(item, defaultValue) : defaultValue;
    } catch (e) {
      console.error("Storage get error:", e);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (e) {
      console.error("Storage remove error:", e);
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error("Storage clear error:", e);
      return false;
    }
  }

  has(key) {
    return localStorage.getItem(this._getKey(key)) !== null;
  }

  setToken(token) {
    return this.set(CONFIG.STORAGE.TOKEN_KEY.replace(this.prefix, ""), token);
  }

  getToken() {
    return this.get(CONFIG.STORAGE.TOKEN_KEY.replace(this.prefix, ""));
  }

  removeToken() {
    return this.remove(CONFIG.STORAGE.TOKEN_KEY.replace(this.prefix, ""));
  }

  setUser(userData) {
    return this.set(CONFIG.STORAGE.USER_KEY.replace(this.prefix, ""), userData);
  }

  getUser() {
    return this.get(CONFIG.STORAGE.USER_KEY.replace(this.prefix, ""));
  }

  removeUser() {
    return this.remove(CONFIG.STORAGE.USER_KEY.replace(this.prefix, ""));
  }

  setCart(cartData) {
    return this.set(CONFIG.STORAGE.CART_KEY.replace(this.prefix, ""), cartData);
  }

  getCart() {
    return this.get(CONFIG.STORAGE.CART_KEY.replace(this.prefix, ""), []);
  }

  removeCart() {
    return this.remove(CONFIG.STORAGE.CART_KEY.replace(this.prefix, ""));
  }

  setWishlist(wishlistData) {
    return this.set(
      CONFIG.STORAGE.WISHLIST_KEY.replace(this.prefix, ""),
      wishlistData,
    );
  }

  getWishlist() {
    return this.get(CONFIG.STORAGE.WISHLIST_KEY.replace(this.prefix, ""), []);
  }

  removeWishlist() {
    return this.remove(CONFIG.STORAGE.WISHLIST_KEY.replace(this.prefix, ""));
  }

  addToWishlist(carId) {
    const wishlist = this.getWishlist();
    if (!wishlist.includes(carId)) {
      wishlist.push(carId);
      this.setWishlist(wishlist);
    }
    return wishlist;
  }

  removeFromWishlist(carId) {
    const wishlist = this.getWishlist();
    const filtered = wishlist.filter((id) => id !== carId);
    this.setWishlist(filtered);
    return filtered;
  }

  isInWishlist(carId) {
    const wishlist = this.getWishlist();
    return wishlist.includes(carId);
  }

  setTheme(theme) {
    return this.set(CONFIG.STORAGE.THEME_KEY.replace(this.prefix, ""), theme);
  }

  getTheme() {
    return this.get(CONFIG.STORAGE.THEME_KEY.replace(this.prefix, ""), "light");
  }

  getAll() {
    const all = {};
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(this.prefix, "");
        all[cleanKey] = this.get(cleanKey);
      }
    });
    return all;
  }

  size() {
    const keys = Object.keys(localStorage);
    return keys.filter((key) => key.startsWith(this.prefix)).length;
  }
}

export const storage = new Storage();
