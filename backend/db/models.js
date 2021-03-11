'use strict';

const mongoose = require('mongoose');

let models = null;

function defineModels() {
  const Schema = mongoose.Schema;

  const ClientSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    providers: [{ type: Schema.Types.ObjectId, ref: 'Provider' }]
  });

  const ProviderSchema = new Schema({
    name: String
  });

  const ClientModel = mongoose.model('Client', ClientSchema);
  const ProviderModel = mongoose.model('Provider', ProviderSchema);
}

function getModels() {
  return {
    Client: mongoose.model('Client'),
    Provider: mongoose.model('Provider')
  };
}

module.exports = {
  defineModels: defineModels,
  models: getModels
}
