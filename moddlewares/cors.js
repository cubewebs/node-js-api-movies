import cors from "cors";

const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://localhost:8080'];

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {

        if(acceptedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
})