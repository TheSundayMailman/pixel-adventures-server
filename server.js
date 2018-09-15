'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { PORT, MONGODB_URI, CLIENT_ORIGIN } = require('./config.js');
const localStrategy = require('./passport/local.js');
const jwtStrategy = require('./passport/jwt.js');

// Import routers for specific endpoints
const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const charactersRouter = require('./routes/characters.js');

// Configure Passport to utilize strategies, this just loads into memory
passport.use(localStrategy);
passport.use(jwtStrategy);

// Create an Express application
const app = express();

// Log all requests, skip logging during
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Create a static webserver
// app.use(express.static('public'));

// Parse request body
app.use(express.json());

// CORS
app.use(
  cors({ origin: CLIENT_ORIGIN })
);
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(204);
//   }
//   next();
// });

// Mount routers
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/characters', charactersRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Listen for incoming connections
if (process.env.NODE_ENV !== 'test') {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(err);
    });

  app.listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

// Export for testing
module.exports = app;
