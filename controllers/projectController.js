const Project = require('../models/Project');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { now } = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multerStorage = multer.memoryStorage();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImageToCloudinary(fileBuffer) {
  try {
    const imageBase64 = fileBuffer.toString('base64');
    const fileData = `data:image/jpeg;base64,${imageBase64}`;

    const uploadResponse = await cloudinary.uploader.upload(fileData);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

async function processImage(fileBuffer) {
  return sharp(fileBuffer)
    .resize(800, 800) // Resize to width 800px, keeping aspect ratio
    .toFormat('jpeg')
    .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
    .toBuffer(); // Convert back to a buffer
}

exports.uploadProjectImages = upload.array('photos');

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    let photoUrls = [];
    console.log(req.files);

    if (req.files) {
      const uploadPromises = req.files.map(async file => {
        const processedBuffer = await processImage(file.buffer);
        return uploadImageToCloudinary(processedBuffer);
      });
      photoUrls = await Promise.all(uploadPromises);
    }

    const newProject = new Project({
      title,
      description,
      photos: photoUrls
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId || !projectId.match(/^[0-9a-fA-F]{24}$/)) {
      // Check if the ID is a valid MongoDB ObjectId
      return res.status(400).send('Invalid Project ID');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    res.json(project);
  } catch (error) {
    res.status(500).send('Server error');
  }
};
