const API = require('../components/API');

module.exports = systemRouter => {
  
  const systemBase = '/';
  const systemById = '/id/:systemId';
  const systemByDistinctor = '/distinctor/:systemDistinctor';
  const systemByNumber = '/number/:systemNumber';
  const systemByRoom = '/room/:systemRoom';
  
  systemRouter.get(systemBase, function (systemReq, systemRes) {
    API.getSystems()
       .then(systems => systemRes.json(systems))
       .catch(reason => systemRes.sendStatus(reason));
  })
  systemRouter.post(systemBase, function (systemReq, systemRes) {
    API.addSystem(systemReq.body)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.delete(systemBase, function (systemReq, systemRes) {
    API.deleteSystems()
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  
  
  systemRouter.get(systemById, function (systemReq, systemRes) {
    API.getSystemById(systemReq.params.systemId)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.patch(systemById, function (systemReq, systemRes) {
    API.patchSystemById(systemReq.params.systemId, systemReq.body)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure => failure.message));
  });
  systemRouter.delete(systemById, function (systemReq, systemRes) {
    API.deleteSystemById(systemReq.params.systemId)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  
  
  systemRouter.get(systemByDistinctor, function (systemReq, systemRes) {
    API.getSystemByDistinctor(systemReq.params.systemDistinctor)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.patch(systemByDistinctor, function (systemReq, systemRes) {
    API.patchSystemByDistinctor(systemReq.params.systemDistinctor, systemReq.body)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.delete(systemByDistinctor, function (systemReq, systemRes) {
    API.deleteSystemByDistinctor(systemReq.params.systemDistinctor)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  
  
  systemRouter.get(systemByNumber, function (systemReq, systemRes) {
    API.getSystemByNumber(systemReq.params.systemNumber)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.patch(systemByNumber, function (systemRes, systemReq) {
    API.patchSystemByNumber(systemReq.params.systemNumber, systemReq.body)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.delete(systemByNumber, function (systemRes, systemReq) {
    API.deleteSystemByNumber(systemReq.params.systemNumber)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  
  
  systemRouter.get(systemByRoom, function (systemReq, systemRes) {
    API.getSystemByRoom(systemReq.params.systemRoom)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.patch(systemByRoom, function (systemReq, systemRes) {
    API.patchSystemByRoom(systemReq.params.systemRoom, systemReq.body)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.delete(systemByRoom, function (systemReq, systemRes) {
    API.deleteSystemByRoom(systemReq.params.systemRoom)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  
  
  return systemRouter;
  
  
};