'use strict'

const express = require('express')
const router = express.Router()

const test = require('./routeTest');
const camp = require('./routeCamp');
const supplier = require('./routeSupplier');
const worker = require('./routeWorker');


router.use('/test', test);
router.use('/camp', camp);
router.use('/supplier',supplier);
router.use('/worker',worker);

module.exports = router;