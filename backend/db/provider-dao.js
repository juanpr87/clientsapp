'use strict';

const debug = require('debug')('clientsapp:server');
const mongoose = require('mongoose');

// Mongoose connection
const connection = require('./connection');
// Mongoose models
const models = require('./models');

/**
  * Gets providers from the database that matches the filters passed
  * @param filter filter object in the form { name: 'Juan Perez' }
  * @param callback function which takes 2 params:
  *   - err error object
  *   - providers the providers retrieved
  **/
module.exports.getProviders = function(filter, callback) {
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != undefined) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    if (filter == null) {
      filter = {};
    } else if (Object.keys(filter).includes('id')) {
      filter._id = filter.id;
      delete filter.id;
    }
    
    debug('Retrieving all Provider documents from DB which match the filters passed...');
    const Provider = models.models().Provider;
    Provider.find(filter, function(err, providers) {
      if (err) {
        console.error('Error while retrieving Provider documents: ', err);
        callback(err);
      } else {
        const result = [];
        for (let index in providers) {
          const provider = providers[index];
          result.push({
            id: provider._id,
            name: provider.name
          });
        }
        callback(null, result);
      }
    });
  });
}

/**
 * Counts the clients who have the provider specified
 * @param providerId provider Id for which count clients
 * @param callback callback function which takes 2 params
 *   - err error object
 *   - result the number of clients
 **/
module.exports.countClientsPerProvider = function(providerId, callback) {
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != undefined) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    
    debug('Retrieving number of clients who have the passed provider...');
    const Client = models.models().Client;
    Client.find({
      providers: {
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(providerId)
        }
      }
    }).countDocuments(function(err, result) {
      if (err) {
        console.error('Error while retrieving Clients count: ', err);
        callback(err);
      } else {
        debug('Count result: ', result);
        callback(null, result);
      }
    });
  });
}

/**
  * Gets client providers from the database
  * @param clientId client ID whose providers will be retrieved
  * @param callback function which takes 2 params:
  *   - err error object
  *   - providers the providers retrieved
  **/
module.exports.getClientProviders = function(clientId, callback) {
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != undefined) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    
    debug('Retrieving all Provider documents for the client specified from DB...');
    const Client = models.models().Client;
    Client.findOne({_id: clientId}, 'providers', function(err, client) {
      if (err) {
        console.error('Error while retrieving Client: ', err);
        callback(err);
      } else if(client == null) {
        callback({
          code: 404,
          message: 'Client not found'
        });
      } else {
        debug('Client ok %o', client);
        const result = client.providers;
        callback(null, result);
      }
    });
  });
}

/**
  * Inserts a provider into the database
  * @param provider provider object to insert (property id, if exists, will be ignored)
  * @param callback function which takes 2 params:
  *   - err error object
  *   - provider inserted object with its autogenerated ID (in property id)
  **/
module.exports.insertProvider = function(provider, callback) {
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != undefined) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    
    debug('Saving Provider document...');
    const Provider = models.models().Provider;
    const providerModel = new Provider({
      name: provider.name
    });
    providerModel.save(function(err, provider) {
      if (err) {
        console.error('Error while saving Provider document: ', err);
        callback(err);
      } else {
        debug('Saving ok: %o', provider);
        callback(null, {
          id: provider._id,
          name: provider.name
        });
      }
    });
  });
}

/**
  * Removes the providerId from the clients providers property for the ones that have 
  * it among their providers
  * @param providerId providerId to be remover from the clients providers property
  * @param callback callback which takes 2 params
  *   - the first is an error object (null if the operation was ok)
  *   - the second is the result object
  * https://docs.mongodb.com/manual/reference/operator/update/pull/
 **/
const deleteProviderRefs = function(providerId, callback) {
  debug('Deleting provider id refs...');
  const Client = models.models().Client;
  Client.updateMany(
    {
      providers: {
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(providerId)
        }
      }
    },
    {
      $pull: {
        providers: mongoose.Types.ObjectId(providerId)
      }
    },
    function(err, result) {
      if (err != null) {
        console.error('Providers Update err: ', err);
        callback(err);
      } else {
        debug('Providers Update result: %o', result);
        callback(null, result);
      }
    }
  );
}

/**
  * Adds the providerIds to the providers list of the client whose Id is clientId
  * If a providerId already exists, it will not add it again.
  * @param clientId Id of the client whose providers list will be updated
  * @param providerIds array of object such as { id: providerId } which will be 
  * added to the clients providers property
  * @param callback callback which takes 2 params
  *   - the first is an error object (null if the operation was ok)
  *   - the second is the result object
  * https://docs.mongodb.com/manual/reference/operator/update/addToSet/
  * https://docs.mongodb.com/manual/reference/operator/update/addToSet/#addtoset-modifiers
 **/
