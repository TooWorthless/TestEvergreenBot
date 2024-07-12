import { Sequelize } from 'sequelize';
import UserModel from './models/User.model.js';
import ManagerModel from './models/Manager.model.js';
import OrderModel from './models/Order.model.js';


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db_storage/db.sqlite'
});


const User = UserModel(sequelize);
const Order = OrderModel(sequelize);
const Manager = ManagerModel(sequelize);


export {
    sequelize,
    User,
    Order,
    Manager
};