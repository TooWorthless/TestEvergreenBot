import { DataTypes } from 'sequelize';


export default (sequelize) => {
    return sequelize.define(
        'User',
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
            surname: {
                type: DataTypes.STRING
            },
            phone: {
                type: DataTypes.STRING
            },
            place: {
                type: DataTypes.STRING
            },
            telegramName: {
                type: DataTypes.STRING
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'ok'
            }
        }
    );
};