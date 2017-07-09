const Application = require('./components/Application');
const currentApplication = new Application(__dirname, 8080);
module.exports.currentApplication = currentApplication;

// TODO: Consider merging thee queue with the Application component.
const Queue = currentApplication.component('Queue');
const currentQueue = new Queue();
module.exports.currentQueue = currentQueue;

// TODO: Consider merging the current database with the Application component.
const Database = currentApplication.component('Database');
const currentDatabase = new Database();
module.exports.currentDatabase = currentDatabase;




const Present = currentApplication.component('Present');
const Translation = currentApplication.component('Translation');
const API = currentApplication.component('API');

// TODO: Do something with this middleware function.
currentApplication.middle(function (requestInstance) {
  "use strict";

  console.log(`[Web Request] ${requestInstance.summary()}`);
});

currentApplication.base('/api');
currentApplication.route('User');
currentApplication.route('Client');
currentApplication.route('Room');

currentDatabase.open()
   .then(openDatabase => {
     "use strict";

     currentApplication.listen();
     currentApplication.socket(socketRequest => {
       console.log(`[Socket Request] ${socketRequest.summary()}`);

       socketRequest.authenticate(function (authName, authData) {
         currentApplication.handle(authName)(authData)
             .then(handleData => socketRequest.authenticated(handleData))
             .catch(handleReason => socketRequest.unauthenticated(handleReason));

       });

       socketRequest.register(function (regName, regData) {
           currentApplication.handle(regName)(regData, socketRequest)
               .then(handleData => socketRequest.registered(handleData))
               .catch(handleReason => socketRequest.unregistered(handleReason));
       });

       socketRequest.update(function (upName, upData) {
         currentApplication.handle(upName)(upData)
            .then(handleData => socketRequest.updated(handleData))
            .catch(handleReason => socketRequest.stagnated(handleReason));
       });

       socketRequest.avoid(function (avName, avData) {
         currentApplication.handle(avName)(avData, socketRequest)
            .then(handleData => console.log(`[Web Request] Ended for ${socketRequest.requestHandshake}.`))
            .catch(handleReason => console.log(`[Web Request] Failed to end for ${socketRequest.requestHandshake}.`));
       })
     })
   });