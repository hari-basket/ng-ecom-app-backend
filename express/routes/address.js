const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const express = require('express');
const router = express.Router();

router.get(`/:id`, (req, res) => getById(req, res));
router.post(`/`, (req, res) => create(req, res));
router.put(`/`, (req, res) => update(req, res));
router.delete(`/`, (req, res) => remove(req, res));

async function getById(req, res) {
    const id = getIdParam(req);
    const addresses = await models.address.findAll({
        where: {
            user_id: id,
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
        await models.address.create(req.body);
        res.status(201).end();
    }
}

async function update(req, res) {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
        await models.address.update(req.body, {
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
    await models.address.destroy({
        where: {
            id: id,
        },
    });
    res.status(200).end();
}

module.exports = router;
