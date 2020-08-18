import { Options } from 'sequelize';

export const db: Options = {
    username: process.env.DATABASE_ID,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-9'
    }
};
