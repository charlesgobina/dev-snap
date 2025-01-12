import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DevAuth } from "../controller/developer/developerAuth.js";
import DevSnapInit from "../controller/snaps/init.js";
import inquirer from 'inquirer'

yargs(hideBin(process.argv))
  .command(
    "init",
    "Prepare the project for DevSnap",
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
        DevSnapInit.init();
      } catch (error) {
        console.error("Error:", error.message);  // setup project to detect production environment
        // and show appropriate error messages based on the environment
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
