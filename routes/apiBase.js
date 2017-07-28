const API = require('../components/API');

module.exports = routerInstance => {
  "use strict";

  return routerInstance
     .get('/', function (roomReq, roomRes) {
       "use strict";

       roomRes.json([
         {
           routeName: 'User',
           routeQuery: ['id', 'distinctor', 'name']
         },
         {
           routeName: 'Client',
           roomQuery: ['id', 'distinctor', 'handshake']
         },
         {
           routeName: 'Room',
           routeQuery: ['id', 'distinctor', 'name']
         }
       ]);
     });

};