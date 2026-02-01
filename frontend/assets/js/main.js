// FILE: assets/js/main.js

import { initHeader } from "./components/header.js";
import { initFooter } from "./components/footer.js";
import { initTheme } from "./ui/theme.js";
import { resetLoader } from "./ui/loader.js";

import { initHome } from "./pages/home.js";
import { initAbout } from "./pages/about.js";
import { initServices } from "./pages/services.js";
import { initCars } from "./pages/cars.js";
import { initCarDetails } from "./pages/car-details.js";
import { initBooking } from "./pages/booking.js";
import { initBookingConfirm } from "./pages/booking-confirm.js";
import { initContact } from "./pages/contact.js";
import { initFAQ } from "./pages/faq.js";
import { initTerms } from "./pages/terms.js";
import { initPrivacy } from "./pages/privacy.js";
import { initNewsletter } from "./pages/newsletter.js";

import { initLogin } from "./auth/login.js";
import { initRegister } from "./auth/register.js";

import { initUserDashboard } from "./dashboards/user/dashboard.js";
import { initMyBookings } from "./dashboards/user/my-bookings.js";
import { initPayments } from "./dashboards/user/payments.js";
import { initWishlist } from "./dashboards/user/wishlist.js";
import { initProfile } from "./dashboards/user/profile.js";

import { initHostDashboard } from "./dashboards/host/dashboard.js";
import { initAddCar } from "./dashboards/host/add-car.js";
import { initManageCars } from "./dashboards/host/manage-cars.js";
import { initEarnings } from "./dashboards/host/earnings.js";

import { initAdminLogin } from "./dashboards/admin/login.js";
import { initAdminDashboard } from "./dashboards/admin/dashboard.js";
import { initAdminBookings } from "./dashboards/admin/bookings.js";
import { initAdminCars } from "./dashboards/admin/cars.js";
import { initAdminAddCar } from "./dashboards/admin/add-car.js";
import { initAdminEditCar } from "./dashboards/admin/edit-car.js";
import { initAdminUsers } from "./dashboards/admin/users.js";
import { initAdminReports } from "./dashboards/admin/reports.js";
import { initAdminSettings } from "./dashboards/admin/settings.js";

const routes = {
  "/": initHome,
  "/index.html": initHome,
  "/about": initAbout,
  "/about.html": initAbout,
  "/services": initServices,
  "/services.html": initServices,
  "/cars": initCars,
  "/cars.html": initCars,
  "/car-details": initCarDetails,
  "/car-details.html": initCarDetails,
  "/booking": initBooking,
  "/booking.html": initBooking,
  "/booking-confirm": initBookingConfirm,
  "/booking-confirm.html": initBookingConfirm,
  "/contact": initContact,
  "/contact.html": initContact,
  "/faq": initFAQ,
  "/faq.html": initFAQ,
  "/terms": initTerms,
  "/terms.html": initTerms,
  "/privacy": initPrivacy,
  "/privacy.html": initPrivacy,
  "/newsletter": initNewsletter,
  "/newsletter.html": initNewsletter,
  "/login": initLogin,
  "/login.html": initLogin,
  "/register": initRegister,
  "/register.html": initRegister,
  "/user/dashboard": initUserDashboard,
  "/user/dashboard.html": initUserDashboard,
  "/user/my-bookings": initMyBookings,
  "/user/my-bookings.html": initMyBookings,
  "/user/payments": initPayments,
  "/user/payments.html": initPayments,
  "/user/wishlist": initWishlist,
  "/user/wishlist.html": initWishlist,
  "/user/profile": initProfile,
  "/user/profile.html": initProfile,
  "/host/dashboard": initHostDashboard,
  "/host/dashboard.html": initHostDashboard,
  "/host/add-car": initAddCar,
  "/host/add-car.html": initAddCar,
  "/host/manage-cars": initManageCars,
  "/host/manage-cars.html": initManageCars,
  "/host/earnings": initEarnings,
  "/host/earnings.html": initEarnings,
  "/admin/login": initAdminLogin,
  "/admin/login.html": initAdminLogin,
  "/admin/dashboard": initAdminDashboard,
  "/admin/dashboard.html": initAdminDashboard,
  "/admin/bookings": initAdminBookings,
  "/admin/bookings.html": initAdminBookings,
  "/admin/cars": initAdminCars,
  "/admin/cars.html": initAdminCars,
  "/admin/add-car": initAdminAddCar,
  "/admin/add-car.html": initAdminAddCar,
  "/admin/edit-car": initAdminEditCar,
  "/admin/edit-car.html": initAdminEditCar,
  "/admin/users": initAdminUsers,
  "/admin/users.html": initAdminUsers,
  "/admin/reports": initAdminReports,
  "/admin/reports.html": initAdminReports,
  "/admin/settings": initAdminSettings,
  "/admin/settings.html": initAdminSettings,
};

const initApp = () => {
  initTheme();
  initHeader();
  initFooter();

  const path = window.location.pathname;
  const routeInit = routes[path];

  if (routeInit) {
    routeInit();
  }

  resetLoader();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
