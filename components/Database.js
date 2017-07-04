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
  constructor () {
    this.databaseServer = null;
    this.databaseSigns = new Map();
  }

  /**
   * Open the database.
   * @returns {Promise<String>} Database server.
   */
  async open () {
    this.databaseServer = await Sql.open('./queue.db');
    return this.databaseServer;
  }

  /**
   * Sign a user.
   * @param {Object} userObject Unsigned user object.
   * @returns {Object} Signed user object.
   */
  signUser (userObject) {
    userObject.userId = Identify();
    this.databaseSigns.set(userObject.userName, userObject.userId);
    return userObject;
  }

  /**
   * Read a user from the database.
   * @param {Object} userObject User.
   * @param {String} userBy Property to query users by.
   * @returns {Promise} Found user.
   */
  async readUser (userObject, userBy) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
       .all().from("User").where(`User${userBy}`).equals();

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
        userObject[`user${userBy}`]
      ]);
    });
  }

  /**
   * Write a user to the database.
   * @param {Object} userObject User to write.
   * @returns {Promise}
   */
  async writeUser (userObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("INSERT")
       .into("User", ["UserId", "UserName", "UserNumber", "UserLocation", "UserDate"])
       .values("User");

    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
        userObject.userId,
        userObject.userName,
        userObject.userNumber,
        userObject.userLocation,
        userObject.userDate
      ]);
    });
  }

  /**
   * Alter a user in the database.
   * @param {Object} userObject Object to reference during alterations.
   * @returns {*}
   */
  async alterUser (userObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("UPDATE")
       .update("User").set(["UserName", "UserNumber", "UserLocation", "ClientId", "AdminId"])
       .where("UserId").equals();

    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
         userObject.userName,
         userObject.userNumber,
         userObject.userLocation,
         userObject.clientId,
         userObject.adminId,
         userObject.userId
      ]);
    });
  }

  // TODO: JSDoc this.
  async readClient (clientUser) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
       .all().from("Client").where("ClientId").equals();

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [clientUser]);
    })
  }

  async readClientsByRoom (roomName) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
        .all().from("Client").join("INNER", "User")
        .on([["Client", "ClientId"], ["User", "ClientId"]], "User");

    return currentQueue.add(function () {
        return databaseServer.get(databaseQuery.build(), []);
    });
  }

  // TODO: JSDoc this.
  async writeClient (clientUser) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("INSERT")
       .into("Client", ["ClientId", "ClientName", "ClientStatus"])
       .values("Client");

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
         Identify(), clientUser, "busy"
      ]);
    });
  }

  // TODO: JSDoc this.
  async alterClient (clientId, clientStatus) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("UPDATE")
       .update("Client").set("ClientStatus")
       .where("ClientId").equals();

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
         clientStatus, clientId
      ]);
    });
  }

}

module.exports = Database;