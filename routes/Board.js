const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (roomReq, roomRes) {
        // TODO: Send them a, "You did not reqest... here's some options" page.
      })
      .get('/:roomName', function (boardReq, boardRes) {
        
        // Step 1: Get the room from the URL param.
        const foundRoom = API.getRoomByName(boardReq.params.roomName);
        
        // Step 2: Get all systems by the room distinctor.
        const foundSystems = API.getSystemsByRoom(foundRoom.roomDistinctor);
        
        // Step 3: Get all clients/users.
        const foundClients = API.getClients();
        const foundUsers = API.getUsers();
        
        // Step 4: Create an array of all system distinctors.
        const mappedSystems = foundSystems.map(foundSystem => {
          return foundSystem.systemDistinctor;
        });
        
        // Step 5: Filter clients by those that are in the system distinctor array.
        // (they are in the array because the client has an assigned system distinctor)
        let attendedClients = [], unattendedClients = [];
        
        for (let i = 0; i < foundClients.length; i++) {
          if (mappedSystems.includes(foundClients[i].clientSystemDistinctor)) {
            attendedClients.push(foundClients[i]);
          } else {
            unattendedClients.push(foundClients[i]);
          }
        }
        
        // Step 6: Get an array of all client distinctors.
        const mappedClients = attendedClients.map(attendedClient => {
          return attendedClient.clientDistinctor;
        });
        
        // Step 7: Filter users by those with a distinctor in the list.
        const filteredUsers = foundUsers.filter(foundUser => {
          return mappedClients.includes(foundUser.userClientDistinctor);
        });
        
        // Step 8: Create new objects with Name, Number, Status
        // Step 9: Create new objects for unattended number.
        // Step 10: Render.
        
      })
  
};