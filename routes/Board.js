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
      })
      
      
     .get('/Board.js', function (boardReq, boardRes) {

       File.readFile(`./public/scripts/Board.js`)
          .then(file => boardRes.send(file))
          .catch(reason => boardRes.send(reason.message));
     })
      .get('/Board.css', function (boardReq, boardRes) {
        
        File.readFile('./public/stylesheets/Board.css')
            .then(file => boardRes.send(file))
            .catch(reason => boardRes.send(reason.message));
      });
  
};