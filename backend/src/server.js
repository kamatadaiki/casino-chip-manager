require('dotenv').config();
const express = require('express');
const chipRouter = require('./routes/chip');

const app = express();
app.use(express.json());
app.use('/api/chips', chipRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});