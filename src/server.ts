import express, { Request, Response } from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import bodyParser from 'body-parser';
const serviceAccount = require('../serviceKey.json');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

import generalEndpoints from  './routes/general';
import epicEndpoints from './routes/epicManagement';
import incidentEndpoints from './routes/incidentManagement'

const app = express();

app.use(cors());
app.use(morgan('dev'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();

app.use(bodyParser.json());
app.use('/calend', generalEndpoints);
app.use('/calend', epicEndpoints);
app.use('/calend', incidentEndpoints);

const server = app.listen(PORT, HOST, () => {
  console.log(`🚗    Server zooming on port ${PORT}!    🚗`);
});

app.use(errorHandler());

process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
