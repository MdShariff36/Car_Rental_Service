// FILE: assets/js/base/storage.js

import { STORAGE_KEYS } from "./config.js";

/**
 * Storage Utility Module
 * Provides safe access to localStorage and sessionStorage
 * with error handling and JSON serialization
 */

// ============================================================
// LocalStorage Utilities
// ============================================================

/**
 * Set item in localStorage
 */
export function setLocalStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("Error setting localStorage:", error);
    return false;
  }
}

/**
 * Get item from localStorage
 */
export function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error("Error getting localStorage:", error);
    return defaultValue;
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing localStorage:", error);
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================
// SessionStorage Utilities
// ============================================================

/**
 * Set item in sessionStorage
 */
export function setSessionStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("Error setting sessionStorage:", error);
    return false;
  }
}

/**
 * Get item from sessionStorage
 */
export function getSessionStorage(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error("Error getting sessionStorage:", error);
    return defaultValue;
  }
}

/**
 * Remove item from sessionStorage
 */
export function removeSessionStorage(key) {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing sessionStorage:", error);
    return false;
  }
}

/**
 * Clear all sessionStorage
 */
export function clearSessionStorage() {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing sessionStorage:", error);
    return false;
  }
}

/**
 * Check if sessionStorage is available
 */
export function isSessionStorageAvailable() {
  try {
    const test = "__storage_test__";
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================
// App-Specific Storage Functions
// ============================================================

/**
 * Save auth token
 */
export function saveAuthToken(token, remember = false) {
  if (remember) {
    return setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    return setSessionStorage(STORAGE_KEYS.AUTH_TOKEN, token);
  }
}

/**
 * Get auth token
 */
export function getAuthToken() {
  return (
    getLocalStorage(STORAGE_KEYS.AUTH_TOKEN) ||
    getSessionStorage(STORAGE_KEYS.AUTH_TOKEN)
  );
}

/**
 * Remove auth token
 */
export function removeAuthToken() {
  removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
  removeSessionStorage(STORAGE_KEYS.AUTH_TOKEN);
  return true;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return getAuthToken() !== null;
}

/**
 * Save user data
 */
export function saveUserData(userData) {
  return setLocalStorage(STORAGE_KEYS.USER_DATA, userData);
}

/**
 * Get user data
 */
export function getUserData() {
  return getLocalStorage(STORAGE_KEYS.USER_DATA);
}

/**
 * Remove user data
 */
export function removeUserData() {
  return removeLocalStorage(STORAGE_KEYS.USER_DATA);
}

/**
 * Get user role
 */
export function getUserRole() {
  const userData = getUserData();
  return userData?.role || null;
}

/**
 * Get user name
 */
export function getUserName() {
  const userData = getUserData();
  return userData?.name || userData?.firstName || "User";
}

/**
 * Save remember me preference
 */
export function saveRememberMe(remember) {
  return setLocalStorage(STORAGE_KEYS.REMEMBER_ME, remember);
}

/**
 * Get remember me preference
 */
export function getRememberMe() {
  return getLocalStorage(STORAGE_KEYS.REMEMBER_ME, false);
}

/**
 * Save search parameters
 */
export function saveSearchParams(params) {
  return setSessionStorage(STORAGE_KEYS.SEARCH_PARAMS, params);
}

/**
 * Get search parameters
 */
export function getSearchParams() {
  return getSessionStorage(STORAGE_KEYS.SEARCH_PARAMS);
}

/**
 * Clear search parameters
 */
export function clearSearchParams() {
  return removeSessionStorage(STORAGE_KEYS.SEARCH_PARAMS);
}

/**
 * Save wishlist
 */
export function saveWishlist(wishlist) {
  return setLocalStorage(STORAGE_KEYS.WISHLIST, wishlist);
}

/**
 * Get wishlist
 */
export function getWishlist() {
  return getLocalStorage(STORAGE_KEYS.WISHLIST, []);
}

/**
 * Add to wishlist
 */
export function addToWishlist(carId) {
  const wishlist = getWishlist();
  if (!wishlist.includes(carId)) {
    wishlist.push(carId);
    saveWishlist(wishlist);
  }
  return wishlist;
}

/**
 * Remove from wishlist
 */
export function removeFromWishlist(carId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((id) => id !== carId);
  saveWishlist(wishlist);
  return wishlist;
}

/**
 * Check if car is in wishlist
 */
export function isInWishlist(carId) {
  const wishlist = getWishlist();
  return wishlist.includes(carId);
}

/**
 * Clear wishlist
 */
export function clearWishlist() {
  return removeLocalStorage(STORAGE_KEYS.WISHLIST);
}

/**
 * Save compare cars
 */
export function saveCompareCars(cars) {
  return setLocalStorage(STORAGE_KEYS.COMPARE_CARS, cars);
}

/**
 * Get compare cars
 */
export function getCompareCars() {
  return getLocalStorage(STORAGE_KEYS.COMPARE_CARS, []);
}

/**
 * Add to compare
 */
export function addToCompare(car) {
  const compareCars = getCompareCars();

  // Limit to 3 cars
  if (compareCars.length >= 3) {
    return { success: false, message: "Maximum 3 cars can be compared" };
  }

  // Check if already in compare
  if (compareCars.some((c) => c.id === car.id)) {
    return { success: false, message: "Car already in comparison" };
  }

  compareCars.push(car);
  saveCompareCars(compareCars);
  return { success: true, cars: compareCars };
}

/**
 * Remove from compare
 */
export function removeFromCompare(carId) {
  let compareCars = getCompareCars();
  compareCars = compareCars.filter((c) => c.id !== carId);
  saveCompareCars(compareCars);
  return compareCars;
}

/**
 * Check if car is in compare
 */
export function isInCompare(carId) {
  const compareCars = getCompareCars();
  return compareCars.some((c) => c.id === carId);
}

/**
 * Clear compare cars
 */
export function clearCompareCars() {
  return removeLocalStorage(STORAGE_KEYS.COMPARE_CARS);
}

/**
 * Get compare count
 */
export function getCompareCount() {
  return getCompareCars().length;
}

/**
 * Save theme preference
 */
export function saveTheme(theme) {
  return setLocalStorage(STORAGE_KEYS.THEME, theme);
}

/**
 * Get theme preference
 */
export function getTheme() {
  return getLocalStorage(STORAGE_KEYS.THEME, "light");
}

/**
 * Save language preference
 */
export function saveLanguage(language) {
  return setLocalStorage(STORAGE_KEYS.LANGUAGE, language);
}

/**
 * Get language preference
 */
export function getLanguage() {
  return getLocalStorage(STORAGE_KEYS.LANGUAGE, "en");
}

/**
 * Clear all app data (logout)
 */
export function clearAllAppData() {
  removeAuthToken();
  removeUserData();
  clearSearchParams();
  clearCompareCars();
  return true;
}

/**
 * Get storage usage info
 */
export function getStorageUsage() {
  try {
    let totalSize = 0;
    const items = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage[key].length + key.length;
        totalSize += size;
        items[key] = size;
      }
    }

    return {
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      items,
      itemCount: Object.keys(items).length,
    };
  } catch (error) {
    console.error("Error getting storage usage:", error);
    return null;
  }
}

