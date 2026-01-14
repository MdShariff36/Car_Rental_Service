export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const validatePassword = (pw) => pw.length >= 6;
export const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
