'use strict'

// Import libraries
const express = require('express')

// Import controllers
const SupplierController = require('../controllers/controllerSupplier');

// Define router
const router = express.Router()

router.route('/')
    .get(SupplierController.getSupplier)
    .post(SupplierController.createSupplier)
    .put(SupplierController.editSupplier)
    .delete(SupplierController.deleteSupplier);

module.exports = router;