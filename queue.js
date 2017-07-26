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




// TODO: Do something with this middleware function.
currentApplication.middle(function (requestInstance) {
  "use strict";
  
  requestInstance.allowOrigin('*');
  requestInstance.allowHeaders(['Origin', 'X-Requested-With', 'Content-Type', 'Accept']);
});

currentApplication.apiBase('/api', function (api) {
  "use strict";
  
  console.log(`[${api.time()}] [API Request] ${api.summary()}`);
});

// TODO: Consider implementing these another way?
currentApplication.apiRoute('User');
currentApplication.apiRoute('Client');
currentApplication.apiRoute('System');
currentApplication.apiRoute('Room');
currentApplication.apiRoute('Tegrals');



currentApplication.viewBase('/v', function (view) {
  "use strict";
  
  console.log(`[${view.time()}] [View Request] ${view.summary()}`);
});
currentApplication.viewRoute('Board');


currentApplication.cdnBase('/cdn', function (cdn) {
  "use strict";
  
  
  console.log(`[${cdn.time()}] [CDN Request] ${cdn.summary()}`);
});
currentApplication.cdnRoute('Scripts');
currentApplication.cdnRoute('Stylesheets');

currentDatabase.open()
   .then(openDatabase => {
     "use strict";

     currentApplication.listen();
     currentApplication.socket(socketRequest => {
       console.log(`[${socketRequest.time()}] [Socket Request] ${socketRequest.summary()}`);

       socketRequest.authenticate(function (authName, authData) {
         currentApplication.handle(authName)(authData)
             .then(handleData => socketRequest.authenticated(handleData))
             .catch(handleReason => socketRequest.unauthenticated(handleReason));

       });

       socketRequest.register(function (regName, regData) {
           currentApplication.handle(regName)(regData, socketRequest)
               .then(handleData => {
                 socketRequest.registered(handleData);
                 socketRequest.join(handleData.registeredClient);
               })
               .catch(handleReason => socketRequest.unregistered(handleReason));
       });

       socketRequest.update(function (upName, upData) {
         currentApplication.handle(upName)(upData)
            .then(handleData => {
              socketRequest.updated(handleData);
              socketRequest.change(handleData);
            })
            .catch(handleReason => socketRequest.stagnated(handleReason));
       });

       socketRequest.avoid(function (avName, avData) {
         currentApplication.handle(avName)(avData, socketRequest)
            .then(handleData => {
              console.log(`[Web Request] Ended for ${socketRequest.socketHandshake}.`)
              socketRequest.leave(handleData);
            })
            .catch(handleReason => console.log(`[Web Request] Failed to end for ${socketRequest.socketHandshake}.`));
       })
     })
   });