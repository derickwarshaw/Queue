const currentApplication = require('../queue').currentApplication;

const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (boardReq, boardRes) {
        API.getRooms().then(roomsFound => boardRes.render('Root', {
          rootHeader: 'Rooms Available',
          rootItem: roomsFound.map(roomFound => {
            roomFound.itemRoot = '/v/board';
            roomFound.itemName = roomFound.roomName;
            delete roomFound.roomName;

            return roomFound;
          })
        }));
      })
      .get('/:roomName', function (boardReq, boardRes) {

        API.getRoomByName(boardReq.params.roomName)
           .then(roomFound => {
             return Promise.all([
                API.getIntegrals(roomFound.roomDistinctor),
                API.getUntegrals(roomFound.roomDistinctor)
             ]);
           })
           .then(apiTegrals => {
             boardRes.render('RoomAvailable', {
               roomName: boardReq.params.roomName,
               roomAttended: apiTegrals[0],
               roomUnattended: apiTegrals[1]
             });
           })
           .catch(reason => {
             boardRes.render('RoomUnavailable', {
               roomName: boardReq.params.roomName
             });
           });
      });
  
};