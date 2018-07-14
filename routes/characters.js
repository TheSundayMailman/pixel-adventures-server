'use strict';

const express = require('express');
const passport = require('passport');

const Character = require('../models/character.js');

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

// Protects all endpoints, or each can be applied to specific handlers as below
// router.use(jwtAuth);

/* ========== GET/READ USER'S CHARACTERS ========== */
router.get('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id;

  let filter = {};

  if (userId) {
    filter.userId = userId;
  }

  Character
    .find(filter)
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A CHARACTER ========== */
router.get('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params;

  Character
    .find({_id: id})
    .then(results => {
      res.json(results[0]);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE A CHARACTER ========== */
router.post('/', jwtAuth, (req, res, next) => {
  const { name, job } = req.body;
  const userId = req.user.id;
  let newCharacter;

  if (job === 'KNIGHT') {
    newCharacter = {
      userId,
      name,
      job,
      level: 1,
      hp: {current: 20, max: 20},
      mp: {current: 10, max: 10},
      stats: {
        attack: 12,
        defense: 10,
        intelligence: 8
      },
      equipment: {
        weapon: 'BROAD-SWORD',
        armor: 'CHAIN-MAIL',
        accessory: 'MEDALLION'
      },
      skills: ['SHIELD-BASH'],
      items: [
        {id: 1, name: 'POTION', quantity: 3},
        {id: 3, name: 'ETHER', quantity: 1}
      ],
      exp: 0,
      gold: 100,
      nextLevel: 100
    };
  }
  if (job === 'WIZARD') {
    newCharacter = {
      userId,
      name,
      job,
      level: 1,
      hp: {current: 15, max: 15},
      mp: {current: 20, max: 20},
      stats: {
        attack: 10,
        defense: 8,
        intelligence: 12
      },
      equipment: {
        weapon: 'WOODEN-STAFF',
        armor: 'BLACK-ROBE',
        accessory: 'MAGIC-RING'
      },
      skills: ['FIRE'],
      items: [
        {id: 1, name: 'POTION', quantity: 5},
        {id: 3, name: 'ETHER', quantity: 3}
      ],
      exp: 0,
      gold: 100,
      nextLevel: 100
    };
  }
  if (job === 'CLERIC') {
    newCharacter = {
      userId,
      name,
      job,
      level: 1,
      hp: {current: 18, max: 18},
      mp: {current: 18, max: 18},
      stats: {
        attack: 8,
        defense: 12,
        intelligence: 10
      },
      equipment: {
        weapon: 'MACE',
        armor: 'CHAIN-MAIL',
        accessory: 'IRON-SHIELD'
      },
      skills: ['SHIELD-BASH'],
      items: [
        {id: 1, name: 'POTION', quantity: 3},
        {id: 3, name: 'ETHER', quantity: 3}
      ],
      exp: 0,
      gold: 100,
      nextLevel: 100
    };
  }

  Character
    .create(newCharacter)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    })
  ;
});

/* ========== PUT/UPDATE A SINGLE CHARACTER ========== */
router.put('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params;
  const updateCharacter = req.body;

  Character
    .findByIdAndUpdate({_id: id}, updateCharacter, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A CHARACTER ========== */
router.delete('/:id', jwtAuth, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  Character
    .findOneAndRemove({_id: id, userId})
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
