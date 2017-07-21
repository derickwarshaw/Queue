const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Resolve = currentApplication.component('Resolve');

class API {

  /**
   * Get all users from the database.
   * @returns {Promise.<*>} All users in database.
   */
  static async getUsers () {
    return Resolve.collection(await currentDatabase.readUsers());
  }

  /**
   * Get a user by their ID.
   * @param {Number} userId Id of the user.
   * @returns {Promise.<*>} Found user.
   */
  static async getUserById (userId) {
    if (typeof userId === "number" || !isNaN(parseInt(userId, 10))) {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readUser("Id", {
        userId: userId
      });
    } else {
      throw Error(`User ID '${userId}' is not a number.`);
    }
  }

  /**
   * Get a user by their distinctor.
   * @param {String} userDistinctor Distinctor of the user.
   * @returns {Promise.<*>} Found user.
   */
  static async getUserByDistinctor (userDistinctor) {
    if (typeof userDistinctor === "string") {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readUser("Distinctor", {
        userDistinctor: userDistinctor
      });
    } else {
      throw Error(`User Distinctor '${userDistinctor}' is not a string.`);
    }
  }

  /**
   * Get a user by their name.
   * @param {String} userName Name of the user.
   * @returns {Promise.<*>} Found user.
   */
  static async getUserByName (userName) {
    if (typeof userName === "string") {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readUser("Name", {
        userName: userName
      });
    } else {
      throw Error(`User Name '${userName}' is not a string.`);
    }
  }

  
  
  /**
   * Get all clients.
   * @returns {Promise.<*>} All clients.
   */
  static async getClients () {
    return Resolve.collection(await currentDatabase.readClients());
  }

  /**
   * Get a client by their ID.
   * @param {Number} clientId ID of the client.
   * @returns {Promise.<*>} Found client.
   */
  static async getClientById (clientId) {
    if (typeof clientId === "number" || !isNaN(parseInt(clientId, 10))) {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readClient("Id", {
        clientId: clientId
      });
    } else {
      throw Error(`Client ID '${clientId}' is not a number.`);
    }
  }

  /**
   * Get a client by their distinctor.
   * @param {String} clientDistinctor Distinctor of the client.
   * @returns {Promise.<*>} Found client.
   */
  static async getClientByDistinctor (clientDistinctor) {
    if (typeof clientDistinctor === "string") {
      // TODO: Wrap in Resolve.collection
      const foundClient = await currentDatabase.readClient("Distinctor", {
        clientDistinctor: clientDistinctor
      });

      if (foundClient !== undefined) {
        return foundClient;
      } else {
        throw Error(`Client Distinctor '${clientDistinctor}' does not relate to a client.`);
      }
    } else {
      throw Error(`Client Distinctor '${clientDistinctor}' is not a string.`);
    }
  }

  /**
   * Get a client by their handshake.
   * @param {Number} clientHandshake Handshake of the client.
   * @returns {Promise.<*>} Found client.
   */
  static async getClientByHandshake (clientHandshake) {
    if (typeof clientHandshake === "number" || !isNaN(parseInt(clientHandshake, 10))) {
      // TODO: Wrap in Resolve.collection
      const readClient = await currentDatabase.readClient("Handshake", {
        clientHandshake: clientHandshake
      });

      if (readClient !== undefined) {
        return readClient;
      } else {
        throw Error(`Client handshake '${clientHandshake}' relates to no client.`);
      }
    } else {
      throw Error(`Client handshake '${clientHandshake}' is not a number.`);
    }
  }
  
  
  /**
   * Get all systems.
   * @returns {Promise.<Array>}
   */
  static async getSystems () {
    return Resolve.collection(await currentDatabase.readSystems());
  }
  
  /**
   * Get a system by their ID.
   * @param {Number} systemId Unique ID of the system.
   * @returns {Promise.<Object>} Found system.
   */
  static async getSystemById (systemId) {
    if (typeof systemId === "number" || !isNaN(parseInt(systemId, 10))) {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readSystem("Id", {
        systemId: systemId
      });
    } else {
      throw Error(`System ID '${systemId}' is not a system.`);
    }
  }
  
  /**
   * Get a system by their number.
   * @param {Number} systemNumber Number of the system.
   * @returns {Promise.<Object>} Found system.
   */
  static async getSystemByNumber (systemNumber) {
    if (typeof systemNumber === "number" || !isNaN(parseInt(systemNumber, 10))) {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readSystem("Number", {
        systemNumber: systemNumber
      });
    } else {
      throw Error(`System number '${systemNumber}' is not a system.`);
    }
  }
  
  /**
   * Get a system(s) by the room it is in.
   * @param {String} systemRoom Room of the system.
   * @returns {Promise.<Object>} Found system(s).
   */
  static async getSystemByRoom (systemRoom) {
    if (typeof systemRoom === "string") {
      return Resolve.collection(await currentDatabase.readSystem("RoomDistinctor", {
        systemRoomDistinctor: systemRoom
      }));
    } else {
      throw Error(`Room '${systemRoom}' is not a room.`);
    }
  }
  
  
  /**
   * Get all rooms.
   * @returns {Promise.<*>} Found rooms.
   */
  static async getRooms () {
    return Resolve.collection(await currentDatabase.readRooms());
  }

  /**
   * Get a room by the ID.
   * @param {Number} roomId Id of the room.
   * @returns {Promise.<*>} Found room.
   */
  static async getRoomById (roomId) {
    if (typeof roomId === "number" || !isNaN(parseInt(roomId, 10))) {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readRoom("Id", {
        roomId: roomId
      });
    } else {
      throw Error(`Room ID '${roomId}' is not a number.`);
    }
  }

  /**
   * Get a room by the distinctor.
   * @param {String} roomDistinctor Distinctor of the room.
   * @returns {Promise.<*>} Found room.
   */
  static async getRoomByDistinctor (roomDistinctor) {
    if (typeof roomDistinctor === "string") {
      // TODO: Wrap in Resolve.collection
      const foundRoom = await currentDatabase.readRoom("Distinctor", {
        roomDistinctor: roomDistinctor
      });

      if (foundRoom !== undefined) {
        return foundRoom;
      } else {
        throw Error(`Room Distinctor '${roomDistinctor}' does not relate to a room.`);
      }

    } else {
      throw Error(`Room Distinctor '${roomDistinctor}' is not a string.`);
    }
  }

  /**
   * Get a room by the name.
   * @param {String} roomName Name of the room.
   * @returns {Promise.<*>} Found room.
   */
  static async getRoomByName (roomName) {
    if (typeof roomName === "string") {
      // TODO: Wrap in Resolve.collection
      return await currentDatabase.readRooms("Name", {
        roomName: roomName
      });
    } else {
      throw Error(`Room Name '${roomName}' is not a string.`);
    }
  }
  
}

module.exports = API;