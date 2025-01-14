import express from 'express';
import { emailAndPasswordValidator } from './middleware/emailAndPasswordValidator.js';
import { protect } from './middleware/routeProtector.js';
import { DevAuth } from './controller/developer/developerAuth.js';
import DevSnap from './controller/snaps/snap.js';


const app = express();
app.use(express.json());
const snap = new DevSnap();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/signup', emailAndPasswordValidator, DevAuth.signup);
app.post('/login', snap.uploadFile);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});