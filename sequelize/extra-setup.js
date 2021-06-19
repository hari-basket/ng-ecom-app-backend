function applyExtraSetup(sequelize) {
    const { user, address, product, role, order, order_items } =
        sequelize.models;

    user.hasMany(address);
    address.belongsTo(user);
    role.hasOne(user);
    user.belongsTo(role);
    user.hasMany(order);
    order.belongsTo(user);
    product.hasMany(order_items);
    order_items.belongsTo(product);
    order.hasMany(order_items);
    order_items.belongsTo(order);
}

module.exports = { applyExtraSetup };
