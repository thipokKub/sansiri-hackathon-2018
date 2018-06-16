'use strict'

// Import libraries
const express = require('express')

// Import controllers
const ProjectController = require('../controllers/controllerProjects');

// Define router
const router = express.Router()

router.route('/')
    .get(ProjectController.listAllProject)
    .post(ProjectController.createProject)
    .put(ProjectController.editProjectById)
    .delete(ProjectController.deleteProject);

router.route('/find')
    .get(ProjectController.findProjectByQuery);
    

module.exports = router;