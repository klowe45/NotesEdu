const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRequired = (value) => {
  return value && value.trim() !== '';
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired
};