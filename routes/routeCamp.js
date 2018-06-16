'use strict'

// Import libraries
const express = require('express')

// Import controllers
const CampController = require('../controllers/controllerCamp');

// Define router
const router = express.Router()

router.route('/')
    .get(CampController.getCamp)
    .post(CampController.createCamp)
    .put(CampController.editCamp)
    .delete(CampController.deleteCamp);

router.route('/all')
    .get(CampController.getAllCamp);

module.exports = router;