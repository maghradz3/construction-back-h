require('dotenv').config();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const compression = require('compression');
const projectRouter = require('./routes/projectRoute');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use('/api/projects', projectRouter);
app.options('*', cors());

app.use(compression());

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(con => console.log('DB connection succesful'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
