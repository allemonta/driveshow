const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT

/* APP CONFIG */
const cors = require('cors')
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* MONGODB */
const db = require('./db/mongoose');
const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(db)
//DefaultDevice.schema.plugin(autoIncrement.plugin, { model: 'DefaultDevice', field: 'position' })

/* ROUTER */
const testRouter = require('./routers/testRouter')
app.use('/api', testRouter)

/* ERROR HANDLER */
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        error: err.message,
        errors: err.errors,
    });
});

/* NOT FOUND */
app.get("*", (req, res) => {
    res.send({ error: "not found" })
});

/* START SERVER */
app.listen(port, () => {
    console.log('[App] Server is up on port ' + port);
});