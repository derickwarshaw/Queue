const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

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
                  API.getSystemByRoom(roomFound.roomDistinctor),
                  API.getClients(),
                  API.getUsers()
              ]);
            })
            .then(promisedResults => {
              const [foundSystems, foundClients, foundUsers] = promisedResults;
              
              const mappedSystems = foundSystems.map(foundSystem => {
                return foundSystem.systemDistinctor;
              });
              
              let attendedClients = [], unattendedClients = [];
              for (let i = 0; i < foundClients.length; i++) {
                const forClient = foundClients[i];
                
                if (mappedSystems.includes(forClient.clientSystemDistinctor)) {
                  attendedClients.push(forClient);
                } else {
                  unattendedClients.push(forClient);
                }
              }
              
              const mappedClients = attendedClients.map(attendedClient => {
                return attendedClient.clientDistinctor;
              });
              
              const filteredUsers = foundUsers.filter(foundUser => {
                return mappedClients.includes(foundUser.userClientDistinctor);
              });
              
              boardRes.json(filteredUsers);
            })
        
        
        //
        // // Step 8: Create new objects with Name, Number, Status
        // // Step 9: Create new objects for unattended number.
        // // Step 10: Render.
        
      });
  
};