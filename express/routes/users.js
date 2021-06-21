const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

router.get(`/:id`, (req, res) => getById(req, res));
router.get(`/:payload`, (req, res) => getByLoginCred(req, res));
router.get(`/`, (req, res) => getAll(req, res));
router.post(`/`, (req, res) => create(req, res));
router.post(`/login`, (req, res) => loginUser(req, res));
router.put(`/:id`, (req, res) => update(req, res));
router.delete(`/:id`, (req, res) => remove(req, res));

async function getAll(req, res) {
    const users = await models.user.findAll({
        attributes: ['id', 'full_name', 'email', 'contact'],
        include: {
            model: models.role,
        },
    });
    res.status(200).json(users);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const user = await models.user.findByPk(id, {
        attributes: ['id', 'full_name', 'email', 'role_id', 'contact'],
    });
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('404 - Not found');
    }
}

async function getByLoginCred(req, res) {
    const payload = req.params.payload;
    const user = await models.user.findOneModel({
        where: {
            contact: payload,
        },
    });
}

async function create(req, res) {
    if (req.body.id) {
        res.status(400).send(
            `Bad request: ID should not be provided, since it is determined automatically by the database.`
        );
    } else {
        const payload = req.body;
        if (payload && payload['password']) {
            payload['password_hash'] = bcrypt.hash(payload['password'], 10);
            delete payload['password'];
        }
        await models.user.create(payload);
        res.status(201).end();
    }
}

async function update(req, res) {
    const id = getIdParam(req);
    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id === id) {
        const payload = req.body;
        console.log(payload);
        if (payload && payload['password']) {
            payload['password_hash'] = await bcrypt.hash(
                payload['password'],
                10
            );
            delete payload['password'];
        }
        console.log('2', payload);
        await models.user.update(payload, {
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
    await models.user.destroy({
        where: {
            id: id,
        },
    });
    res.status(200).end();
}

async function loginUser(req, res) {
    const where = {};
    try {
        if (req.body.email) {
            where['email'] = req.body.email;
        } else {
            where['contact'] = req.body.contact;
        }
        const user = await models.user.findOne({
            where: where,
            attributes: [
                'id',
                'full_name',
                'email',
                'contact',
                'password_hash',
            ],
        });
        if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    roleId: user.role_id,
                },
                process.env.SECRET,
                { expiresIn: '1w' }
            );
            res.status(200).json({
                success: true,
                user: user.email,
                name: user.full_name,
                token: token,
            });
        } else {
            res.status(404).json({
                status: false,
                message: '404 - User not found',
            });
        }
    } catch (error) {
        console.warn(error);
        res.status(500).json({
            status: false,
            message: 'Failed to authenticate user.',
        });
    }
}
module.exports = router;
