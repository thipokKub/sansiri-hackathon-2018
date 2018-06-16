'use strict'

// Import libraries
const express = require('express')

// Import controllers
const TestController = require('../controllers/controllerTest');

// Define router
const router = express.Router()

router.route('/')
    .get(TestController.getTest)
    .post(TestController.createProject);


module.exports = router;