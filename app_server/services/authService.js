'use strict';

const bcrypt = require('bcrypt');

function validatePw(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  validatePw: validatePw
};
