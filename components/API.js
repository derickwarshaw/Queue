
const currentDatabase = require('../queue').currentDatabase;

class API {
  
  /**
   * Add a user.
   * @param {Object} userObject User object to reference.
   * @returns {Promise.<void>}
   */
  static async addUser (userObject) {
    await currentDatabase.writeUser(userObject);
    return await currentDatabase.readUser("Name", userObject);
  }
  
  /**
   * Get all users.
   * @returns {Promise.<Array.<Object>>} Collection of users.
*/
  static async getUsers () {
    return await currentDatabase.readUsers();
  }
  
  /**
   * Get all generic user records that ignore relationships.
   * @returns {Promise.<Array.<Object>>} Generic user records.
   */
  static async getGenericUsers () {
    return await currentDatabase.readGenericUsers();
  }
  
  /**
   * Get all integral user records that depend on relationships.
   * @returns {Promise.<*>}
   */
  static async getIntegralUsers () {
    return await currentDatabase.readIntegralUsers();
  }
  
  /**
   * Get all registered clients in a room.
   * @param {String} integralRoom Room the users are in.
   * @returns {Promise.<Array.<Object>>} Integral user records for that room.
   */
  static async getIntegralUsersByRoom (integralRoom) {
    return await currentDatabase.readIntegralUsersByRoom(integralRoom);
  }
  
  /**
   * Get all unregistered clients .
   * @returns {Promise.<Array.<Object>>} All unregistered clients
   */
  static async getExtrinsicUsers() {
    return await currentDatabase.readExtrinsicUsers();
  }
  
  /**
   * Get all unregistered clients in a room.
   * @param extrinsicRoom
   * @returns {Promise.<*>}
   */
  static async getExtrinsicUsersByRoom (extrinsicRoom) {
    return await currentDatabase.readExtrinsicUsersByRoom(extrinsicRoom);
  }
  
  /**
   * Delete all users.
   * @returns {Promise.<void>}
   */
  static async deleteUsers () {
    await currentDatabase.deleteUsers();
  }
  
  
  

  /**
   * Get a user by assigned index.
   * @param {Number} userId Index of the user.
   * @returns {Promise.<Object>} Found user.
   */
  static async getUserById (userId) {
    if (typeof userId === "number" || !isNaN(parseInt(userId, 10))) {
      return await currentDatabase.readUser("Id", {userId});
    } else {
      throw Error(`User index '${userId}' is not a number.`);
    }
  }
  
  /**
   * Patch a user by index.
   * @param {Number|String} userId Index of the user.
   * @param {Object} userPatch Patch object.
   * @returns {Promise.<Object>} Patcheduser.
   */
  static async patchUserById (userId, userPatch) {
    if (typeof userId === "number" || !isNaN(parseInt(userId, 10))) {
      let foundUser = await currentDatabase.readUser("Id", {userId});
      foundUser[userPatch.patchItem] = userPatch.patchValue;
  
      await currentDatabase.alterUser({
        userId: foundUser.userId,
        userDistinctor: foundUser.userDistinctor,
        userName: foundUser.userName,
        userDate: foundUser.userDate,
        userClient: {clientDistinctor: foundUser.userClientDistinctor},
        userAdmin: {adminDistinctor: null}
      });
      return await currentDatabase.readUser("Distinctor", foundUser);
    } else {
      throw Error(`'${userId}' is not a number.`);
    }
  }
  
  /**
   * Delete a user by index.
   * @param {Number|String} userId Index of the user.
   * @returns {Promise.<void>}
   */
  static async deleteUserById (userId) {
    if (typeof userId === "number" || !isNaN(parseInt(userId, 10))) {
      await currentDatabase.deleteUser("Id", {userId});
    } else {
      throw Error(`'${userId}' is not a number.`);
    }
  }

  /**
   * Get a user by signed distinctor.
   * @param {String} userDistinctor Distinctor of the user.
   * @returns {Promise.<Object>} Found user.
   */
  static async getUserByDistinctor (userDistinctor) {
    if (typeof userDistinctor === "string") {
      return await currentDatabase.readUser("Distinctor", {userDistinctor});
    } else {
      throw Error(`'${userDistinctor}' is not a string.`);
    }
  }
  
