// index.js
import { program } from 'commander';
import inquirer from 'inquirer';
import { DevAuth } from '../controller/developer/developerAuth.js';
import { AuthManager } from '../services/authmanager.js';

// class init
const authManager = new AuthManager();
const devAuth = new DevAuth();

// Authentication commands
program
  .command('login')
  .description('Login to DevSnap')
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
        mask: '*'
      }
    ]);

    await authManager.login(answers.email, answers.password);
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

    await devAuth.signup(answers.email, answers.email, answers.companyName);
  });

// File upload commands
program
  .command('upload <filepath>')
  .description('Upload a file to Firebase Storage')
  .action(async (filepath) => {
    if (!currentUser) {
      console.log(chalk.red('Please login first!'));
      return;
    }

    const spinner = ora('Uploading file...').start();

    try {
      // Read file
      const file = fs.readFileSync(filepath);
      const filename = filepath.split('/').pop();

      // Create storage reference
      const storageRef = ref(storage, `uploads/${currentUser.uid}/${filename}`);

      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      spinner.succeed(chalk.green('File uploaded successfully!'));
      console.log(chalk.blue('Download URL:'), downloadURL);
    } catch (error) {
      spinner.fail(chalk.red(`Upload failed: ${error.message}`));
    }
  });

// List uploaded files command
program
  .command('list')
  .description('List uploaded files')
  .action(async () => {
    if (!currentUser) {
      console.log(chalk.red('Please login first!'));
      return;
    }

    const spinner = ora('Fetching files...').start();

    try {
      const storageRef = ref(storage, `uploads/${currentUser.uid}`);
      const files = await listAll(storageRef);
      
      spinner.succeed(chalk.green('Files retrieved successfully!'));
      
      files.items.forEach(async (fileRef) => {
        const url = await getDownloadURL(fileRef);
        console.log(chalk.blue(fileRef.name), '-', url);
      });
    } catch (error) {
      spinner.fail(chalk.red(`Failed to list files: ${error.message}`));
    }
  });

program.parse(process.argv);