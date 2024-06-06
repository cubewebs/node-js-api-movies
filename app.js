import express from 'express';
import { moviesRouter } from './routes/movies.js';
import {corsMiddleware} from "./moddlewares/cors.js";


const app = express();
app.use(express.json());
app.use(corsMiddleware());
app.disable('x-powered-by');
const PORT = process.env.PORT ?? 3000;

app.use('/movies', moviesRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});