  /**
   * Patch a user by distinctor.
   * @param {String} userDistinctor Distinctor of the user.
   * @param {Object} userPatch Patch object.
   * @returns {Promise.<Object>} Patched user.
   */
  static async patchUserByDistinctor (userDistinctor, userPatch) {
    if (typeof userDistinctor === "string") {
      let foundUser = await currentDatabase.readUser("Distinctor", {userDistinctor});
      foundUser[userPatch.patchItem] = userPatch.patchValue;

      await currentDatabase.alterUser({
        userId: foundUser.userId,
        userDistinctor: foundUser.userDistinctor,
        userName: foundUser.userName,
        userDate: foundUser.userDate,
        userClient: {clientDistinctor: foundUser.userClientDistinctor},
        userAdmin: {adminDistinctor: null}
      });
      return await currentDatabase.readUser("Distinctor", foundUser);
    } else {
      throw Error(`'${userDistinctor}' is not a string.`);
    }
  }
  
  /**
   * Delete a user by distinctor.
   * @param {String} userDistinctor Distinctor of the user.
   * @returns {Promise.<void>}
   */
  static async deleteUserByDistinctor (userDistinctor) {
    if (typeof userDistinctor === "string") {
      await currentDatabase.deleteUser("Distinctor", {userDistinctor});
    } else {
      throw Error(`'${userDistinctor}' is not a string.`);
    }
  }

  /**
   * Get a user by given name.
   * @param {String} userName Name of the user.
   * @returns {Promise.<Object>} Found user.
   */
  static async getUserByName (userName) {
    if (typeof userName === "string") {
      return await currentDatabase.readUser("Name", {userName});
    } else {
      throw Error(`'${userName}' is not a string.`);
    }
  }
  
  /**
   * Patch a user by name.
   * @param {String} userName Name of the user.
   * @param {Object} userPatch Patch object.
   * @returns {Promise.<Object>} Patched user.
   */
  static async patchUserByName (userName, userPatch) {
    if (typeof userName === "string") {
      let foundUser = await currentDatabase.readUser("Name", {userName});
      foundUser[userPatch.patchItem] = userPatch.patchValue;

      await currentDatabase.alterUser({
        userId: foundUser.userId,
        userDistinctor: foundUser.userDistinctor,
        userName: foundUser.userName,
        userDate: foundUser.userDate,
        userClient: {clientDistinctor: foundUser.userClientDistinctor},
        userAdmin: {adminDistinctor: null}
      });
      return await currentDatabase.readUser("Distinctor", foundUser);
    } else {
      throw Error(`'${userName}' is not a string.`);
    }
  }
  
  /**
   * Delete a user by name.
   * @param {String} userName Name of the user.
   * @returns {Promise.<void>}
   */
  static async deleteUserByName (userName) {
    if (typeof userName === "string") {
      await currentDatabase.deleteUser("Name", {userName});
    } else {
      throw Error(`'${userName}' is not a string.`);
    }
  }

  /**
   * Get a user by signed client distinctor.
   * @param {String} clientDistinctor Distinctor of the client registered to user.
   * @returns {Promise.<Object>} User with the client distinctor.
   */
  static async getUserByClient (clientDistinctor) {
    if (typeof clientDistinctor === "string") {
      return await currentDatabase.readUser("ClientDistinctor", {
        userClientDistinctor: clientDistinctor
      });
    } else {
      throw Error(`'${clientDistinctor}' is not a string.`);
    }
  }
  
  /**
   * Patch a user by client distinctor.
   * @param {String} userClient Client distinctor.
   * @param {Object} userPatch Patch object.
   * @returns {Promise.<Object>} Patched user.
   */
  static async patchUserByClient (userClient, userPatch) {
    if (typeof userClient === "string") {
      let foundUser = await currentDatabase.readUser("ClientDistinctor", {
        userClientDistinctor: userClient
      });
      foundUser[userPatch.patchItem] = userPatch.patchValue;

      await currentDatabase.alterUser({
        userId: foundUser.userId,
        userDistinctor: foundUser.userDistinctor,
        userName: foundUser.userName,
        userDate: foundUser.userDate,
        userClient: {clientDistinctor: foundUser.userClientDistinctor},
        userAdmin: {adminDistinctor: null}
      });
      return await currentDatabase.readUser("ClientDistinctor", foundUser)
    } else {
      throw Error(`'${userClient}' is not a string.`);
    }
  }
  
