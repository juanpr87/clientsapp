'use strict';

var utils = require('../utils/writer.js');
var Client = require('../service/ClientService');

module.exports.clientsClientIdDELETE = function clientsClientIdDELETE (req, res, next, clientId) {
  Client.clientsClientIdDELETE(clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.clientsClientIdGET = function clientsClientIdGET (req, res, next, clientId) {
  Client.clientsClientIdGET(clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.clientsClientIdPUT = function clientsClientIdPUT (req, res, next, body, clientId) {
  Client.clientsClientIdPUT(body, clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.clientsGET = function clientsGET (req, res, next) {
  Client.clientsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.clientsPOST = function clientsPOST (req, res, next, body) {
  Client.clientsPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
