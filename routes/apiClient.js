const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
     .get('/', function (clientReq, clientRes) {

       API.getClients()
          .then(clients => clientRes.json(clients))
          .catch(reason => clientRes.send(reason.message));
     })
     .get('/id/:clientId', function (clientReq, clientRes) {

       API.getClientById(clientReq.params.clientId)
          .then(client => clientRes.json(client))
          .catch(reason => clientRes.send(reason.message));
     })
     .get('/distinctor/:clientDistinctor', function (clientReq, clientRes) {
       
       API.getClientByDistinctor(clientReq.params.clientDistinctor)
          .then(client => clientRes.json(client))
          .catch(reason => clientRes.send(reason.message));
     })
     .get('/handshake/:clientHandshake', function (clientReq, clientRes) {

       API.getClientByHandshake(clientReq.params.clientHandshake)
          .then(client => clientRes.json(client))
          .catch(reason => clientRes.send(reason.message));
     })
      .get('/system/:clientSystem', function (clientReq, clientRes) {
        
        API.getClientBySystem(clientReq.params.clientSystem)
            .then(client => clientRes.json(client))
            .catch(reason => clientRes.send(reason.message));
      });

};