  /**
   * Delete a user by client distinctor.
   * @param {String} userClient Client distinctor.
   * @returns {Promise.<void>}
   */
  static async deleteUserByClient (userClient) {
    if (typeof userClient === "string") {
      await currentDatabase.deleteUser("ClientDistinctor", {
        userClientDistinctor: userClient
      });
    } else {
      throw Error(`'${userClient}' is not a string.`);
    }
  }
  
  
  
  
  /**
   * Get all clients from the database.
   * @returns {Promise.<Array.<Object>>} All clients.
   */
  static async getClients () {
    return await currentDatabase.readClients();
  }
  
  /**
   * Get all generic clients.
   * @returns {Promise.<Array.<Object>>} All generic clients.
   */
  static async getGenericClients () {
    return await currentDatabase.readGenericClients();
  }
  
  /**
   * Delete all clients from the database.
   * @returns {Promise.<void>}
   */
  static async deleteClients () {
    await currentDatabase.deleteClients();
  }
  
  
  
  
  /**
   * Get a client by index.
   * @param {Number} clientId Index of the client.
   * @returns {Promise.<Object>} Found client.
   */
  static async getClientById (clientId) {
    if (typeof clientId === "number" || !isNaN(parseInt(clientId, 10))) {
      return await currentDatabase.readClient("Id", {
        clientId: clientId
      });
    } else {
      throw Error(`'${clientId}' is not a parseable number.`);
    }
  }
  
  /**
   * Delete a client by index.
   * @param {Number} clientId Index of the client.
   * @returns {Promise.<*>}
   */
  static async deleteClientById (clientId) {
    if (typeof clientId === "number" || !isNaN(parseInt(clientId, 10))) {
      return await currentDatabase.deleteClient("Id", {
        clientId: parseInt(clientId, 10)
      });
    } else {
      throw Error(`'${clientId}' is not a number.`);
    }
  }

  /**
   * Get a client by signed distinctor.
   * @param {String} clientDistinctor Distinctor of the client.
   * @returns {Promise.<Object>} Found client.
   */
  static async getClientByDistinctor (clientDistinctor) {
    if (typeof clientDistinctor === "string") {
      return await currentDatabase.readClient("Distinctor", {
        clientDistinctor: clientDistinctor
      });
    } else {
      throw Error(`'${clientDistinctor}' is not a string.`);
    }
  }
  
  /**
   * Delete a client by signed distinctor.
   * @param {String} clientDistinctor Signed distinctor.
   * @returns {Promise.<void>}
   */
  static async deleteClientByDistinctor (clientDistinctor) {
    if (typeof clientDistinctor === "string") {
      currentDatabase.deleteClient("Distinctor", {
        clientDistinctor: clientDistinctor
      });
    } else {
      throw Error(`'${clientDistinctor}' is not a string.`);
    }
  }

  /**
   * Get a client by socket handshake.
   * @param {Number} clientHandshake Handshake of the client.
   * @returns {Promise.<Object>} Found client.
   */
  static async getClientByHandshake (clientHandshake) {
    if (typeof clientHandshake === "number" || !isNaN(parseInt(clientHandshake, 10))) {
      return await currentDatabase.readClient("Handshake", {
        clientHandshake: clientHandshake
      });
    } else {
      throw Error(`'${clientHandshake}' is not a parseable number.`);
    }
  }
  
  /**
   * Delete a client by socket handshake.
   * @param {String} clientHandshake Socket handshake.
   * @returns {Promise.<void>}
   */
  static async deleteClientByHandshake (clientHandshake) {
    if (typeof clientHandshake === "string") {
      currentDatabase.deleteClient("Handshake", {
        clientHandshake: clientHandshake
      });
    } else {
      throw Error(`'${clientHandshake}' is not a string.`);
    }
  }