module.exports.addProvidersToClient = function(clientId, providerIds, callback) {
  if (providerIds == null || providerIds.length == 0) {
    debug('addProvidersToClient with nothing to add. Returning...');
    return {
      ok: 1,
      n: 1,
      nModified: 0
    }
  }
  const providerObjectIds = [];
  for (const id of providerIds) {
    providerObjectIds.push(mongoose.Types.ObjectId(id.id))
  };
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != null) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    
    debug('Adding Providers to a Client...');
    const Client = models.models().Client;
    Client.updateOne(
      {
        _id: mongoose.Types.ObjectId(clientId)
      },
      {
        $addToSet: {
          providers: { $each: providerObjectIds }
        }
      },
      function(err, result) {
        if (err != null) {
          console.error('Clients AddProviders Update err: ', err);
          callback(err);
        } else {
          debug('Clients AddProviders Update result: %o', result);
          callback(null, result);
        }
      }
    );
  });
}

/**
  * Removes the providerId from the providers list of the client whose Id is clientId.
  * If the providerId did not exist, it will return nModified: 0 in result.
  * @param clientId Id of the client whose providers list will be updated
  * @param providerId providerId to be removed from the clients providers property
  * @param callback callback which takes 2 params
  *   - the first is an error object (null if the operation was ok)
  *   - the second is the result object
  * https://docs.mongodb.com/manual/reference/operator/update/pull/
 **/
module.exports.removeProviderFromClient = function(clientId, providerId, callback) {
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != null) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    
    debug('Removing a Provider from a Client providers list...');
    const Client = models.models().Client;
    Client.updateOne(
      {
        _id: mongoose.Types.ObjectId(clientId)
      },
      {
        $pull: {
          providers: mongoose.Types.ObjectId(providerId)
        }
      },
      function(err, result) {
        if (err != null) {
          console.error('Clients RemoveProvider Update err: ', err);
          callback(err);
        } else {
          debug('Clients RemoveProvider Update result: %o', result);
          callback(null, result);
        }
      }
    );
  });
}

/**
  * Updates a client's provider list
  * @param clientId ID whose client will be updated
  * @param providerIds list with objects such as { id: providerId }
  * @param callback function which takes 2 params:
  *   - err error object
  *   - client updated object
  **/
module.exports.updateProviders = function(clientId, providerIds, callback) {
  if (providerIds == null || providerIds.length == 0) {
    debug('addProvidersToClient with nothing to add. Returning...');
    return {
      ok: 1,
      n: 1,
      nModified: 0
    }
  }
  const providerObjectIds = [];
  for (const id of providerIds) {
    providerObjectIds.push(mongoose.Types.ObjectId(id.id))
  };
  debug('Connecting to DB...');
  console.log('clientId: ', clientId);
  console.log('providers: ', providerObjectIds);
  connection.connect(function(err, connection) {
    if (err != undefined) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }

    debug('Updating Client providers...');
    const Client = models.models().Client;
    const clientModel = new Client({
      _id: clientId,
      providers: providerObjectIds
    });
    clientModel.updateOne(clientModel, function(err, result) {
      if (err) {
        console.error('Error while saving Client document: ', err);
        callback(err);
      } else {
        debug('Saving result: %o', result);
        callback(null, result);
      }
    });
  });
}

/**
  * Deletes a provider from the database
  * @param provider providerId to delete
  * @param callback function which takes 2 params:
  *   - err error object
  *   - result delete result object
  **/
module.exports.deleteProvider = function(providerId, callback) {
  debug('Connecting to DB...');
  connection.connect(function(err, connection) {
    if (err != null) {
      console.error('Error connecting to DB: ', err);
      callback(err);
      return;
    }
    
    debug('Deleting a Provider document by its Id...');
    const Provider = models.models().Provider;
    Provider.deleteOne({_id: providerId}, function(err, result) {
      if (err != null) {
        console.error('Error while deleting a Provider document by ID: ', err);
        callback(err);
      } else {
        debug('Delete result: %o', result);
        if (result.ok == 1 && result.deletedCount == 1) { // Ok
          // Once deleted the provider, delete the provider refs that clients may have
          deleteProviderRefs(providerId, function(err, resultRefs) {
            if (err) {
              console.error('Error while deleting the provider refs: ', err);
              callback(err);
            } else {
              if (resultRefs.ok == 0) {
                console.error('Error while deleting the provider refs: ', resultRefs);
              }
              callback(null, result);
            }
          });
        }
      }
    });
  });
}