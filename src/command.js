import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DevAuth } from "../controller/developer/developerAuth.js";
import inquirer from 'inquirer'

yargs(hideBin(process.argv))
  .command(
    "login",
    "log into devsnap",
    (yargs) => {
      // yargs.option("env", {
      //   alias: "e",
      //   type: "string",
      //   description: "The path to the .env file",
      //   demandOption: true,
      // });
      // yargs.option("output", {
      //   alias: "o",
      //   type: "string",
      //   description: "The path to save the encrypted file",
      //   demandOption: true,
      // });
    },
    async (argv) => {

      try {
        // Prompt for email
        const { email } = await inquirer.prompt({
          type: "input",
          name: "email",
          message: "Enter your email",
        });

        // Prompt for password
        const { password } = await inquirer.prompt({
          type: "password",
          name: "password",
          message: "Enter your password",
        });

        const { companyName } = await inquirer.prompt({
          type: "input",
          name: "companyName",
          message: "Enter your company name",
        });

        console.log(email, password, companyName);
        
        let customToken = await DevAuth.DeveloperSignup(email, password, companyName);
        console.log('Custom token:', customToken);
      
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  )
  .option("set-secret", {
    alias: "s",
    type: "boolean",
    description: "Set the shared secret",
  })
  .demandCommand(1)
  .parse();
