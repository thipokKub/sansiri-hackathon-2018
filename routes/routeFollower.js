'use strict'

// Import libraries
const express = require('express');
const multer = require('multer');

// Import controllers
const FollowerController = require('../controllers/controllerFollower');
const { uploadFollowerPhotoStorage, uploadTempPhotoStorage, uploadPictureFilter } = require('../helper');

const uploadFollowerPhoto = multer({
    storage: uploadFollowerPhotoStorage,
    fileFilter: uploadPictureFilter,
    limits: { fileSize: parseInt(process.env.UPLOAD_MAX_FILESIZE) }
});

// Define router
const router = express.Router()

router.route('/')
    .get(FollowerController.getFollower)
    .post(FollowerController.createFollower)
    .put(FollowerController.editFollower)
    .delete(FollowerController.deleteFollower);

router.route('/all')
    .get(FollowerController.getAllFollower);

router.route('/find')
    .get(FollowerController.findFollowerByName);

router.route('/upload/:id')
    .post(uploadFollowerPhoto.single('picture'), FollowerController.uploadPhoto);

router.route('/searchpic')
    .post(uploadTempPhotoStorage.single('picture'), FollowerController.searchChildren);

module.exports = router;