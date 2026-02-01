// FILE: assets/js/base/config.js

export const CONFIG = {
  APP_NAME: 'CarRental',
  APP_VERSION: '1.0.0',
  
  API: {
    BASE_URL: '/api/v1',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },
  
  STORAGE: {
    PREFIX: 'cr_',
    TOKEN_KEY: 'cr_auth_token',
    USER_KEY: 'cr_user_data',
    CART_KEY: 'cr_cart',
    WISHLIST_KEY: 'cr_wishlist',
    THEME_KEY: 'cr_theme'
  },
  
  AUTH: {
    TOKEN_EXPIRY: 86400000, // 24 hours
    ROLES: {
      USER: 'user',
      HOST: 'host',
      ADMIN: 'admin'
    }
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100
  },
  
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[\d\s\-()]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50
  },
  
  ROUTES: {
    HOME: '/',
    ABOUT: '/about',
    SERVICES: '/services',
    CARS: '/cars',
    CAR_DETAILS: '/car-details',
    BOOKING: '/booking',
    BOOKING_CONFIRM: '/booking-confirm',
    CONTACT: '/contact',
    FAQ: '/faq',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    NEWSLETTER: '/newsletter',
    LOGIN: '/login',
    REGISTER: '/register',
    USER_DASHBOARD: '/user/dashboard',
    USER_BOOKINGS: '/user/my-bookings',
    USER_PAYMENTS: '/user/payments',
    USER_WISHLIST: '/user/wishlist',
    USER_PROFILE: '/user/profile',
    HOST_DASHBOARD: '/host/dashboard',
    HOST_ADD_CAR: '/host/add-car',
    HOST_MANAGE_CARS: '/host/manage-cars',
    HOST_EARNINGS: '/host/earnings',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_BOOKINGS: '/admin/bookings',
    ADMIN_CARS: '/admin/cars',
    ADMIN_ADD_CAR: '/admin/add-car',
    ADMIN_EDIT_CAR: '/admin/edit-car',
    ADMIN_USERS: '/admin/users',
    ADMIN_REPORTS: '/admin/reports',
    ADMIN_SETTINGS: '/admin/settings'
  },
  
  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Login successful! Welcome back.',
      REGISTER: 'Registration successful! Please login.',
      LOGOUT: 'Logged out successfully.',
      SAVED: 'Changes saved successfully.',
      DELETED: 'Item deleted successfully.',
      BOOKED: 'Booking confirmed successfully!'
    },
    ERROR: {
      GENERIC: 'Something went wrong. Please try again.',
      NETWORK: 'Network error. Please check your connection.',
      UNAUTHORIZED: 'Unauthorized access. Please login.',
      VALIDATION: 'Please check your input and try again.',
      NOT_FOUND: 'Requested resource not found.'
    }
  },
  
  CAR: {
    TYPES: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Electric'],
    FUEL_TYPES: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    TRANSMISSION: ['Manual', 'Automatic'],
    FEATURES: [
      'AC', 'GPS', 'Bluetooth', 'Parking Sensors',
      'Backup Camera', 'Sunroof', 'Cruise Control',
      'USB Charging', 'Child Seat', 'Music System'
    ]
  },
  
  BOOKING: {
    STATUS: {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      ONGOING: 'ongoing',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled'
    }
  },
  
  PAYMENT: {
    METHODS: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
    STATUS: {
      PENDING: 'pending',
      COMPLETED: 'completed',
      FAILED: 'failed',
      REFUNDED: 'refunded'
    }
  }
};