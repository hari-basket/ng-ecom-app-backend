const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
require('dotenv/config');

const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB,
    process.env.MYSQL_ADDON_USER,
    process.env.MYSQL_ADDON_PASSWORD,
    {
        host: process.env.MYSQL_ADDON_HOST,
        dialect: 'mysql',
    }
);

const modelDefiners = [
    require('./models/user.model'),
    require('./models/product.model'),
    require('./models/address.model'),
    require('./models/role.model'),
    require('./models/order.model'),
    require('./models/order-items.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// applying extra setup for relationship
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
