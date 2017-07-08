const currentDatabase = require('../queue').currentDatabase;

class API {

  // TODO: Jsdoc.
  static async room (roomName) {
    return await currentDatabase.readRoom("Name", {
      roomName: roomName.toUpperCase()
    });
  }
  // TODO: Jsdoc.
  static async rooms () {
    return await currentDatabase.readRooms();
  }
}

module.exports = API;