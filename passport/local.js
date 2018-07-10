'use strict';

const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user.js');

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  let currentUser;
  User
    .findOne({username})
    .then(user => {
      currentUser = user;
      if (!currentUser) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return currentUser.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return done(null, currentUser);
    })
    .catch(err => {
      console.log(err);
      if (err.reason === 'LoginError') {
        return done(null, false, err);
      }
      return done(err, false);
    });
});

module.exports = localStrategy;
