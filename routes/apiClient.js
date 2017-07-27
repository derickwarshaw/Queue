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
      .delete('/id/:clientId', function (clientReq, clientRes) {
        
        API.deleteClientById(clientReq.params.clientId)
            .then(success => clientRes.send(200))
            .catch(failure => clientRes.send(failure.message));
      })
      
      
     .get('/distinctor/:clientDistinctor', function (clientReq, clientRes) {
       
       API.getClientByDistinctor(clientReq.params.clientDistinctor)
          .then(client => clientRes.json(client))
          .catch(reason => clientRes.send(reason.message));
     })
      .delete('/distinctor/:clientDistinctor', function (clientReq, clientRes) {
        
        API.deleteClientByDistinctor(clientReq.params.clientDistinctor)
            .then(success => clientRes.send(200))
            .catch(failure => clientRes.send(failure.message));
      })
      
      
     .get('/handshake/:clientHandshake', function (clientReq, clientRes) {

       API.getClientByHandshake(clientReq.params.clientHandshake)
          .then(client => clientRes.json(client))
          .catch(reason => clientRes.send(reason.message));
     })
      .delete('/handshake/:clientHandshake', function (clientReq, clientRes) {
        
        API.deleteClientByHandshake(clientReq.params.clientHandshake)
            .then(success => clientRes.send(200))
            .catch(failure => clientRes.send(failure.message));
      })
      
      
      .get('/system/:clientSystem', function (clientReq, clientRes) {
        
        API.getClientBySystem(clientReq.params.clientSystem)
            .then(client => clientRes.json(client))
            .catch(reason => clientRes.send(reason.message));
      })
      .delete('/system/:clientSystem', function (clientReq, clientRes) {
        
        API.deleteClientBySystem(clientReq.params.clientSystem)
            .then(success => clientRes.send(200))
            .catch(failure => clientRes.send(failure.message));
      })

};
