const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const fileUpload = require('express-fileupload');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

const corsOptions = {
    origin: ['http://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

const db = require("./models");
db.sequelize.sync({
    // force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

require('./routers')(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: 'Ocurrió un error interno en el servidor.',
        error: err.message,
    });
});


app.listen(3000, function () {
    console.log('Ingrese a http://localhost:3000')
})