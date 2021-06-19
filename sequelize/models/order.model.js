const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    sequelize.define(
        'order',
        {
            // The following specification of the 'id' attribute could be omitted
            // since it is the default.
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            status: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            total_price: DataTypes.FLOAT,
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        }
    );
};
