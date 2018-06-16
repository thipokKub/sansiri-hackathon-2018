'use strict'

const express = require('express')
const router = express.Router()

const test = require('./routeTest');
const camp = require('./routeCamp');

router.use('/test', test);
router.use('/camp', camp);

module.exports = router;