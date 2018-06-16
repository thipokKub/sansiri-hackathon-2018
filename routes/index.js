'use strict'

const express = require('express')
const router = express.Router()

const test = require('./routeTest');
<<<<<<< HEAD
const project = require('./routeProject');
const camp = require('./routeCamp');

router.use('/test', test);
router.use('/project', project);
router.use('/camp', camp);
=======
const camp = require('./routeCamp');
const supplier = require('./routeSupplier');
const worker = require('./routeWorker');


router.use('/test', test);
router.use('/camp', camp);
router.use('/supplier',supplier);
router.use('/worker',worker);
>>>>>>> 14890a0a99a1718380155187d4b388a552bd6231

module.exports = router;