'use strict';

const User = require('../db/models/user');

function getByEmail(email) {
  return User.findOne({ email: email.toLowerCase() }).exec();
}

function getById(id) {
  return User.findById(id).exec();
}

function createUser(userData) {
  userData.email = userData.email.toLowerCase();
  return User.create(userData);
}

module.exports = {
  getByEmail: getByEmail,
  getById: getById,
  createUser: createUser
};
