'use strict'

// Import libraries
const express = require('express')

// Import controllers
const WorkerController = require('../controllers/controllerWorker');

// Define router
const router = express.Router()

router.route('/')
    .get(WorkerController.getWorker)
    .post(WorkerController.createWorker)
    .put(WorkerController.editWorker)
    .delete(WorkerController.deleteWorker);

module.exports = router;