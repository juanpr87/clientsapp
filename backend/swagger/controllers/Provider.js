'use strict';

var utils = require('../utils/writer.js');
var Provider = require('../service/ProviderService');

module.exports.providersGET = function providersGET (req, res, next) {
  Provider.providersGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.providersPOST = function providersPOST (req, res, next, body) {
  Provider.providersPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.providersProviderIdDELETE = function providersProviderIdDELETE (req, res, next, providerId) {
  Provider.providersProviderIdDELETE(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.providersProviderIdPUT = function providersProviderIdPUT (req, res, next, body, providerId) {
  Provider.providersProviderIdPUT(body, providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.providersbyclientClientIdGET = function providersbyclientClientIdGET (req, res, next, clientId) {
  Provider.providersbyclientClientIdGET(clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.providersbyclientClientIdProviderIdDELETE = function providersbyclientClientIdProviderIdDELETE (req, res, next, clientId, providerId) {
  Provider.providersbyclientClientIdProviderIdDELETE(clientId, providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.providersbyclientClientIdPUT = function providersbyclientClientIdPUT (req, res, next, body, clientId) {
  Provider.providersbyclientClientIdPUT(body, clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.clientsbyproviderProviderIdGET = function clientsbyproviderProviderIdGET (req, res, next, providerId) {
  Provider.clientsbyproviderProviderIdGET(providerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
