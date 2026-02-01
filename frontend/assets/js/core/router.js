// FILE: assets/js/core/router.js

import { canAccessRoute } from "./auth-guard.js";
import { CONFIG } from "../base/config.js";

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.initialized = false;
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  init() {
    if (this.initialized) return;

    window.addEventListener("popstate", () => {
      this.handleRoute();
    });

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-link]");
      if (link) {
        e.preventDefault();
        const href = link.getAttribute("href");
        this.navigate(href);
      }
    });

    this.handleRoute();
    this.initialized = true;
  }

  getCurrentPath() {
    return window.location.pathname;
  }

  navigate(path) {
    if (!canAccessRoute(path)) {
      window.location.href = CONFIG.ROUTES.LOGIN;
      return;
    }

    window.history.pushState({}, "", path);
    this.handleRoute();
  }

  handleRoute() {
    const path = this.getCurrentPath();

    if (!canAccessRoute(path)) {
      window.location.href = CONFIG.ROUTES.LOGIN;
      return;
    }

    const handler = this.routes.get(path);

    if (handler) {
      this.currentRoute = path;
      handler();
    } else {
      this.handle404();
    }
  }

  handle404() {
    console.log("404 - Page not found");
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  reload() {
    window.location.reload();
  }
}

export const router = new Router();
