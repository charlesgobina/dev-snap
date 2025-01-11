import express from 'express';

// import expressjson

import { DevAuth } from './controller/developer/developerAuth.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/login', DevAuth.login);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});