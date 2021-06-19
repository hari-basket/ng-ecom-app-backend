const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'address',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            primary: {
                type: DataTypes.BOOLEAN,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                unique: true,
            },
            line_one: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            line_two: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            city: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            state: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            country: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            pin: {
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );
};
