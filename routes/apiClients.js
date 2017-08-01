const API = require('../components/API');
const Patch = require('../types/Patch');

module.exports = clientRouter => {
  "use strict";

  const clientBase = '/';
  const clientByDistinctor = '/:clientDistinctor';

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
  
  return clientRouter;

};
