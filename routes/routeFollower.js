'use strict'

// Import libraries
const express = require('express')

// Import controllers
const FollowerController = require('../controllers/controllerFollower');

// Define router
const router = express.Router()

router.route('/')
    .get(FollowerController.getFollower)
    .post(FollowerController.createFollower)
    .put(FollowerController.editFollower)
    .delete(FollowerController.deleteFollower);

router.route('/all')
    .get(FollowerController.getAllFollower);

module.exports = router;