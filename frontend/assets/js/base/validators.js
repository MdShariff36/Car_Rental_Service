export const Validators = {
  required(value) {
    return value !== null && value !== "";
  },

  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  password(value) {
    return value.length >= 6;
  },
};
