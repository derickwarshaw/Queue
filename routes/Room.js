const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";

  return routerInstance
     .get('/', function (roomReq, roomRes) {
       "use strict";

       API.getRooms()
          .then(rooms => roomRes.json(rooms))
          .catch(reason => roomRes.send(reason));
     })
     .get('/id/:roomId', function (roomReq, roomRes) {
       "use strict";

       API.getRoomById(roomReq.params.roomId)
          .then(rooms => roomRes.json(rooms))
          .catch(reason => roomRes.send(reason));
     })
     .get('/distinctor/:roomDistinctor', function (roomReq, roomRes) {
       "use strict";

       API.getRoomByDistinctor(roomReq.params.roomDistinctor)
          .then(rooms => roomRes.json(rooms))
          .catch(reason => roomRes.send(reason));
     })
     .get('/name/:roomName', function (roomReq, roomRes) {
       "use strict";

       API.getRoomByName(roomReq.params.roomName)
          .then(rooms => roomRes.json(rooms))
          .catch(reason => roomRes.send(reason));
     });

};

