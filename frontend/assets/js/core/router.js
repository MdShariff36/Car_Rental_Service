const routes = {
  "index.html": "pages/home.js",
  "about.html": "pages/about.js",
  "services.html": "pages/services.js",
  "cars.html": "pages/cars.js",
  "car-details.html": "pages/car-details.js",
  "booking.html": "pages/booking.js",
  "booking-confirm.html": "pages/booking-confirm.js",
  "contact.html": "pages/contact.js",
  "faq.html": "pages/faq.js",
  "terms.html": "pages/terms.js",
  "privacy.html": "pages/privacy.js",
  "newsletter.html": "pages/newsletter.js",
  "login.html": "auth/login.js",
  "register.html": "auth/register.js",
};

export const initRouter = async () => {
  const file = window.location.pathname.split("/").pop();
  const script = routes[file];
  if (script) {
    try {
      const module = await import(`../${script}`);
      module.init?.();
    } catch (err) {
      console.error("Router error:", err);
    }
  }
};
