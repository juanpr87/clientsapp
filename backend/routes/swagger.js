'use strict';

const debug = require('debug')('clientsapp:server');

const swaggerRouter = require('oas3-tools/dist/middleware/swagger.router');
const swaggerParameters = require('oas3-tools/dist/middleware/swagger.parameters');
//const oas3AppOptions= require('oas3-tools/dist/middleware/oas3.options');
const OpenApiValidator = require('express-openapi-validator');

const path = require('path');
const express = require('express');
const router = express.Router();
const cors = require('cors')

// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(__dirname, '../swagger/controllers'),
        useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
    }
};

const definitionPath = path.join(__dirname, '../swagger/api/openapi.yaml');

// Allow CORS requests
router.use(cors());

router.use(OpenApiValidator.middleware( { 
  apiSpec: definitionPath
}));
router.use(new swaggerParameters.SwaggerParameters().checkParameters());
router.use(new swaggerRouter.SwaggerRouter().initialize(options.routing));

router.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    code: err.status
  });
});

module.exports = router;
