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


}

module.exports = Database;



//Sql.open('../queue.db').then(openedDatabase => {
//  "use strict";
//
//  class Database {
//    static signUser (userObject) {
//      userObject.userId = Identify();
//      userObject.userName = Utility.toProperCase(
//         Utility.fromUserName(userObject.userName)
//      );
//
//      return userObject;
//    }
//    static async readUser (userObject, userBy) {
//      const databaseQuery = new Sequence("SELECT")
//         .all().from("User").where(`User${userBy}`).equals();
//
//      return await currentQueue.add(function () {
//        return openedDatabase.get(databaseQuery.build(), [
//          userObject[`user${userBy}`]
//        ]);
//      });
//    }
//    static async writeUser (userObject) {
//      const databaseQuery = new Sequence("INSERT")
//         .into("User", ["UserId", "UserName", "UserNumber"])
//    }
//  }
//
//  module.exports = Database;
//});
