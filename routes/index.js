'use strict'

const express = require('express')
const router = express.Router()

const project = require('./routeProject');
const camp = require('./routeCamp');
const follower = require('./routeFollower');
const supplier = require('./routeSupplier');
const worker = require('./routeWorker');
const stats = require('./routeStats');

router.use('/project', project);
router.use('/camp', camp);
router.use('/follower', follower);
router.use('/supplier', supplier);
router.use('/worker', worker);
router.use('/stats', stats);

module.exports = router;