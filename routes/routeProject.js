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
<<<<<<< HEAD
    .put(ProjectController.editProjectById)
    .delete(ProjectController.deleteProject);
=======
    .put(ProjectController.editProjectById);
>>>>>>> 14890a0a99a1718380155187d4b388a552bd6231

router.route('/find')
    .get(ProjectController.findProjectByQuery);
    

module.exports = router;