/**
 * Export all storage data as JSON
 */
export function exportStorageData() {
  try {
    const data = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        data[key] = getLocalStorage(key);
      }
    }
    return data;
  } catch (error) {
    console.error("Error exporting storage data:", error);
    return null;
  }
}

/**
 * Import storage data from JSON
 */
export function importStorageData(data) {
  try {
    Object.entries(data).forEach(([key, value]) => {
      setLocalStorage(key, value);
    });
    return true;
  } catch (error) {
    console.error("Error importing storage data:", error);
    return false;
  }
}

/**
 * Backup storage to file (returns JSON string)
 */
export function backupStorage() {
  try {
    const data = exportStorageData();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error backing up storage:", error);
    return null;
  }
}

/**
 * Restore storage from backup (JSON string)
 */
export function restoreStorage(backupString) {
  try {
    const data = JSON.parse(backupString);
    return importStorageData(data);
  } catch (error) {
    console.error("Error restoring storage:", error);
    return false;
  }
}

/**
 * Check storage quota
 */
export function checkStorageQuota() {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    return navigator.storage.estimate().then((estimate) => {
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2),
        quotaMB: (estimate.quota / (1024 * 1024)).toFixed(2),
        usageMB: (estimate.usage / (1024 * 1024)).toFixed(2),
      };
    });
  }
  return Promise.resolve(null);
}

/**
 * Clean expired data (if you implement expiration)
 */
export function cleanExpiredData() {
  try {
    const now = Date.now();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.endsWith("_expiry")) {
        const expiry = parseInt(localStorage.getItem(key));
        if (expiry && expiry < now) {
          const dataKey = key.replace("_expiry", "");
          removeLocalStorage(dataKey);
          removeLocalStorage(key);
        }
      }
    }
    return true;
  } catch (error) {
    console.error("Error cleaning expired data:", error);
    return false;
  }
}

/**
 * Set item with expiration (in milliseconds)
 */
export function setWithExpiry(key, value, expiryMs) {
  try {
    const expiry = Date.now() + expiryMs;
    setLocalStorage(key, value);
    setLocalStorage(`${key}_expiry`, expiry);
    return true;
  } catch (error) {
    console.error("Error setting with expiry:", error);
    return false;
  }
}

/**
 * Get item if not expired
 */
export function getWithExpiry(key, defaultValue = null) {
  try {
    const expiryKey = `${key}_expiry`;
    const expiry = getLocalStorage(expiryKey);

    if (expiry && expiry < Date.now()) {
      removeLocalStorage(key);
      removeLocalStorage(expiryKey);
      return defaultValue;
    }

    return getLocalStorage(key, defaultValue);
  } catch (error) {
    console.error("Error getting with expiry:", error);
    return defaultValue;
  }
}

// Export all as default
export default {
  // Basic localStorage
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  isLocalStorageAvailable,

  // Basic sessionStorage
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
  isSessionStorageAvailable,

  // Auth
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,

  // User
  saveUserData,
  getUserData,
  removeUserData,
  getUserRole,
  getUserName,

  // Remember Me
  saveRememberMe,
  getRememberMe,

  // Search
  saveSearchParams,
  getSearchParams,
  clearSearchParams,

  // Wishlist
  saveWishlist,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,

  // Compare
  saveCompareCars,
  getCompareCars,
  addToCompare,
  removeFromCompare,
  isInCompare,
  clearCompareCars,
  getCompareCount,

  // Preferences
  saveTheme,
  getTheme,
  saveLanguage,
  getLanguage,

  // Cleanup
  clearAllAppData,

  // Storage Info
  getStorageUsage,
  exportStorageData,
  importStorageData,
  backupStorage,
  restoreStorage,
  checkStorageQuota,
  cleanExpiredData,

  // Expiry
  setWithExpiry,
  getWithExpiry,
};
