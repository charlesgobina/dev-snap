import { validateEmail, validatePassword } from "../utils/emailAndPasswordValidationHelper.js";

export const emailAndPasswordValidator = (req, res, next) => {
  const { email, password } = req.body;
  validateEmail(email);
  validatePassword(password);
  next();
}
