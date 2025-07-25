require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'henrique_store',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: process.env.DB_LOGGING === 'true'
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'henrique_store_test',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: false
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: process.env.DB_LOGGING === 'true'
    }
};
