const API = require('../components/API');
const Patch = require('../types/Patch');

module.exports = roomRouter => {
  "use strict";
  
  const roomBase = '/';
  const roomByDistinctor = '/:roomDistinctor';
  
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
  
  roomRouter.get(roomByDistinctor, function (roomReq, roomRes) {
    API.getRoomByDistinctor(roomReq.params.roomDistinctor)
        .then(rooms => roomRes.json(rooms))
        .catch(reason => roomRes.sendStatus(reason));
  });
  roomRouter.patch(roomByDistinctor, function (roomReq, roomRes) {
    API.patchRoomByDistinctor(roomReq.params.roomDistinctor, new Patch(roomReq.body))
       .then(success => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason.message));
  });
  roomRouter.delete(roomByDistinctor, function (roomReq, roomRes) {
    API.deleteRoomByDistinctor(roomReq.params.roomId)
       .then(success => roomRes.sendStatus(200))
       .catch(reason => roomRes.sendStatus(reason.message));
  });

  return roomRouter;

};

