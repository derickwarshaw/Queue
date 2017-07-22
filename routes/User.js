const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";

  return routerInstance
     .get('/', function (roomReq, roomRes) {
       "use strict";

       API.getUsers()
          .then(users => roomRes.json(users))
          .catch(reason => roomRes.send(reason));
     })
     .get('/id/:userId', function (roomReq, roomRes) {
       "use strict";

       API.getUserById(roomReq.params.userId)
          .then(users => roomRes.json(users))
          .catch(reason => roomRes.send(reason));
     })
     .get('/distinctor/:userDistinctor', function (roomReq, roomRes) {
       "use strict";

       API.getUserByDistinctor(roomReq.params.userDistinctor)
          .then(users => roomRes.json(users))
          .catch(reason => roomRes.send(reason));
     })
     .get('/name/:userName', function (roomReq, roomRes) {
       "use strict";

       API.getUserByName(roomReq.params.userName)
          .then(users => roomRes.json(users))
          .catch(reason => roomRes.send(reason));
     })
     .get('/client/:userClient', function (userReq, userRes) {

       API.getUserByClient(userReq.params.userClient)
          .then(users => roomRes.json(users))
          .catch(reason => roomRes.send(reason));
     })

};
