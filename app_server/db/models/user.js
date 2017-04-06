'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mongo = require('../mongo');

const schemaOptions = {
  toJSON: {
    virtuals: true
  },
  timestamps: true
};

/**
 * User Schema
 */
const userSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, schemaOptions);

userSchema.pre('save', function beforeSave(next) {
  const user = this;
  bcrypt.hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next(null, user);
    })
    .catch(next);
});

module.exports = mongo.model('User', userSchema);
