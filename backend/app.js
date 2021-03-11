'use strict';

const debug = require('debug')('clientsapp:server');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');
const swaggerDocRouter = require('./routes/swagger-doc');
const swaggerRouter = require('./routes/swagger');

const dbModels = require('./db/models');

const app = express();

debug('Configuring server...');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api-docs', swaggerDocRouter);
app.use('/', swaggerRouter);

debug('Defining models...');
dbModels.defineModels();

module.exports = app;

