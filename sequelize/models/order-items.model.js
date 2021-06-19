const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    sequelize.define(
        'order_items',
        {
            // The following specification of the 'id' attribute could be omitted
            // since it is the default.
            order_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            product_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            quantity: {
                allowNull: false,
                type: DataTypes.DECIMAL,
            },
            selling_price: {
                allowNull: true,
                type: DataTypes.DECIMAL,
            },
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );
};
