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
        this.databaseSigned = new Map();
    }

    /**
     * Open the database
     * @returns {Promise}
     */
    async open () {
      this.databaseServer = await Sql.open('queue.db');
      return this.databaseServer;
    }

    /**
     * Sign a user with a unique identifier.
     * @param {Object} userObject User to sign.
     * @returns {Object} Signed user.
     */
    signUser (userObject) {
        const userIdentification = Identify();

        userObject.userDistinctor = userIdentification;
        this.databaseSigned.set(userIdentification, userObject);

        return userObject;
    }

    /**
     * Read a user from the database.
     * @param {String} userBy Property to query a user by.
     * @param {Object} userObject Object to query against.
     * @return {Object} User from the database.
     */
    readUser (userBy, userObject) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("SELECT")
            .all().from("User").where(`user${userBy}`).equals();

        return currentQueue.add(function () {
            return databaseServer.get(databaseQuery.build(), [
                userObject[`user${userBy}`]
            ]);
        });
    }

    // TODO: JSdoc.
    readUsers () {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT")
         .all().from("User");

      return currentQueue.add(function () {
        return databaseServer.get(databaseQuery.build(), []);
      });
    }

    /**
     * Alter a user in the database.
     * @param {Object} userObject User to alter.
     * @returns {*} ?
     */
    alterUser (userObject) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("UPDATE")
            .update("User").set([
                "userDistinctor",
                "userName",
                "userDate",
                "userClientDistinctor",
                "userAdminDistinctor"
            ])
            .where("userDistinctor").equals();

        return currentQueue.add(function () {
            return databaseServer.run(databaseQuery.build(), [
                userObject.userDistinctor,
                userObject.userName,
                userObject.userDate,
                userObject.userClient.clientDistinctor,
                userObject.userAdmin.adminDistinctor,
                userObject.userDistinctor
            ]);
        });
    }

    /**
     * Write a user to the database.
     * @param {Object} userObject User to write.
     * @returns {*} ?
     */
    writeUser (userObject) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("INSERT")
            .into("User", ["userName", "userDistinctor", "userDate"])
            .values("User");

        return currentQueue.add(function () {
            return databaseServer.run(databaseQuery.build(), [
                userObject.userName,
                userObject.userDistinctor,
                userObject.userDate
            ]);
        });
    }


    signClient (clientObect) {
        clientObect.clientDistinctor = Identify();
        return clientObect;
    }

    /**
     * Read a client from the database.
     * @param clientBy Property to query the user by.
     * @param clientObject User to query against.
     * @returns {*} Read client.
     */
    readClient (clientBy, clientObject) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("SELECT")
            .all().from("Client").where(`client${clientBy}`).equals();

        return currentQueue.add(function () {
            return databaseServer.get(databaseQuery.build(), [
                clientObject[`client${clientBy}`]
            ]);
        });
    }

    // TODO: JSdoc.
    resolveClient (clientDistinctor) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("SELECT")
            .all().from("Client").where("clientDistinctor").equals();

        return currentQueue.add(function () {
            return databaseServer.get(databaseQuery.build(), [clientDistinctor]);
        })
    }

    // TODO: JSdoc.
    alterClient (clientObject) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("UPDATE")
            .update("Client").set(["clientDistinctor", "clientRoomDistinctor", "clientHandshake", "clientStatus"])
            .values("Client")
            .where("clientDistinctor").equals();

        return currentQueue.add(function () {
            return databaseServer.get(databaseQuery.build(), [
                clientObject.clientDistinctor,
                clientObject.clientRoom.roomDistinctor,
                clientObject.clientHandshake,
                clientObject.clientStatus,
                clientObject.clientDistinctor
            ]);
        });
    }

    // TODO: JSdoc
    writeClient (clientObect) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("INSERT")
            .into("Client", ["clientDistinctor", "clientRoomDistinctor", "clientHandshake", "clientStatus"])
            .values("Client");

        return currentQueue.add(function () {
            return databaseServer.run(databaseQuery.build(), [
                clientObect.clientDistinctor,
                clientObect.clientRoom.roomDistinctor,
                clientObect.clientHandshake,
                clientObect.clientStatus
            ]);
        });
    }

    deleteClient (clientHandshake) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("DELETE")
           .from("Client").where("clientHandshake").equals();

        return currentQueue.add(function () {
            return databaseServer.run(databaseQuery.build(), [clientHandshake]);
        });
    }

    // TODO: JSDoc.
    readRoom(roomBy, roomObject) {
        const databaseServer = this.databaseServer;
        const databaseQuery = new Sequence("SELECT")
            .all().from("Room").where(`room${roomBy}`).equals();

        return currentQueue.add(function () {
            return databaseServer.get(databaseQuery.build(), [
                roomObject[`room${roomBy}`]
            ])
        })
    }

    // TODO: JSdoc.
    readRooms () {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT")
         .all().from("Room");

      return currentQueue.add(function () {
        return databaseServer.get(databaseQuery.build(), []);
      });
    }
}

module.exports = Database;