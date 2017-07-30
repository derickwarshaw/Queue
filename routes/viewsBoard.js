const API = require('../components/API');
const File = require('../components/File');

module.exports = boardRouter => {
  "use strict";
  
  const boardBase = '/';
  const boardRoom = '/:boardRoom';
  
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
  
  boardRouter.get(boardRoom, function (boardReq, boardRes) {
    Promise.all([
      API.getIntegralUsersByRoom(boardReq.params.boardRoom),
      API.getExtrinsicUsersByRoom(boardReq.params.boardRoom)
    ])
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