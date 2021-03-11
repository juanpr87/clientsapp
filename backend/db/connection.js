'use strict';

const debug = require('debug')('clientsapp:server');
const mongoose = require('mongoose');

const settings = require('../settings/db');

// this will hold our cached database connection, which will itself hold multiple connections in a pool to be used
let connection;

module.exports = {
  /**
    * Connects to the DB
    * @param next callback with 2 params:
    *   - the first is an error object
    *   - the second is the mongoose connection object
    */
  connect: function(next) {
    // already established? => return connection
    if (connection && connection.readyState === 1) {
      debug('Already connected. Returning connection');
      return next(undefined, connection);
    }

    // establish connection
    mongoose.connect(settings.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: settings.dbName
    });

    connection = mongoose.connection;

    connection.on('error', function(err) {
      console.error('Connection error: ', err);
      next(err, undefined);
    });

    connection.once('open', function() {
      // we're connected!
      debug('Connection established');
      next(undefined, connection);
    });
  },

  /**
    * Disconnects from the DB
    * @param next callback with 1 param:
    *   - an error object
    */
  disconnect: function(next) {
    // close all connections
    mongoose.disconnect(function(err) {
      if (err) {
        console.error('Error during disconnection: ', err);
      }
      if (next) {
        next(err);
      }
    });
  }
};
