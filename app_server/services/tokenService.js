const jwt = require('jsonwebtoken');

const config = require('../config');

function jwtSign(data) {
  return new Promise(resolve => jwt.sign(
      data,
      config.get('token').secret,
      { expiresIn: config.get('token').expires, algorithm: config.get('token').algorithm },
      (err, token) =>  resolve(token)
    ));
}

module.exports = {
  jwtSign: jwtSign
};
