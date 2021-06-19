const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    sequelize.define(
        'user',
        {
            // The following specification of the 'id' attribute could be omitted
            // since it is the default.
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            full_name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            email: {
                allowNull: true,
                type: DataTypes.STRING,
                unique: true,
            },
            role_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            contact: {
                allowNull: false,
                type: DataTypes.NUMBER(16, 0),
            },
            password_hash: {
                allowNull: true,
                type: DataTypes.STRING,
            },
        },
        {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        }
    );
};
