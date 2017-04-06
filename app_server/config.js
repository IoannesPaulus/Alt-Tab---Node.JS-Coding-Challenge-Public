'use strict';

const convict = require('convict');
// Define a schema
const conf = convict({
  name: {
    doc: 'The application name.',
    format: '*',
    default: 'Coding Challenge',
    env: 'APP_NAME',
    arg: 'name'
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'env'
  },
  logLevel: {
    doc: 'Logging level.',
    format: ['info', 'warn', 'error'],
    default: 'info',
    env: 'LOG_LEVEL',
    arg: 'logLevel'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  token: {
    secret: {
      doc: 'Secret used for token creation.',
      format: String,
      default: 'TESTSECRET',
      env: 'TOKEN_SECRET',
      arg: 'tokenSecret'
    },
    expires: {
      doc: 'Indicates when the token will expire IN SECONDS.',
      format: Number,
      default: 18000,
      env: 'TOKEN_EXPIRES',
      arg: 'tokenExpires'
    },
    algorithm: {
      doc: 'Algorithm that is used to hash secrets.',
      format: String,
      default: 'HS256',
      env: 'TOKEN_ALGORITHM',
      arg: 'tokenAlgorithm'
    },
  },
  database: {
    host: {
      format: String,
      default: 'localhost',
      env: 'MONGO_HOSTNAME'
    },
    dbname: {
      format: String,
      default: 'challenge',
      env: 'MONGO_DB_NAME'
    },
    port: {
      format: 'port',
      default: 27017,
      env: 'MONGO_PORT'
    },
    username: {
      format: String,
      default: '',
      env: 'MONGO_USERNAME'
    },
    password: {
      format: String,
      default: '',
      env: 'MONGO_PASSWORD'
    }
  }
});

// Perform validation
conf.validate({ allowed: 'strict' });

module.exports = conf;
