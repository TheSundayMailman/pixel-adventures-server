'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config.js');

const User = require('../models/user.js');

const seedUsers = require('../db/seed/users.json');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      User.insertMany(seedUsers),
      User.createIndexes(),

    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
