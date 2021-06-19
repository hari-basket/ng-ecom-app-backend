const { models } = require('../../sequelize');
const sequelize = require('../../sequelize/index');
const { getIdParam } = require('../helpers');
const express = require('express');
const router = express.Router();

router.get(`/`, (req, res) => getAll(req, res));
router.get(`/:id`, (req, res) => getById(req, res));
router.get(`/user/:id`, (req, res) => getOrderByUser(req, res));
router.post(`/`, (req, res) => create(req, res));
router.put(`/:id`, (req, res) => update(req, res));
router.delete(`/:id`, (req, res) => remove(req, res));

async function getAll(req, res) {
    const addresses = await models.order.findAll({
        include: [
            {
                model: models.user,
                attributes: ['id', 'full_name', 'email', 'role_id', 'contact'],
            },
        ],
    });
    if (addresses) {
        res.status(200).json(addresses);
    } else {
        res.status(404).send('404 - Not found');
    }
}
async function getById(req, res) {
    const id = getIdParam(req);
    const addresses = await models.order.findByPk(id, {
        include: [
            {
                model: models.order_items,
                include: [
                    {
                        model: models.product,
                        attributes: ['name'],
                    },
                ],
            },
            {
                model: models.user,
                attributes: ['full_name'],
            },
        ],
    });
    if (addresses) {
        res.status(200).json(addresses);
    } else {
        res.status(404).send('404 - Not found');
    }
}

async function getOrderByUser(req, res) {
    const userId = getIdParam(req);
    const addresses = await models.order.findAll({
        where: {
            user_id: userId,
        },
    });
    if (addresses) {
        res.status(200).json(addresses);
    } else {
        res.status(404).send('404 - Not found');
    }
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(
            `Bad request: ID should not be provided, since it is determined automatically by the database.`
        );
    } else {
        let order, transaction;
        try {
            const userId = req.body.userId;
            transaction = await sequelize.transaction();
            // Note that we pass a callback rather than awaiting the call with no arguments
            order = await models.order.create(
                { user_id: userId },
                { transaction: transaction }
            );
            console.log('Order item', order);
            const reqPayload = req.body.items.map((item) => {
                return {
                    product_id: item['product_id'],
                    order_id: order.id,
                    quantity: item.quantity,
                    selling_price: item.selling_price,
                };
            });
            const success = await reqPayload.forEach(async (element) => {
                const product = await models.product.findByPk(
                    element.product_id,
                    {
                        attributes: ['id', 'available_units'],
                    }
                );
                if (!product || product['available_units'] < element.quantity) {
                    console.warn('Not enough stock');
                    return false;
                    // throw new Error(
                    //     'Not enough stock for product: ',
                    //     element.product_id
                    // );
                }
                await product.decrement(
                    'available_units',
                    {
                        by: element.quantity,
                    },
                    { transaction: transaction }
                );
                return true;
            });
            if (!success) {
                throw new Error('Not enough stock for product: ');
            }
            const orderItems = await models.order_items.bulkCreate(reqPayload, {
                transaction: transaction,
            });
            console.log(orderItems);
            transaction.commit();
        } catch (err) {
            transaction.rollback();
            // Rolled back
            console.error(err);
            res.status(400).json({ message: 'Failed to create order' });
        }
        res.status(201).json(order);
    }
}

async function update(req, res) {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
        await models.order.update(req.body, {
            where: {
                id: id,
            },
        });
        res.status(200).end();
    } else {
        res.status(400).send(
            `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
        );
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    try {
        transaction = await sequelize.transaction();
        await models.order_items.destroy({
            where: {
                order_id: id,
            },
        });
        await models.order.destroy({
            where: {
                id: id,
            },
        });
        transaction.commit();
    } catch (err) {
        transaction.rollback();
        console.error(err);
        res.status(400).json({ message: 'Failed to create order' });
    }
    res.status(201).json({ message: 'Order deleted successfully' });
}

module.exports = router;
