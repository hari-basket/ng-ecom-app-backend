const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    sequelize.define(
        'product',
        {
            // The following specification of the 'id' attribute could be omitted
            // since it is the default.
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            product_desc: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            price: {
                allowNull: false,
                type: DataTypes.DOUBLE,
            },
            available_units: {
                allowNull: false,
                default: 0,
                type: DataTypes.FLOAT,
                min: 0,
            },
            selling_unit: {
                allowNull: false,
                type: DataTypes.ENUM('kg', 'pieces', 'packets'),
            },
            allowed_discount: {
                allowNull: false,
                default: 0,
                type: DataTypes.INTEGER,
            },
            status: {
                allowNull: true,
                type: DataTypes.ENUM('out_of_stock', 'in_stock', 'running_low'),
            },
            product_url: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            rich_desc: {
                type: DataTypes.STRING,
            },
            product_urls: {
                type: DataTypes.STRING,
            },
            is_featured: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        }
    );
};
