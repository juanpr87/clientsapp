'use strict';

const providerDao = require('../../db/provider-dao');
const utils = require('../utils/writer.js');

/**
 * Gets the client's providers
 *
 * clientId String Client's ID to use
 * returns List
 **/
exports.providersbyclientClientIdGET = function(clientId) {
  return new Promise(function(resolve, reject) {
    providerDao.getClientProviders(clientId, function(err, providers) {
      if (err != null) {
        const code = err.code;
        switch (code) {
          case 404:
            reject(utils.respondWithCode(code, {
              code: 4040,
              message: err.message
            }));
            break;
          default:
            reject(utils.respondWithCode(500, {
              code: 5000,
              message: err.message
            }));
        }
      } else {
        const result = [];
        for (let index in providers) {
          const provider = providers[index];
          result.push({
            id: provider
          });
        }
        resolve(result);
      }
    });
  });
}

/**
 * Updates a client's providers list
 *
 * body List Client's providers Ids (optional)
 * clientId String Client's ID to use
 * returns OperationResult
 **/
exports.providersbyclientClientIdPUT = function(body,clientId) {
  return new Promise(function(resolve, reject) {
    providerDao.updateProviders(clientId, body, function(err, result) {
      if (err != null) {
          reject(utils.respondWithCode(500, {
            code: 5000,
            message: err.message
          }));
        } else {
          if (result.ok != 1) {
            reject(utils.respondWithCode(500, {
              code: 5000,
              message: 'Error in database update operation'
            }));
          } else if (result.ok == 1 && result.n == 0) {
            // 404
            reject(utils.respondWithCode(404, {
              code: 4040,
              message: 'Client not found'
            }));
          } else if (result.ok == 1 && result.n == 1) {
            // OK return OperationResult
            resolve({
              result: 'OK',
              affectedNumber: result.nModified
            });
          }
        }
    });
  });
}

/**
 * Returns all providers from the system
 *
 * returns List
 **/
exports.providersGET = function() {
  return new Promise(function(resolve, reject) {
    providerDao.getProviders({}, function(err, providers) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        resolve(providers);
      }
    });
  });
}

/**
 * Creates a new provider
 *
 * body NewProvider Provider to create (optional)
 * returns Provider
 **/
exports.providersPOST = function(body) {
  return new Promise(function(resolve, reject) {
    providerDao.insertProvider(body, function(err, providerInserted) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        resolve(providerInserted);
      }
    });
  });
}

/**
 * Deletes a provider
 *
 * providerId String Provider's ID to use
 * returns Provider
 **/
exports.providersProviderIdDELETE = function(providerId) {
  return new Promise(function(resolve, reject) {
    providerDao.deleteProvider(providerId, function(err, result) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        if (result.ok == 1 && result.deletedCount == 1) {
          // Operation OK
          resolve({
            result: 'OK',
            affectedNumber: result.deletedCount
          });
        } else if (result.ok == 1 && result.deletedCount == 0) {
          reject(utils.respondWithCode(404, {
            message: "Provider not found",
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
 * Gets the number of clients that have this provider
 *
 * providerId String Provider's ID to use
 * returns inline_response_200
 **/
exports.clientsbyproviderProviderIdGET = function(providerId) {
  return new Promise(function(resolve, reject) {
    providerDao.countClientsPerProvider(providerId, function(err, result) {
      if (err != null) {
        reject(utils.respondWithCode(500, {
          code: 5000,
          message: err.message
        }));
      } else {
        resolve({
          clients: result
        });
      }
    });
  });
}

