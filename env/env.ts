import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === 'development') {
    dotenv.config({path: path.join(__dirname, './.env.development')});
} else if(process.env.NODE_ENV === 'test') {
    dotenv.config({path: path.join(__dirname, './.env.test')});
} else if(process.env.NODE_ENV === 'production') {
    dotenv.config({path: path.join(__dirname, './.env.production')});
}

export default {
    API_URL: process.env.API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
}