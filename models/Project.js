const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A project must have a title']
  },
  description: {
    type: String,
    required: [true, 'A project must have an Description']
  },
  startingAt: { type: Date, default: Date.now },
  finishedAt: { type: Date, default: Date.now },
  photos: [String] // storing photo URLs
});

module.exports = mongoose.model('Project', projectSchema);
