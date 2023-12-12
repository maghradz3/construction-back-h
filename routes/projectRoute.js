const express = require('express');
const multer = require('multer');

const {
  createProject,
  getAllProjects,
  uploadProjectImages,
  getProjectById
} = require('../controllers/projectController');

const router = express.Router();

router.post('/', uploadProjectImages, createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

module.exports = router;
