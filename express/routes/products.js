const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const path = require('path');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const extension = FILE_TYPE_MAP[file.mimetype];
        const fileName = file.originalname
            .replace(extension, '')
            .split(' ')
            .join('-');
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});
const uploadOptions = multer({ storage: storage });

router.route('/featured').get((req, res) => getFeatured(req, res));
router.get(`/:id`, (req, res) => getById(req, res));
router.get(`/`, (req, res) => getAll(req, res));
router.post(`/`, uploadOptions.single('product_img'), (req, res) =>
    create(req, res)
);
router.put(`/:id`, uploadOptions.single('product_img'), (req, res) =>
    update(req, res)
);
router.delete(`/:id`, (req, res) => remove(req, res));

async function getAll(req, res) {
    const product = await models.product.findAll();
    res.status(200).json(product);
}

async function getById(req, res) {
    const id = getIdParam(req);
    const product = await models.product.findByPk(id);
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send('404 - Not found');
    }
}
async function getFeatured(req, res) {
    const product = await models.product.findAll({
        where: {
            is_featured: true,
        },
    });
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send('404 - Not found');
    }
}

async function create(req, res) {
    try {
        if (req.body.id) {
            res.status(400).send(
                `Bad request: ID should not be provided, since it is determined automatically by the database.`
            );
        } else {
            const file = req.file;
            if (!file) {
                res.status(500).json({ message: 'No image attached' });
            }
            const fileName = req.file.filename;
            const baseUrl = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`;
            await models.product.create({
                ...req.body,
                product_url: `${baseUrl}${fileName}`,
            });
            res.status(201).end();
        }
    } catch (error) {
        return res.status(444).json(error);
    }
}

async function update(req, res) {
    const id = getIdParam(req);

    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.id) {
        const file = req.file;
        console.log(file);
        let imagePath;
        if (file) {
            const fileName = req.file.filename;
            const baseUrl = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`;
            imagePath = `${baseUrl}${fileName}`;
        } else {
            imagePath = req.body.product_url;
        }
        await models.product.update(
            { ...req.body, product_url: imagePath },
            {
                where: {
                    id: id,
                },
            }
        );
        res.status(200).end();
    } else {
        res.status(400).send(
            `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
        );
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    await models.product.destroy({
        where: {
            id: id,
        },
    });
    res.status(200).end();
}

module.exports = router;
