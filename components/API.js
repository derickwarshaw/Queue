const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

class API {

  /**
   * Get all users from the database.
   * @returns {Promise.<Array.<Object>>} Collection of users.
*/
  static async getUsers () {
    return await currentDatabase.readUsers();
  }

  /**
   * Get a user by assigned index.
   * @param {Number} userId Index of the user.
   * @returns {Promise.<Object>} Found user.
   */
  static async getUserById (userId) {
    if (typeof userId === "number" || !isNaN(parseInt(userId, 10))) {
      return await currentDatabase.readUser("Id", {
        userId: userId
      });
    } else {
      throw Error(`User index '${userId}' is not a number.`);
    }
  }

  /**
   * Get a user by signed distinctor.
   * @param {String} userDistinctor Distinctor of the user.
   * @returns {Promise.<Object>} Found user.
   */
  static async getUserByDistinctor (userDistinctor) {
    if (typeof userDistinctor === "string") {
      return await currentDatabase.readUser("Distinctor", {
        userDistinctor: userDistinctor
      });
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
      return await currentDatabase.readUser("Name", {
        userName: userName
      });
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
   * Get all clients from the database.
   * @returns {Promise.<Array.<Object>>} All clients.
   */
  static async getClients () {
    return await currentDatabase.readClients();
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
   * Get all systems.
   * @returns {Promise.<Array.<Object>>} Collection of systems.
   */
  static async getSystems () {
    return await currentDatabase.readSystems();
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
      throw Error(`'${systemNumber}' is not a system.`);
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
   * Get all rooms.
   * @returns {Promise.<Array.<Object>>} Found rooms.
   */
  static async getRooms () {
    return await currentDatabase.readRooms();
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
   * Get all clients in a room.
   * @param {String} integralRoom Distinctor of the room.
   * @returns {Promise.<Array.<Object>>} Clients in the room.
   */
  static async getIntegrals (integralRoom) {
    return await currentDatabase.readIntegrals(integralRoom);
  }

  /**
   * Get all clients not in a room.
   * @param {String} untegralRoom Distinctor of the room.
   * @returns {Promise.<Array.<Object>>} Clients not in the room.
   */
  static async getUntegrals (untegralRoom) {
    return await currentDatabase.readUntegrals(untegralRoom);
  }
  
}

module.exports = API;