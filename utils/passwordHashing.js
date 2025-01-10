import crypto from 'crypto'

// Function to hash a password
const hashPassword = (plainPassword) => {
  const salt = crypto.randomBytes(16).toString('hex'); // Generate a random 16-byte salt
  const hashedPassword = crypto
      .pbkdf2Sync(plainPassword, salt, 100000, 64, 'sha512')
      .toString('hex'); // Derive a key using PBKDF2
  return { salt, hashedPassword };
}


// Function to verify a password
const verifyPassword = (plainPassword, hashedPassword, salt) => {
  const derivedPassword = crypto
      .pbkdf2Sync(plainPassword, salt, 100000, 64, 'sha512')
      .toString('hex');
  return hashedPassword === derivedPassword;
}

export {
  hashPassword,
  verifyPassword
}
