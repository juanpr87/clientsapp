'use strict';

const clientDao = require('../../db/client-dao');
const utils = require('../utils/writer.js');

/**
 * Deletes a client
 *
 * clientId String Client's ID to use
 * returns Client
 **/
exports.clientsClientIdDELETE = function(clientId) {
  return new Promise(function(resolve, reject) {
    clientDao.deleteClient(clientId, function(err, result) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        if (result.ok == 1 && result.n == 1) {
          // Operation OK
          resolve({
            result: 'OK',
            affectedNumber: result.deletedCount
          });
        } else if (result.ok == 1 && result.n == 0) {
          reject(utils.respondWithCode(404, {
            message: 'Client not found',
            code: 4040
          }));
        } else if (result.ok == 0) {
          reject(utils.respondWithCode(500, {
            message: 'Error occurred in DB operation',
            code: 5001
          }));
        }
      }
    });
  });
}

/**
 * Updates a client
 *
 * body Client Client to update (optional)
 * clientId String Client's ID to use
 * returns Client
 **/
exports.clientsClientIdPUT = function(body, clientId) {
  return new Promise(function(resolve, reject) {
    body.id = clientId;
    clientDao.updateClient(body, clientId, function(err, result) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        if (result.ok == 1 && result.n == 1) {
          // Operation OK
          resolve({
            result: 'OK',
            affectedNumber: result.nModified
          });
        } else if (result.ok == 1 && result.n == 0) {
          reject(utils.respondWithCode(404, {
            message: "Client not found",
            code: 4040
          }));
        } else if (result.ok == 0) {
          reject(utils.respondWithCode(500, {
            message: "Error occurred in DB operation",
            code: 5001
          }));
        }
      }
    });
  });
}

/**
 * Returns all clients from the system
 *
 * returns List
 **/
exports.clientsGET = function() {
  return new Promise(function(resolve, reject) {
    clientDao.getClients({}, function(err, clients) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        resolve(clients);
      }
    });
  });
}

/**
 * Creates a new client
 *
 * body NewClient Client to create (optional)
 * returns Client
 **/
exports.clientsPOST = function(body) {
  return new Promise(function(resolve, reject) {
    clientDao.insertClient(body, function(err, clientInserted) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        resolve(clientInserted);
      }
    });
  });
}
