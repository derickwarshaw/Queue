
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
   * @param {Patch} userPatch Patch object.
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
   * Add a system.
   * @param {Object} systemObject Object to reference.
   * @returns {Promise.<Object>} Added user.
   */
  static async addSystem (systemObject) {
    const [systemRoomFound, systemSystemFound] = await Promise.all([
        currentDatabase.readRoom("Name", {roomName: systemObject.systemRoom}),
        currentDatabase.readIntegralSystem(systemObject.systemNumber, systemObject.systemRoom)
    ]);
    
    if (systemRoomFound && !systemSystemFound) {
      systemObject.systemRoomDistinctor = systemRoomFound.roomDistinctor;
      delete systemObject.systemRoom;
      
      await currentDatabase.writeSystem(systemObject);
      return await currentDatabase.readSystem("Distinctor", systemObject);
    } else {
      throw Error(`You cannot register '${systemObject.systemNumber}' in '${systemObject.systemRoom}'.`);
    }
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
   * Patch a system by distinctor.
   * @param systemDistinctor
   * @param {Patch} systemPatch
   * @returns {Promise.<Object>}
   */
  static async patchSystemByDistinctor (systemDistinctor, systemPatch) {
    if (typeof systemDistinctor === "string") {
      let foundSystem = await currentDatabase.readSystem("Distinctor", {systemDistinctor});
      foundSystem[systemPatch.patchItem] = systemPatch.patchValue;
      
      await currentDatabase.alterSystem("Distinctor", foundSystem);
      return await currentDatabase.readSystem("Distinctor", foundSystem);
    } else {
      throw Error(`'${systemDistinctor}' is not a string.`);
    }
  }
  
  /**
   * Delete a system by distinctor.
   * @param systemDistinctor
   * @returns {Promise.<void>}
   */
  static async deleteSystemByDistinctor (systemDistinctor) {
    if (typeof systemDistinctor === "string") {
      await currentDatabase.deleteSystem("Distinctor", {systemDistinctor});
    } else {
      throw Error(`'${systemDistinctor}' is not a string.`);
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
   * @param {Patch} roomPatch Patch object.
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
  
}

module.exports = API;