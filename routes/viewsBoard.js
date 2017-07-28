const currentApplication = require('../queue').currentApplication;

const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = boardRouter => {
  "use strict";
  
  const boardBase = '/';
  const boardRom = '/:boardRoom';
  
  boardRouter.get(boardBase, function (boardReq, boardRes) {
    API.getRooms()
        .then(rooms => boardRes.render('Root', {
          rootHeader: 'Queue Views - Rooms Available',
          rootItem: rooms.map(roomFound => {
            roomFound.itemRoot = '/v/board';
            roomFound.itemName = roomFound.roomName;
            delete roomFound.roomName;
            
            return roomFound;
          })
        }))
        .catch(error => boardRes.send(error.message));
  });
  
  boardRouter.get(boardRom, function (boardReq, boardRes) {
    API.getRoomByName(boardReq.params.boardRoom)
        .then(roomFound => Promise.all([
            API.getIntegrals(roomFound.roomDistinctor),
            API.getUntegrals(roomFound.roomDistinctor)
        ]))
        .then(apiTegrals => boardRes.render('RoomAvailable', {
          roomName: boardReq.params.boardRoom,
          roomAttended: apiTegrals[0],
          roomUnattended: apiTegrals[1]
        }))
        .catch(error => boardRes.render('RoomUnavailable', {
          roomName: boardReq.params.boardRoom
        }));
  });

  
  return boardRouter;
  
};