  /**
   * Get a client by signed system distinctor.
   * @param {String} systemClient Distinctor of client.
   * @returns {Promise.<Object>} Found client.
   */
  static async getClientBySystem (systemClient) {
    if (typeof systemClient === "string") {
      return await currentDatabase.readClient("SystemDistinctor", {
        clientSystemDistinctor: systemClient
      });
    } else {
      throw Error(`'${systemClient}' is not a string.`);
    }
  }
  
  /**
   * Delete a client by signed system distinctor.
   * @param {String} systemClient Signed system distinctor.
   * @returns {Promise.<*>}
   */
  static async deleteClientBySystem (systemClient) {
    if (typeof systemClient === "string") {
      return await currentDatabase.deleteClient("SystemDistinctor", {
        clientSystemDistinctor: systemClient
      });
    } else {
      throw Error(`'${systemClient}' is not a string.`);
    }
  }
  
  
  
  
  /**
   * Add a system.
   * @param {Object} systemObject Object to reference.
   * @returns {Promise.<Object>} Added user.
   */
  static async addSystem (systemObject) {
    await currentDatabase.writeSystem(systemObject);
    return await currentDatabase.readSystem("Name", systemObject);
  }

  /**
   * Get all systems.
   * @returns {Promise.<Array.<Object>>} Collection of systems.
   */
  static async getSystems () {
    return await currentDatabase.readSystems();
  }
  
  /**
   * Delete all systems.
   * @returns {Promise.<void>}
   */
  static async deleteSystems () {
    await currentDatabase.deleteSystems();
  }
  
  
  
  
  /**
   * Get a system by index.
   * @param {Number} systemId Index of the system.
   * @returns {Promise.<Object>} Found system.
   */
  static async getSystemById (systemId) {
    if (typeof systemId === "number" || !isNaN(parseInt(systemId, 10))) {
      return await currentDatabase.readSystem("Id", {
        systemId: systemId
      });
    } else {
      throw Error(`'${systemId}' is not a system.`);
    }
  }
  
  /**
   * Patch a system by index.
   * @param {Number|String} systemId Index of the system.
   * @param {Object} systemPatch Patch object.
   * @returns {Promise.<Object>} Patched system.
   */
  static async patchSystemById (systemId, systemPatch) {
    if (typeof systemId === "number" || !isNaN(parseInt(systemId, 10))) {
      let foundSystem = currentDatabase.readSystem("Id", {systemId});
      foundSystem[systemPatch.patchItem] = systemPatch.patchValue;
  
      await currentDatabase.alterSystem("Id", foundSystem);
      return await currentDatabase.readSystem("Id", foundSystem);
    } else {
      throw Error(`'${systemId}' is not a number.`);
    }
  }
  
  /**
   * Deelte a system by index.
   * @param {Number|String} systemId Index of the system.
   * @returns {Promise.<void>}
   */
  static async deleteSystemById (systemId) {
    if (typeof systemId === "number" || !isNaN(parseInt(systemId, 10))) {
      await currentDatabase.deleteSystem("Id", {systemId});
    } else {
      throw Error(`'${systemId}' is not a number.`);
    }
  }

  /**
   * Get a system by distinctor.
   * @param {String} systemDistinctor Distinctor of the system.
   * @returns {Promise.<Object>} Collection of systems.
   */
  static async getSystemByDistinctor (systemDistinctor) {
    if (typeof systemDistinctor === "string") {
      return await currentDatabase.readSystem("Distinctor", {
        systemDistinctor: systemDistinctor
      });
    } else {
      throw Error(`'${systemDistinctor}' is not a system.`);
    }
  }
  
  /**
   * Get a system by number.
   * @param {Number} systemNumber Number of the system.
   * @returns {Promise.<Object>} Found system.
   */
  static async getSystemByNumber (systemNumber) {
    if (typeof systemNumber === "number" || !isNaN(parseInt(systemNumber, 10))) {
      return await currentDatabase.readSystem("Number", {
        systemNumber: systemNumber
      });
    } else {
      throw Error(`'${systemNumber}' is not a number.`);
    }
  }
  
