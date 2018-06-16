'use strict'

// Import libraries
const express = require('express')

// Import controllers
const TestController = require('../controllers/controllerTest');

// Define router
const router = express.Router()

router.route('/')
    .get(TestController.listAllProject)
    .post(TestController.createProject)
    .put(TestController.editProjectById);
    
module.exports = router;