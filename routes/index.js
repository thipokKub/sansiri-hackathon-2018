'use strict'

const express = require('express')
const router = express.Router()

const test = require('./routeTest');

router.use('/test', test);

module.exports = router;