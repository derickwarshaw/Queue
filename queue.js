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

const Translation = currentApplication.component('Translation');


// TODO: Do something with this middleware function.
currentApplication.middle(function (requestInstance) {
  "use strict";

  console.log(`[Web Request] ${requestInstance.summary()}`);
});

currentApplication.route('/')
   .get(function (req, res) {
     "use strict";
     res.sendFile('index.html');
   });

currentApplication.route('/room/:roomId')
   .get(function (getRequest, getResolve) {
     "use strict";

     currentQueue.add(function () {
       // TODO: Consider how you're going to generate the context for this.
       const queuedRender = currentApplication.render(getRequest, getResolve);
       return queuedRender('room', {room: getRequest.params.roomId});
     })
        .then(getResult => getResolve.send(getResult))
        .catch(getError => getResolve.status(404));
   });

currentApplication.route('/admin')
   .get(function (getRequest, getResolve) {
     "use strict";

     currentQueue.add(function () {
       // TODO: Consider how you're going to generate the context for this.
       const queuedRender = currentApplication.render(getRequest, getResolve);
       return queuedRender('admin', {});
     })
        .then(getResult => getResolve.send(getResult))
        .catch(getError => getResolve.status(404));
   });

currentDatabase.open()
   .then(openDatabase => {
     "use strict";

     currentApplication.listen();
     currentApplication.socket(socketRequest => {
       console.log(`[Socket Request] ${socketRequest.summary()}`);

       socketRequest.authenticate(function (authName, authData) {
         currentApplication.handle(authName)(authData)
            .then(handleData => socketRequest.authenticated(handleData))
            .catch(handleError => socketRequest.unauthorised(handleError));
       });

       socketRequest.request(function (reqName, reqData) {
         currentApplication.handle(reqName)(reqData)
            .then(handleData => socketRequest.requested(handleData))
            .catch(handleError => socketRequest.rejected(handleError));
       })
     })
   });