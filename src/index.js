import express from "express";
import routes from './routes.js';
import cors from 'cors';
import 'dotenv/config';

const api = express();
const PORT = process.env.PORT || 3333;

api.use(cors());
api.use(express.json());

api.use('/', routes);

api.get('/', (req, res) => {
  res.status(200).send({
      message: 'Welcome to Fatec-Expo-Week API'
  });
});

api.listen(PORT, () => {
  console.log('Server is Running...');
});