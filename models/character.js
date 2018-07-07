'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CharacterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: {type: String, required: true},
  job: { type: String, required: true },
  level: {type: Number},
  hp: {},
  mp: {},
  stats: {},
  equipment: {},
  skills: [],
  items: [],
  exp: {type: Number},
  gold: {type: Number},
  nextLevel: {type: Number}
});

// Add `createdAt` and `updatedAt` fields
CharacterSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
CharacterSchema.set('toObject', {
  virtuals: true, // include built-in virtual `id`
  versionKey: false, // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Character', CharacterSchema);
