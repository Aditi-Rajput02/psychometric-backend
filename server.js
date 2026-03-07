const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRouter = require('./routes/auth');

// basic route
app.get('/', (req, res) => {
  res.send('Career App Backend is running');
});

// use routers
app.use('/api/auth', authRouter);
app.use('/api/tests', require('./routes/tests'));
app.use('/api/results', require('./routes/results'));
app.use('/api/assessment', require('./controllers/comprehensiveController'));

// connect to database
const mongoUri = process.env.MONGO_URI ;

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