  /**
   * Patch a system by number.
   * @param {Number|String} systemNumber Number of the system.
   * @param {Object} systemPatch Patch object.
   * @returns {Promise.<Object>} Patched system.
   */
  static async patchSystemByNumber (systemNumber, systemPatch) {
    if (typeof systemNumber === "number" || !isNaN(parseInt(systemNumber, 10))) {
      let foundSystem = await currentDatabase.readSystem("Number", {systemNumber});
      foundSystem[systemPatch.patchItem] = systemPatch.patchValue;
  
      await currentDatabase.alterSystem("Number", foundSystem);
      return await currentDatabase.readSystem("Number", foundSystem);
    } else {
      throw Error(`'${systemNumber}' is not a number.`);
    }
  }
  
  /**
   * Delete a system by number.
   * @param {Number|String} systemNumber Number of the system.
   * @returns {Promise.<void>}
   */
  static async deleteSystemByNumber (systemNumber) {
    if (typeof systemNumber === "number" || !isNaN(parseInt(systemNumber, 10))) {
      await currentDatabase.deleteSystem("Number", {systemNumber});
    } else {
      throw Error(`'${systemNumber}' is not a number.`);
    }
  }
  
  /**
   * Get a systems by the room.
   * @param {String} systemRoom Room of the system.
   * @returns {Promise.<Object>} Found systems.
   */
  static async getSystemByRoom (systemRoom) {
    if (typeof systemRoom === "string") {
      return await currentDatabase.readSystem("RoomDistinctor", {
        systemRoomDistinctor: systemRoom
      });
    } else {
      throw Error(`'${systemRoom}' is not a string.`);
    }
  }
  
  /**
   * Patch a system by room distinctor.
   * @param {String} systemRoom Room distinctor.
   * @param {Object} systemPatch Patch object.
   * @returns {Promise.<Object>} Patched system.
   */
  static async patchSystemByRoom (systemRoom, systemPatch) {
    if (typeof systemRoom === "string") {
      let foundRoom = currentDatabase.readSystem("RoomDistinctor", {
        systemRoomDistinctor: systemRoom
      });
  
      foundRoom[systemPatch.patchItem] = systemPatch.patchValue;
  
      await currentDatabase.alterSystem("RoomDistinctor", foundRoom);
      return await currentDatabase.readSystem("RoomDistinctor", foundRoom);
    } else {
      throw Error(`'${systemRoom}' is not a string.`);
    }
  }
  
  /**
   * Delete a system by room distinctor.
   * @param {String} systemRoom Distinctor of the room.
   * @returns {Promise.<void>}
   */
  static async deleteSystemByRoom (systemRoom) {
    if (typeof systemRoom === "string") {
      await currentDatabase.deleteSystem("RoomDistinctor", {
        systemRoomDistinctor: systemRoom
      });
    } else {
      throw Error(`'${systemRoom}' is not a string.`);
    }
  }
  
  
  
  
  /**
   * Add a room.
   * @param {String} roomName Name of the room.
   * @returns {Promise.<void>}
   */
  static async addRoom (roomName) {
    await currentDatabase.writeRoom(roomName);
  }

  /**
   * Get all rooms.
   * @returns {Promise.<Array.<Object>>} Found rooms.
   */
  static async getRooms () {
    return await currentDatabase.readRooms();
  }
  
  /**
   * Delete all rooms.
   * @returns {Promise.<void>}
   */
  static async deleteRooms () {
    await currentDatabase.deleteRooms();
  }
  
  
  

  /**
   * Get a room by index.
   * @param {Number} roomId Index of the room.
   * @returns {Promise.<Object>} Found room.
   */
  static async getRoomById (roomId) {
    if (typeof roomId === "number" || !isNaN(parseInt(roomId, 10))) {
      return await currentDatabase.readRoom("Id", {
        roomId: roomId
      });
    } else {
      throw Error(`'${roomId}' is not a parseable number.`);
    }
  }

