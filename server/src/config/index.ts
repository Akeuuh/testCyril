import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    apiBaseUrl: 'https://evaluation-technique.lundimatin.biz/api',
    nodeEnv: process.env.NODE_ENV || 'development'
};

