import { DataTypes } from 'sequelize';


export default (sequelize) => {
    return sequelize.define(
        'Order',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            sum: {
                type: DataTypes.DECIMAL
            },
            user_id: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'waiting'
            }
        }
    );
};