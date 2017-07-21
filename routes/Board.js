const currentApplication = require('../queue').currentApplication;

const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (roomReq, roomRes) {
        // TODO: Send them a, "You did not reqest... here's some options" page.
      })
      .get('/:roomName', function (boardReq, boardRes) {
        
        API.getRoomByName(boardReq.params.roomName)
           .then(roomFound => {
             return API.getIntegrals(roomFound.roomDistinctor);
           })
           .then(users => boardRes.render('RoomAvailable', {
             roomName: boardReq.params.roomName,
             roomPoints: users
           }))
           .catch(reason => {
             boardRes.render('RoomUnavailable', {
               roomName: boardReq.params.roomName
             });
           });
      })
     .get('/r/:resource', function (boardReq, boardRes) {

       File.readFile('./resources/Point.' + boardReq.params.resource.toLowerCase())
          .then(file => boardRes.send(file))
          .catch(reason => boardRes.send(reason.message));
     })
  
};