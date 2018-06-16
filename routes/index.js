'use strict'

const express = require('express')
const router = express.Router()

const test = require('./routeTest');
const camp = require('./routeCamp');
const supplier = require('./routeSupplier');


router.use('/test', test);
router.use('/camp', camp);
router.use('/supplier',supplier);

module.exports = router;