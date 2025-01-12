import express from 'express';
import { emailAndPasswordValidator } from './middleware/emailAndPasswordValidator.js';
import { protect } from './middleware/routeProtector.js';
import { DevAuth } from './controller/developer/developerAuth.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/signup', emailAndPasswordValidator, DevAuth.signup);
app.post('/login', protect, DevAuth.login);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});