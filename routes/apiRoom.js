const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = roomRouter => {
  "use strict";
  
  const roomBase = '/';
  const roomById = '/id/:roomId';
  const roomByDistinctor = '/distinctor/:roomDistinctor';
  const roomByName = '/name/:roomName';
  
  roomRouter.get(roomBase, function (roomReq, roomRes) {
    API.getRooms()
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.sendStatus(reason));
  });
  roomRouter.post(roomBase, function (roomReq, roomRes) {
    API.addRoom(roomReq.body.roomName)
        .then(success => roomRes.sendStatus(200))
        .catch(reason => roomRes.sendStatus(reason.message));
  });
  roomRouter.delete(roomBase, function (roomReq, roomRes) {
    API.deleteRooms()
        .then(success => roomRes.sendStatus(200))
        .catch(reason => roomRes.sendStatus(reason.message));
  });
  
  
  roomRouter.get(roomById, function (roomReq, roomRes) {
    API.getRoomById(roomReq.params.roomId)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.sendStatus(reason));
  });
  // TODO: Implement .patch
  roomRouter.delete(roomById, function (roomReq, roomRes) {
    API.deleteRoomById(roomReq.params.roomId)
        .then(success => roomRes.sendStatus(200))
        .catch(reason => roomRes.sendStatus(reason.message));
  });
  
  
  roomRouter.get(roomByDistinctor, function (roomReq, roomRes) {
    API.getRoomByDistinctor(roomReq.params.roomDistinctor)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.sendStatus(reason));
  });
  // TODO: Implement patch.
  // TODO: Implement delete.
  
  
  roomRouter.get(roomByName, function (roomReq, roomRes) {
    API.getRoomByName(roomReq.params.roomName)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.sendStatus(reason));
  });
  // TODO: Implement patch.
  // TODO: Implement delete.

  return roomRouter;

};

