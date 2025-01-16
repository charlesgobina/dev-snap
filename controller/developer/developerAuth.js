import DeveloperModel from "../../model/developerModel.js";
import DeveloperService from "../../services/developerService.js";
import { hashPassword } from "../../utils/passwordHashing.js";
import { AuthManager } from "../../services/authmanager.js";
import {
  validateEmail,
  validatePassword,
} from "../../utils/emailAndPasswordValidationHelper.js";
import app from "../../config/config.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import ora from 'ora';
import chalk from "chalk";

class DevAuth {
  constructor() {
    this.auth = getAuth(app);
  }

  // for express
  async signup(email, password, companyName) {
    let currentUser = null;

    validateEmail(email);
    validatePassword(password);

    const spinner = ora('Signing up...').start();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      currentUser = userCredential.user;
      // hash password
      const hashedPassword = hashPassword(password);
      const developerData = new DeveloperModel(
        currentUser.uid,
        email,
        hashedPassword,
        companyName
      );
      DeveloperService.saveDeveloperData(
        currentUser.uid,
        developerData.toJSON()
      );
      spinner.succeed(chalk.green("Account created successfully!"));
      try {
        const spinner = ora('Logging in...').start();
        const authManager = new AuthManager();
        console.log(email)
        console.log(password)
        await authManager.login(email, password);
        spinner.succeed(chalk.green("Login successful!"));
      } catch (error) {
        spinner.fail(chalk.red(`Login failed: ${error.message}`));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Registration failed: ${error.message}`));
    }
  }
}

export { DevAuth };
