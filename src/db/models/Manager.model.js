import { DataTypes } from 'sequelize';


export default (sequelize) => {
    return sequelize.define(
        'Manager',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            telegramId: {
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING
            },
            user_chat_id: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'free'
            }
        }
    );
};