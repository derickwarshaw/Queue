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

const currentPresent = currentApplication.component('Present');

const Translation = currentApplication.component('Translation');
const API = currentApplication.component('API');

// TODO: Do something with this middleware function.
currentApplication.middle(function (requestInstance) {
  "use strict";

  console.log(`[Web Request] ${requestInstance.summary()}`);
});


const userRouter = currentApplication.router()
   .get('/', function (roomReq, roomRes) {
     "use strict";

     API.getUsers()
        .then(users => roomRes.json(users))
        .catch(reason => roomRes.send(reason));
   })
   .get('/id/:userId', function (roomReq, roomRes) {
     "use strict";

     API.getUserById(roomReq.params.userId)
        .then(users => roomRes.json(users))
        .catch(reason => roomRes.send(reason));
   })
   .get('/distinctor/:userDistinctor', function (roomReq, roomRes) {
     "use strict";

     API.getUserByDistinctor(roomReq.params.userDistinctor)
        .then(users => roomRes.json(users))
        .catch(reason => roomRes.send(reason));
   })
   .get('/name/:userName', function (roomReq, roomRes) {
     "use strict";

     API.getUserByName(roomReq.params.userName)
        .then(users => roomRes.json(users))
        .catch(reason => roomRes.send(reason));
   });

currentApplication.route('/api/user/', userRouter);

const roomRouter = currentApplication.router()
   .get('/', function (roomReq, roomRes) {
     "use strict";

     API.getRooms()
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.send(reason));
   })
   .get('/id/:roomId', function (roomReq, roomRes) {
     "use strict";

     API.getRoomById(roomReq.params.roomId)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.send(reason));
   })
   .get('/distinctor/:roomDistinctor', function (roomReq, roomRes) {
     "use strict";

     API.getRoomByDistinctor(roomReq.params.roomDistinctor)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.send(reason));
   })
   .get('/name/:roomName', function (roomReq, roomRes) {
     "use strict";

     API.getRoomByName(roomReq.params.roomName)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.send(reason));
   });

currentApplication.route('/api/room', roomRouter);


//#

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
       })
     })
   });