  /**
   * Patch a room by index.
   * @param {Number} roomId Index of room.
   * @param {Object} roomPatch Patch object.
   * @returns {Promise.<Object>} Patched room.
   */
  static async patchRoomById (roomId, roomPatch) {
    if (typeof roomId === "number" || !isNaN(parseInt(roomId, 10))) {
      let roomFound = await currentDatabase.readRoom("Id", {roomId});
      roomFound[roomPatch.patchItem] = roomPatch.patchValue;
  
      await currentDatabase.alterRoom("Id", roomFound);
      return await currentDatabase.readRoom("Id", roomFound);
    } else {
      throw Error(`'${roomId}' is not a number.`);
    }
  }
  
  /**
   * Delete a room by index.
   * @param {Number} roomId Index of the room.
   * @returns {Promise.<void>}
   */
  static async deleteRoomById(roomId) {
    if (typeof roomId === "number" || !isNaN(parseInt(roomId, 10))) {
      await currentDatabase.deleteRoom("Id", {roomId: roomId});
    } else {
      throw Error(`'${roomId}' is not a number.`);
    }
  }

  /**
   * Get a room by distinctor.
   * @param {String} roomDistinctor Distinctor of the room.
   * @returns {Promise.<Object>} Found room.
   */
  static async getRoomByDistinctor (roomDistinctor) {
    if (typeof roomDistinctor === "string") {
      return await currentDatabase.readRoom("Distinctor", {
        roomDistinctor: roomDistinctor
      });
    } else {
      throw Error(`'${roomDistinctor}' is not a string.`);
    }
  }

  /**
   * Patch a room by distinctor.
   * @param {String|Number} roomDistinctor Distinctor of the user.
   * @param {Object} roomPatch Patch object.
   * @returns {Promise.<void>}
   */
  static async patchRoomByDistinctor (roomDistinctor, roomPatch) {
    if (typeof roomDistinctor === "string") {
      let roomFound = await currentDatabase.readRoom("Distinctor", {roomDistinctor});
      roomFound[roomPatch.patchItem] = roomPatch.patchValue;
  
      await currentDatabase.alterRoom("Distinctor", roomFound);
    } else {
      throw Error(`'${roomDistinctor}' is not a string`);
    }
  }

  /**
   * Delete a room by distinctor.
   * @param roomDistinctor
   * @returns {Promise.<void>}
   */
  static async deleteRoomByDistinctor (roomDistinctor) {
    if (typeof roomDistinctor === "string") {
      await currentDatabase.deleteRoom("Distinctor", {roomDistinctor})
    } else {
      throw Error(`'${roomDistinctor}' is not a string.`);
    }
  }

  /**
   * Get a room by name.
   * @param {String} roomName Name of the room.
   * @returns {Promise.<Object>} Found room.
   */
  static async getRoomByName (roomName) {
    if (typeof roomName === "string") {
      return await currentDatabase.readRoom("Name", {
        roomName: roomName
      });
    } else {
      throw Error(`'${roomName}' is not a string.`);
    }
  }

  /**
   * Patch a room by name.
   * @param {String} roomName Name of room.
   * @param {Object} roomPatch Patch object.
   * @returns {Promise.<Object>} Patched room.
   */
  static async patchRoomByName (roomName, roomPatch) {
    if (typeof roomName === "string") {
      let roomFound = currentDatabase.readRoom("Name", {roomName});
      roomFound[roomPatch.patchItem] = roomPatch.patchValue;
  
      await currentDatabase.alterRoom("Name", roomFound);
      return await currentDatabase.readRoom("Name", roomFound);
    } else {
      throw Error(`'${roomName}' is not a string.`);
    }
  }

  /**
   * Delete a room by name.
   * @param {String} roomName Name of room.
   * @returns {Promise.<void>}
   */
  static async deleteRoomByName (roomName) {
    if (typeof roomName === "string") {
      await currentDatabase.deleteRoom("Name", {roomName});
    } else {
      throw Error(`'${roomName}' is not a string.`);
    }
  }
  
}

module.exports = API;