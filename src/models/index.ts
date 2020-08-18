import { Sequelize } from 'sequelize';
import { db } from './settings';


const sequelize = new Sequelize(db);

const sync = sequelize.createSchema(db.database, {}).then(() => {
    return sequelize.sync();
});

export {
    sequelize,
    Sequelize
}