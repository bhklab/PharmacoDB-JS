const dotenv = require('dotenv');

dotenv.config();

// object storing configurations for development and production server.
module.exports = {
    development: {
        client: process.env.KNEX_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        },
        migrations: {
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            directory: `${__dirname}/db/seeds`
        }
    },
    production: {
        client: process.env.KNEX_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        },
        migrations: {
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            directory: `${__dirname}/db/seeds`
        }
    }
};
