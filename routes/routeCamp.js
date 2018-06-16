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

<<<<<<< HEAD
router.route('/all')
    .get(CampController.getAllCamp);

=======
>>>>>>> 14890a0a99a1718380155187d4b388a552bd6231
module.exports = router;