import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import taskRouter from './routes/taskRoutes.js';
import { FRONTEND_URL } from './config.js';

const app = express();

const corsOptions = {
    origin: FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE',  
    allowedHeaders: 'Content-Type',  
  };

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(taskRouter)

export default app;