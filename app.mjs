import express, {json} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { RouteUsers } from './api/RouteUser.mjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(morgan('dev'));

// Rutas
app.use('/users', RouteUsers);

// Corremos servidor si no esta en produccion
if(process.env.NODE_ENV !== 'prod'){
    app.listen(process.env.PORT, () => {
        console.log(`Servidor escuchando en 
        http://localhost:${process.env.PORT}`);
    })
}

export default app;

