'use strict'

// Import libraries
const express = require('express')
const multer = require('multer');

// Import controllers
const WorkerController = require('../controllers/controllerWorker');
const { uploadWorkerPhotoStorage, uploadPictureFilter } = require('../helper');
// Define router
const router = express.Router()

const uploadWorkerPhoto = multer({
    storage: uploadWorkerPhotoStorage,
    fileFilter: uploadPictureFilter,
    limits: { fileSize: parseInt(process.env.UPLOAD_MAX_FILESIZE) }
});

router.route('/')
    .get(WorkerController.getWorker)
    .post(WorkerController.createWorker)
    .put(WorkerController.editWorker)
    .delete(WorkerController.deleteWorker);

router.route('/all')
    .get(WorkerController.getAllWorker);

router.route('/upload/:id')
    .post(uploadWorkerPhoto.single('picture'), WorkerController.uploadPhoto);

module.exports = router;