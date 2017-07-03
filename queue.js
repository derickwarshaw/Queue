const Application = require('./components/Application');
const currentApplication = new Application(__dirname, 8080);
module.exports.currentApplication = currentApplication;

const Queue = currentApplication.component('Queue');
const currentQueue = new Queue();
module.exports.currentQueue = currentQueue;

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
     currentApplication.socket(socketOpen => {
       Translation.socketRequest(socketOpen)
          .then(requestInstance => {
            console.log(`[Socket Request] ${requestInstance.summary()}`);

            requestInstance.userRequest(function (requestName, requestData) {
              currentApplication.handle(requestName)(requestData)
                 .then(handleData => requestInstance.userEstablished(handleData));
            })
          });
     });
   });
