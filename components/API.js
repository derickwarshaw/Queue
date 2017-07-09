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
    return await currentDatabase.readUser("Id", {
      userId: userId
    });
  }

  /**
   * Get a user by their distinctor.
   * @param {String} userDistinctor Distinctor of the user.
   * @returns {Promise.<*>} Found user.
   */
  static async getUserByDistinctor (userDistinctor) {
    return await currentDatabase.readUser("Distinctor", {
      userDistinctor: userDistinctor
    });
  }

  /**
   * Get a user by their name.
   * @param {String} userName Name of the user.
   * @returns {Promise.<*>} Found user.
   */
  static async getUserByName (userName) {
    return await currentDatabase.readUser("Name", {
      userName: userName
    });
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
    return await currentDatabase.readRoom("Distinctor", {
      roomDistinctor: roomDistinctor
    });
  }

  /**
   * Get a room by the name.
   * @param {String} roomName Name of the room.
   * @returns {Promise.<*>} Found room.
   */
  static async getRoomByName (roomName) {
    return await currentDatabase.readRooms("Name", {
      roomName: roomName
    });
  }
  
}

module.exports = API;