'use strict'

// Import libraries
const express = require('express')

// Import controllers
const StatController = require('../controllers/controllerStat');

// Define router
const router = express.Router()

router.route('/getTotalNationality')
    .get(StatController.getTotalNationality);
router.route('/getCampNationalityCount')
    .get(StatController.getCampNationalityCount);
router.route('/getTotalCount')
    .get(StatController.getTotalCount);

module.exports = router;