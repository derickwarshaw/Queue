const API = require('../components/API');
const Patch = require('../types/Patch');

module.exports = systemRouter => {
  
  const systemBase = '/';
  const systemByDistinctor = '/:systemDistinctor';
  
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
  
  systemRouter.get(systemByDistinctor, function (systemReq, systemRes) {
    API.getSystemByDistinctor(systemReq.params.systemDistinctor)
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.patch(systemByDistinctor, function (systemReq, systemRes) {
    API.patchSystemByDistinctor(systemReq.params.systemDistinctor, new Patch(systemReq.body))
       .then(system => systemRes.json(system))
       .catch(failure => systemRes.send(failure.message));
  });
  systemRouter.delete(systemByDistinctor, function (systemReq, systemRes) {
    API.deleteSystemByDistinctor(systemReq.params.systemDistinctor)
       .then(success => systemRes.sendStatus(200))
       .catch(failure => systemRes.send(failure.message));
  });
  
  return systemRouter;
  
};