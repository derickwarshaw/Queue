/**
 * Created by Joshua Crowe on 01/07/2017.
 */

const currentApplication = require('../queue').currentApplication;
const currentQueue = require('../queue').currentQueue;

const Sequence = currentApplication.component('Sequence');
const Identify = currentApplication.component('Identify');
const Sql = currentApplication.component('Sql');


class Database {

  /**
   * Manage the database.
   * @returns Database instance.
   */
  constructor() {
    this.databaseServer = null;
    this.databaseSigns = new Map();
  }

  /**
   * Open the database.
   * @returns {Promise<String>} Database server.
   */
  async open() {
    this.databaseServer = await Sql.open('./queue.db');
    return this.databaseServer;
  }

  /**
   * Read a room from the database.
   * @param {String} roomBy Property to query room by.
   * @param {Object} rawRoomObject User as sent by client.
   * @returns {Promise} Found room.
   */
  async readRoom(roomName) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
       .all().from("Room").where(`Room${roomBy}`).equals();

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
        rawRoomObject[roomBy]
      ]);
    });
  }

  /**
   * Read a user from the database.
   * @param {Object} userRawObject User as sent by a client.
   * @param {String} userBy Property to query users by.
   * @returns {Promise} Found user.
   */
  async readUser(userBy, userRawObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
       .all().from("User").where(`User${userBy}`).equals();

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
        userRawObject[`user${userRawObject}`]
      ]);
    });
  }
}

module.exports = Database;