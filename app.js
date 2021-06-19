const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const PORT = process.env.PORT || 3000;

const morgan = require('morgan');
const cors = require('cors');
const { authJwt, errHandler } = require('./express/helpers');
require('dotenv/config');
const api = process.env.API_URL;

app.use(cors());
// app.options('*', cors());
// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.use(`${api}/product`, require('./express/routes/products'));
app.use(`${api}/user`, require('./express/routes/users'));
app.use(`${api}/order`, require('./express/routes/order'));
app.use(`${api}/address`, require('./express/routes/address'));

// We provide a root route just as an example
app.get('/', (req, res) => {
    res.send(`Hello There!`);
});

module.exports = app;

async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

app.listen(PORT, () => {
    console.log(
        `Express server started on port ${PORT}. Try some routes, such as '/api/v1'.`
    );
});

async function init() {
    await assertDatabaseConnectionOk();
    console.log(`Starting Sequelize + Express example on port ${PORT}...`);
}

init();
