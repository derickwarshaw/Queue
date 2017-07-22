const currentApplication = require('../queue').currentApplication;
const currentQueue = require('../queue').currentQueue;

const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (systemReq, systemRes) {
        
        API.getSystems()
            .then(systems => systemRes.json(systems))
            .catch(reason => systemRes.send(reason.message));
      })
      .get('/id/:systemId', function (systemReq, systemRes) {
        
        API.getSystemById(systemReq.params.systemId)
            .then(systems => systemRes.json(systems))
            .catch(reason => systemRes.send(reason.message));
      })
      .get('/distinctor/:systemDistinctor', function (systemReq, systemRes) {
        
        API.getSystemByDistinctor(systemReq.params.systemDistinctor)
            .then(systems => systemRes.json(systems))
            .catch(reason => systemRes.send(reason.message));
      })
      .get('/number/:systemNumber', function (systemReq, systemRes) {
        
        API.getSystemByNumber(systemReq.params.systemNumber)
            .then(systems => systemRes.json(systems))
            .catch(reason => systemRes.send(reason.message));
      })
      .get('/room/:systemRoom', function (systemReq, systemRes) {
        
        API.getSystemByRoom(systemReq.params.systemRoom)
            .then(systems => systemRes.json(systems))
            .catch(reason => systemRes.send(reason.message));
      });
  
};