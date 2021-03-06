const Application = require('./components/Application');
const currentApplication = new Application(__dirname, 8080, false);
module.exports.currentApplication = currentApplication;

const Queue = require('promise-queue');
const currentQueue = new Queue();
module.exports.currentQueue = currentQueue;

const Database = require('./components/Database');
const currentDatabase = new Database();
module.exports.currentDatabase = currentDatabase;

const Logger = require('./components/Logger');
const currentLogger = new Logger();
module.exports.currentLogger = currentLogger;




currentApplication.cluster(function (clusterApplication) {
  
  currentApplication.middle(function (requestInstance) {
    "use strict";
    
    requestInstance.allowOrigin('*');
    requestInstance.allowHeaders(['Origin', 'X-Requested-With', 'Content-Type', 'Accept']);
    requestInstance.allowMethods(['GET', 'PUT', 'POST', 'DELETE']);
  });
  
  currentApplication.api('/api', ['Users', 'Clients', 'Systems', 'Rooms', 'Integrity'], function (api) {
    currentLogger.request('API', api).then(apiSummary => console.log(apiSummary));
  });
  currentApplication.views('/v', ['Board'], function (view) {
    currentLogger.request('View', view).then(viewSummary => console.log(viewSummary));
  });
  currentApplication.cdn('/cdn', ['Scripts', 'Stylesheets'], function (cdn) {
    currentLogger.request('CDN', cdn).then(cdnSummary => console.log(cdnSummary));
  });
  
  Promise.all([currentDatabase.open(), currentLogger.begin('./logs')]).then(openDatabase => {
    
        currentLogger.worker(clusterApplication, "Registered")
            // TODO: This logs 8 times for 4 forks. Why?
            .then(log => console.log(log));
        
        currentApplication.socket(socketRequest => {
          currentLogger.request('Socket', socketRequest).then(socketSummary => console.log(socketSummary));
          
          socketRequest.authenticate(function (authName, authData) {
            currentApplication.handle(authName)(authData)
                .then(handleData => {
                  socketRequest.authenticated(handleData)
                })
                .catch(handleReason => {
                  socketRequest.unauthenticated(handleReason);
                  currentLogger.problem(handleReason);
                });
            
          });
          
          socketRequest.register(function (regName, regData) {
            currentApplication.handle(regName)(regData, socketRequest)
                .then(handleData => {
                  socketRequest.registered(handleData);
                  socketRequest.join(handleData.registeredClient);
                })
                .catch(handleReason => {
                  socketRequest.unregistered(handleReason);
                  currentLogger.problem(handleReason);
                });
          });
          
          socketRequest.update(function (upName, upData) {
            currentApplication.handle(upName)(upData)
                .then(handleData => {
                  socketRequest.updated(handleData);
                  socketRequest.change(handleData);
                })
                .catch(handleReason => {
                  socketRequest.stagnated(handleReason);
                  currentLogger.problem(handleReason);
                });
          });
          
          socketRequest.avoid(function (avName, avData) {
            currentApplication.handle(avName)(avData, socketRequest)
                .then(handleData => {
                  console.log(`[${socketRequest.timestamp()}] [Socket Request] Ended for ${socketRequest.socketHandshake}.`)
                  socketRequest.leave(handleData);
                })
                .catch(handleReason => {
                  console.log(`[Web Request] Failed to end for ${socketRequest.socketHandshake}.`)
                  currentLogger.problem(handleReason);
                });
          })
        })
      });
  
  currentApplication.death(killedWorker => {
    currentLogger.worker(killedWorker, "Died")
        .then(log => console.log(log));
  });
});