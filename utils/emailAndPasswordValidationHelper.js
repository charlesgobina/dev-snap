
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    throw new Error('Invalid email format. Please provide a valid email address.');
  }
}

const validatePassword = (password) => {
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be a string with at least 6 characters.');
  }
}

const trimmer = (data) => {
  if (typeof data === 'string') {
    return data.trim();
  }
  return data;
}

export {
  validateEmail,
  validatePassword,
  trimmer
}