/**
 * Created by Joshua Crowe on 01/07/2017.
 */

const currentApplication = require('../queue').currentApplication;
const currentQueue = require('../queue').currentQueue;

const Sequence = currentApplication.component('Sequence');
const Identify = currentApplication.component('Identify');
const Sql = currentApplication.component('Sql');

class Database {
  constructor () {
    this.databaseServer = null;
    this.databaseSigns = new Map();
  }

  async open () {
    this.databaseServer = await Sql.open('./queue.db');
    return this.databaseServer;
  }

  signUser (userObject) {
    userObject.userId = Identify();
    this.databaseSigns.set(userObject.userName, userObject.userId);
    return userObject;
  }
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
  async writeUser (userObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("INSERT")
       .into("User", ["UserId", "UserName", "UserNumber", "UserLocation", "UserDate"])
       .values("User");

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
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
