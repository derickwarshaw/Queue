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
   * Manage a database.
   */
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
   * Read all users from the database..
   */
  readUsers () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
        .all().from("User");
    
    return currentQueue.add(function () {
      return databaseServer.all(databaseQuery.build(), []);
    });
  }
  
  /**
   * Delete all users from the database.
   */
  deleteUsers () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
        .from("User");
    
    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), []);
    });
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
  
  /**
   * Delete a user from the database.
   * @param {String} userBy Property to query user with.
   * @param {Object} userObject Object to query against.
   */
  deleteUser (userBy, userObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
        .from("User").where(`user${userBy}`).equals();
    
    return currentQueue.add(function () {
      databaseServer.run(databaseQuery.build(), [
          userObject[`user${userBy}`]
      ]);
    });
  }
  
  /**
   * Sign a client with a distinctor.
   * @param {Object} clientObect Client to be signed.
   * @returns {Object} Signed client.
   */
  signClient (clientObect) {
      clientObect.clientDistinctor = Identify();
      return clientObect;
  }
  
  /**
   * Read all clients.
   * @returns {*} All client records.
   */
  readClients () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
        .all().from("Client");
    
    return currentQueue.add(function () {
      return databaseServer.all(databaseQuery.build(), []);
    });
  }
  
  /**
   * Delete all clients from the database.
   * @returns {Promise}
   */
  deleteClients () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
        .from("Client");
    
    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), []);
    })
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

  /**
   * Alter a client database record.
   * @param {Object} clientObject Client to reference with alterations.
   * @returns {*} ?
   */
  alterClient (clientObject) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("UPDATE")
          .update("Client").set(["clientDistinctor", "clientSystemDistinctor", "clientHandshake", "clientStatus"])
          .values("Client")
          .where("clientDistinctor").equals();

      return currentQueue.add(function () {
          return databaseServer.get(databaseQuery.build(), [
              clientObject.clientDistinctor,
              clientObject.clientSystem.systemDistinctor,
              clientObject.clientHandshake,
              clientObject.clientStatus,
              clientObject.clientDistinctor
          ]);
      });
  }

  /**
   * Write a client to the database.
   * @param {Object} clientObect Client object to be referenced for values.
   * @returns {*} ?
   */
  writeClient (clientObect) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("INSERT")
          .into("Client", ["clientDistinctor", "clientSystemDistinctor", "clientHandshake", "clientStatus"])
          .values("Client");

      return currentQueue.add(function () {
          return databaseServer.run(databaseQuery.build(), [
              clientObect.clientDistinctor,
              clientObect.clientSystem.systemDistinctor,
              clientObect.clientHandshake,
              clientObect.clientStatus
          ]);
      });
  }

  /**
   * Delete a client from the database.
   * @param {String} clientBy Property to query the client against.
   * @param {Object} clientObject Object to query against.
   * @returns {*} ?
   */
  deleteClient (clientBy, clientObject) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("DELETE")
         .from("Client").where(`client${clientBy}`).equals();

      return currentQueue.add(function () {
          return databaseServer.run(databaseQuery.build(), [
             clientObject[`client${clientBy}`]
          ]);
      });
  }
  
  /**
   * Read all rooms from the database.
   * @returns {*} All rooms.
   */
  readRooms () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
        .all().from("Room");
    
    return currentQueue.add(function () {
      return databaseServer.all(databaseQuery.build(), []);
    });
  }
  
  /**
   * Delete all rooms from the database.
   * @returns {Promise}
   */
  deleteRooms () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
        .from("Room");
    
    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), []);
    });
  }
  
  /**
   * Read a room from the database.
   * @param {String} roomBy Property to query the room with.
   * @param {Object} roomObject Object to query the room against.
   * @returns {*} Found room.
   */
  readRoom(roomBy, roomObject) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT")
          .all().from("Room").where(`room${roomBy}`).equals();

      return currentQueue.add(function () {
          return databaseServer.get(databaseQuery.build(), [
              roomObject[`room${roomBy}`]
          ]);
      })
  }
  
  /**
   * Alter a room in the database.
   * @param {String} roomBy Property to alter the user by.
   * @param {Object} roomObject Room to query against.
   */
  alterRoom (roomBy, roomObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("UPDATE")
        .update("Room").set(["roomDistinctor", "roomName"])
        .values("Room")
        .where(`room${roomBy}`).equals();
    
    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
          roomObject.roomDistinctor,
          roomObject.roomName,
          roomObject[`room${roomBy}`]
      ]);
    });
  }
  
  /**
   * Write a room to the database.
   * @param {String} roomName Name of the room.
   * @returns {Promise}
   */
  writeRoom (roomName) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("INSERT")
        .into("Room", ["roomDistinctor", "roomName"])
        .values("Room");
    
    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
          Identify(), roomName
      ]);
    });
  }
  
  /**
   * Delete a room from the database.
   * @param {String} roomBy Property to query user with.
   * @param {Object} roomObject Object to query against.
   */
  deleteRoom (roomBy, roomObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
        .from("Room").where(`room${roomBy}`).equals();
    
    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
          roomObject[`room${roomBy}`]
      ]);
    });
  }

  /**
   * Read all systems from the database.
   * @returns {LocalPromise}
   */
  readSystems () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
        .all().from("System");
    
    return currentQueue.add(function () {
      return databaseServer.all(databaseQuery.build(), []);
    });
  }
  
  /**
   * Delete all systems from the database.
   */
  deleteSystems () {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
       .from("System");

    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), []);
    })
  }
  
  /**
   * Read a system from the database.
   * @param {String} systemBy Property to query the system with.
   * @param {Object} systemObject Object to place the property against.
   * @returns {Promise.<Object>} Found system.
   */
  readSystem (systemBy, systemObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
        .all().from("System").where(`system${systemBy}`).equals();
    
    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [
          systemObject[`system${systemBy}`]
      ]);
    });
  }
  
  /**
   * Alter a system in the database.
   * @param {String} systemBy Property to query user with.
   * @param {Object} systemObject Object to query against.
   */
  alterSystem (systemBy, systemObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SET")
       .update("System").set(["systemDistinctor", "systemNumber", "systemRoomDistinctor"])
       .values("System")
       .where(`system${systemBy}`).equals();

    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
         systemObject.systemDistinctor,
         systemObject.systemNumber,
         systemObject.systemRoomDistinctor
      ]);
    });
  }
  
  /**
   * Write a system to the database.
   * @param {Object} systemObject Object to referenece.
   */
  writeSystem (systemObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("INSERT")
       .into("System", ["systemDistinctor", "systemNumber", "systemRoomDistinctor"])
       .values("System");

    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
         systemObject.systemDistinctor,
         systemObject.systemNumber,
         systemObject.systemRoomDistinctor
      ]);
    });
  }
  
  /**
   * Delete a system from the database.
   * @param {String} systemBy Property to query user with.
   * @param {Object} systemObject Object to query against.
   */
  deleteSystem (systemBy, systemObject) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("DELETE")
       .from("System").where(`system${systemBy}`);

    return currentQueue.add(function () {
      return databaseServer.run(databaseQuery.build(), [
         systemObject[systemBy]
      ]);
    });
  }
  
  /**
   * Read all systems registered against a client in a room.
   * @param {String} integralsRoom Distinctor of the room.
   * @returns {Promise.<Array.<Object>>} Collection of systems.
   */
  readIntegrals (integralsRoom) {
    const databaseServer = this.databaseServer;
    const databaseJoin = 'INNER';
    const databaseQuery = new Sequence("SELECT")
       .only([
          ['User', 'userName AS pointUser'],
          ['User', 'userDate AS pointEstablished'],
          ['Client', 'clientHandshake AS pointHandshake'],
          ['Client', 'clientStatus AS pointStatus'],
          ['System', 'systemNumber AS pointNumber'],
          ['Room', 'roomName AS pointRoom']
       ])
       .from('User')

       .join(databaseJoin, 'Client')
       .on([
          ['User', 'userClientDistinctor'],
          ['Client', 'clientDistinctor']
       ], 'Client')

       .join(databaseJoin, 'System')
       .on([
          ['Client', 'clientSystemDistinctor'],
          ['System', 'systemDistinctor']
       ], 'System')

       .join(databaseJoin, 'Room')
       .on([
          ['System', 'systemRoomDistinctor'],
          ['Room', 'roomDistinctor']
       ], 'Room')

       .where('roomDistinctor').equals();

    return currentQueue.add(function () {
      return databaseServer.all(databaseQuery.build(), [integralsRoom]);
    });
  }
  
  /**
   * Read a system for availability in the database.
   * @param {Number|String} integralsNumber Number of the system.
   * @returns {Promise.<Object>} Available system.
   */
  readIntegral (integralsNumber) {
    const databaseServer = this.databaseServer;
    const databaseEmbed = new Sequence("SELECT")
       .only(["clientSystemDistinctor"])
       .from("Client")

       .join("INNER", "System")
       .on([["System", "systemDistinctor"], ["Client", "clientSystemDistinctor"]], "System");

    const databaseQuery = new Sequence("SELECT")
       .only(["systemNumber"]).from("System")
       .where("systemDistinctor").notin(databaseEmbed)
       .where("systemNumber").equals();

    return currentQueue.add(function () {
      return databaseServer.get(databaseQuery.build(), [integralsNumber])
    });
  }
  
  /**
   * Read all systems not registered against a client in a room.
   * @param {String} untegralRoom Distinctor of the room.
   * @returns {Promise.<Array.<Object>>} Collection of systems.
   */
  readUntegrals (untegralRoom) {
    const databaseServer = this.databaseServer;
    const databaseQuery = new Sequence("SELECT")
       .only([
          [null, "'?' AS pointName"],
          [null, "'?' AS pointEstablished"],
          [null, "'?' AS pointHandshake"],
          [null, "'unavailable' AS pointStatus"],
          ['System', 'systemNumber AS pointNumber'],
          ['Room', 'roomName AS pointRoom']
       ])
       .from('System')

       .join('INNER', 'Room')
       .on([
          ['System', 'systemRoomDistinctor'],
          ['Room', 'roomDistinctor']
       ], 'Room')

       .where('systemDistinctor')
       .notin(new Sequence('SELECT').only(['clientSystemDistinctor']).from('Client'))

       .where('roomDistinctor').equals();

    return currentQueue.add(function () {
      return databaseServer.all(databaseQuery.build(), [untegralRoom]);
    });
  }

}

module.exports = Database;