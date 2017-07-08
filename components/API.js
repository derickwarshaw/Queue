const currentDatabase = require('../queue').currentDatabase;

class API {
  static async getUsers () {
    return await currentDatabase.readUsers();
  }
  static async getUserById (userId) {
    return await currentDatabase.readUser("Id", {
      userId: userId
    });
  }
  static async getUserByDistinctor (userDistinctor) {
    return await currentDatabase.readUser("Distinctor", {
      userDistinctor: userDistinctor
    });
  }
  static async getUserByName (userName) {
    return await currentDatabase.readUser("Name", {
      userName: userName
    });
  }
  static async getRooms () {
    return await currentDatabase.readRooms();
  }
  static async getRoomById (roomId) {
    if (typeof roomId === "number") {
      return await currentDatabase.readRoom("Id", {
        roomId: roomId
      });
    } else {
      throw Error(`Room ID '${roomId}' is not a number.`);
    }
  }
  static async getRoomByDistinctor (roomDistinctor) {
    return await currentDatabase.readRoom("Distinctor", {
      roomDistinctor: roomDistinctor
    });
  }
  static async getRoomByName (roomName) {
    return await currentDatabase.readRooms("Name", {
      roomName: roomName
    });
  }
}

module.exports = API;