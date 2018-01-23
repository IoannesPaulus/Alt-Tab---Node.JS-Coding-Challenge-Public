'use strict';

const unless = require('express-unless');
const jwt = require('jsonwebtoken');

const ErrorWithStatus = require('../errors').ErrorWithStatus;

function jwtVerify(token, secret) {
  return new Promise((resolve, reject) => jwt.verify(
    token,
    secret,
    (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    }
  ));
}

module.exports = (secret) => {
  const middleware = function innerTokenMiddleware(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization;
    if (!token || token.indexOf('Bearer ') !== 0) {
      return next();
    }
    const tokenString = token.split(' ')[1];

    return jwtVerify(tokenString, secret).then((decoded) => {
      req.token = decoded;
      req.userId = decoded.userId;
      return next();
    }).catch((error) => {
      if (error instanceof jwt.TokenExpiredError || error.message === 'jwt malformed') {
        return next(new ErrorWithStatus(error.message, 498));
      }
      return next(error);
    });
  };

  middleware.unless = unless;

  return middleware;
};
