// index.js
import { program } from 'commander';
import inquirer from 'inquirer';
import { DevAuth } from '../controller/developer/developerAuth.js';
import DevSnapInit from '../controller/snaps/init.js';
import DevSnap from '../controller/snaps/snap.js';
import { AuthManager } from '../services/authmanager.js';

// class init
const authManager = new AuthManager();
const devAuth = new DevAuth();
const devSnapInit = new DevSnapInit();
const devSnap = new DevSnap();

// Authentication commands
program
  .command('login')
  .description('Login to DevSnap')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: 'Enter your email:',
          validate: (value) => value.includes('@')
        },
        {
          type: 'password',
          name: 'password',
          message: 'Enter your password:',
          mask: '*'
        }
      ]);
      await authManager.login(answers.email, answers.password);

    } catch (error) {
      console.error('Login failed:', error.message);
    }

  });

program
  .command('register')
  .description('Register a new user')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email:',
        validate: (value) => value.includes('@')
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your password:',
        mask: ''
      },
      {
        type: 'input',
        name: "companyName",
        message: "Which company do you work for?"
      }
    ]);

    await devAuth.signup(answers.email, answers.password, answers.companyName);
  });

// DevSnap core commands
program
  .command('snap')
  .description('Snap working directory')
  .action(async () => {
    await devSnap.snap()
  });

program
  .command('init')
  .description('Initialize DevSnap for any project')
  .action(async () => {
    DevSnapInit.init();
  })

program.parse(process.argv);