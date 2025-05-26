import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { jwtStrategy } from './configs/strategies/jwt.strategy.js';
import passport from 'passport';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
app.use(cors());
app.options('*', cors());

app.use('/api', router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
