'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./app_server/config');
const logger = require('./app_server/logger');
const routes = require('./app_server/api/router');
const tokenMiddleware = require('./app_server/api/middleware/tokenMiddleware');

let app = express();
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(tokenMiddleware(config.get('token').secret).unless({
  path: [
    '/api/login',
    '/api/register',
  ],
}));

app.use('/', routes);

app.listen(config.get('port'), () => logger.info(`server listening on port ${config.get('port')}`));

module.exports = app;
