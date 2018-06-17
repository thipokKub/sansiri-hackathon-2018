'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
    useMongoClient: true
})
mongoose.Promise = global.Promise

const app = express()

app.use(cors());
app.use(express.static(path.resolve('./public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));

const router = require('./routes');
app.use('/register/', router);

app.listen(process.env.PORT, () => console.log(`Sansiri API server start in ${app.get('env')} mode at port ${process.env.PORT}`))

module.exports = app

