'use strict'

const express = require('express')
const router = express.Router()

const test = require('./routeTest');
const project = require('./routeProject');

router.use('/test', test);
router.use('/project', project);

module.exports = router;