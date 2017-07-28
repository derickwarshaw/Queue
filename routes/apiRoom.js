const API = require('../components/API');

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
  roomRouter.patch(roomById, function (roomReq, roomRes) {
    API.patchRoomById(roomReq.params.roomId, roomReq.body)
       .then(rooms => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason));
  });
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
  roomRouter.patch(roomByDistinctor, function (roomReq, roomRes) {
    API.patchRoomByDistinctor(roomReq.params.roomId, roomReq.body)
       .then(success => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason.message));
  });
  roomRouter.delete(roomByDistinctor, function (roomReq, roomRes) {
    API.deleteRoomByDistinctor(roomReq.params.roomId)
       .then(success => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason.message));
  });
  
  
  roomRouter.get(roomByName, function (roomReq, roomRes) {
    API.getRoomByName(roomReq.params.roomName)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.sendStatus(reason));
  });
  roomRouter.patch(roomByName, function (roomReq, roomRes) {
    API.patchRoomByName(roomRes.params.roomName, roomReq.body)
       .then(success => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason.message));
  });
  roomRouter.delete(roomByName, function (roomReq, roomRes) {
    API.deleteRoomByName(roomReq.param.roomName)
       .then(success => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason.message));
  });

  return roomRouter;

};

