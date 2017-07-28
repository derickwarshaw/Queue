const API = require('../components/API');

module.exports = clientRouter => {
  "use strict";

  const clientBase = '/';
  const clientById = '/id/:clientId';
  const clientByDistinctor = '/distinctor/:clientDistinctor';
  const clientByHandshake = '/handshake/:clientHandshake';
  const clientBySystem = '/system/:clientSystem';

  clientRouter.get(clientBase, function (clientReq, clientRes) {
    API.getClients()
       .then(clients => clientRes.json(clients))
       .catch(reason => clientRes.sendStatus(reason.message));
  });
  clientRouter.delete(clientBase, function (clientReq, clientRes) {
    API.deleteClients()
       .then(success => clientRes.sendStatus(200))
       .catch(failure => clientRes.sendStatus(failure.message));
  });



  clientRouter.get(clientById, function (clientReq, clientRes) {
    API.getClientById(clientReq.params.clientId)
       .then(client => clientRes.json(client))
       .catch(failure => clientRes.sendStatus(failure.message));
  });
  clientRouter.delete(clientById, function (clientReq, clientRes) {
    API.deleteClientById(clientReq.params.clientId)
       .then(success => clientRes.sendStatus(200))
       .catch(failure => clientRes.sendStatus(failure.message));
  });


  clientRouter.get(clientByDistinctor, function (clientReq, clientRes) {
    API.getClientByDistinctor(clientReq.params.clientDistinctor)
       .then(client => clientRes.json(client))
       .catch(failure => clientRes.sendStatus(failure.message));
  });
  clientRouter.delete(clientByDistinctor, function (clientReq, clientRes) {
    API.deleteClientByDistinctor(clientReq.params.clientDistinctor)
       .then(success => clientRes.sendStatus(200))
       .catch(failure => clientRes.sendStatus(failure.message));
  });


  clientRouter.get(clientByHandshake, function (clientReq, clientRes) {
    API.getClientByHandshake(clientReq.params.clientHandshake)
       .then(client => clientRes.json(client))
       .catch(failure => clientRes.sendStatus(failure.message));
  });
  clientRouter.delete(clientByHandshake, function (clientReq, clientRes) {
    API.deleteClientByHandshake(clientReq.params.clientHandshake)
       .then(success => clientRes.sendStatus(200))
       .catch(failure => clientRes.sendStatus(failure.message));
  });


  clientRouter.get(clientBySystem, function (clientReq, clientRes) {
    API.getClientBySystem(clientReq.params.clientSystem)
       .then(client => clientRes.json(client))
       .catch(failure => clientRes.sendStatus(failure.message));
  });
  clientRouter.delete(clientBySystem, function (clientReq, clientRes) {
    API.deleteClientBySystem(clientReq.params.clientSystem)
       .then(success => clientRes.sendStatus(200))
       .catch(failure => clientRes.sendStatus(failure.message));
  });


  return clientRouter;

};
