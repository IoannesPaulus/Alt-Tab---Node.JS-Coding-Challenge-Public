'use strict';

const _ = require('lodash');
const express = require('express');
const router = express.Router();
const userService = require('../../services/userService');
const authService = require('../../services/authService');
const tokenService = require('../../services/tokenService');

function register(req, res, next) {
  if (!req.body.email) {
    res.status(400).json({
      error: 'E-mail field is mandatory!'
    });
  } else if (!req.body.password) {
    res.status(400).json({
      error: 'Please specify a password!'
    });
  } else {
    userService.getByEmail(req.body.email).then((user) => {
      if (user) {
        return [user, 'This e-mail address is already registered!'];
      }
      return Promise.all([userService.createUser(req.body), Promise.resolve('')]);
    }).then(([user, error]) => {
      if (!error) {
        return Promise.all([tokenService.jwtSign({ userId: user._id }), Promise.resolve('')]);
      }
      return ['', error];
    }).then(([token, error]) => {
      if (error) {
        res.status(400).json({
          error
        });
      } else {
        res.status(201).json({ token });
      }
    })
      .catch(next);
  }
}

function login(req, res, next) {
  if (!req.body.email) {
    res.status(400).json({
      error: 'Please specify E-mail!'
    });
  } else if (!req.body.password) {
    res.status(400).json({
      error: 'Please specify a password!'
    });
  } else {
    userService.getByEmail(req.body.email).then((user) => {
      if (!user) {
        return [false, ''];
      }
      return Promise.all([
        authService.validatePw(req.body.password, user.password),
        Promise.resolve(user._id)
      ]);
    }).then(([valid, userId]) => {
      if (!valid) {
        return '';
      }
      return tokenService.jwtSign({ userId });
    }).then((token) => {
      if (!token) {
        res.status(400).json({
          error: 'Wrong credentials!'
        });
      } else {
        res.status(200).json({ token });
      }
    })
      .catch(next);
  }
}

function logout(req, res) {
  if (!req.userId) {
    res.status(200).json({
      warning: 'Not logged in!'
    });
  } else {
    res.status(200).json({ token: 'invalid' });
  }
}

function profile(req, res, next) {
  if (!req.userId) {
    res.status(401).json({
      error: 'Not Authorized!'
    });
  } else {
    userService.getById(req.userId).then((user) => {
      res.status(200).json(_.omit(user.toJSON(), ['password']));
    }).catch(next);
  }
}

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', profile);

module.exports = router;
