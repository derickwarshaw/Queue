const currentDatabase = require('../queue').currentDatabase;

class API {

  /**
   * Get all users from the database.
   * @returns {Promise.<*>} All users in database.
   */
  static async getUsers () {
    return await currentDatabase.readUsers();
  }

  /**
   * Get a user by their ID.
   * @param {Number} userId Id of the user.
   * @returns {Promise.<*>} Found user.
   */
  static async getUserById (userId) {
    if (typeof userId === "number") {
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
      return await currentDatabase.readUser("Name", {
        userName: userName
      });
    } else {
      throw Error(`User Name '${userName}' is not a string.`);
    }
  }

  /**
   * Get all rooms.
   * @returns {Promise.<*>} Found rooms.
   */
  static async getRooms () {
    return await currentDatabase.readRooms();
  }

  /**
   * Get a room by the ID.
   * @param {Number} roomId Id of the room.
   * @returns {Promise.<*>} Found room.
   */
  static async getRoomById (roomId) {
    if (typeof roomId === "number") {
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
      return await currentDatabase.readRoom("Distinctor", {
        roomDistinctor: roomDistinctor
      });
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
      return await currentDatabase.readRooms("Name", {
        roomName: roomName
      });
    } else {
      throw Error(`Room Name '${roomName}' is not a string.`);
    }
  }
  
}

module.exports = API;