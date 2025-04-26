import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/api', router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
