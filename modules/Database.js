module.exports = dependencyInjection => {

   const Sequence = dependencyInjection[0];
   const Queue = new dependencyInjection[1];
   const Guid = dependencyInjection[2];
   const Utility = dependencyInjection[3];

   function Database (databaseServer) {
      this.databaseServer = databaseServer;

      this.userSigns = new Map();
      this.databaseStatistics = {
         statisticsRequests: 0,
         statisticsHandled: 0
      };
   }
   Database.prototype.signUser = function (userObject) {
    userObject.userId = (Guid.create()).value;
    userObject.userName = Utility.to.ProperCase(Utility.from.UserName(userObject.userName));
     this.userSigns.set(userObject.userId, userObject);
     
     return userObject;
   }

   Database.prototype.readUser = async function (userObject, userBy) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT").all()
                                                  .from("User")
                                                  .where(`User${userBy}`)
                                                  .equals();

      return await Queue.add(() => {
         return databaseServer.get(databaseQuery.buildSequence(), [
           userObject[`user${userBy}`]
         ]);
      });
   }
   Database.prototype.writeUser = async function (userObject) {
     const databaseServer = this.databaseServer;
     const databaseColumns = ["UserId", "UserName", "UserNumber", "UserLocation", "UserDate"];
     const databaseQuery = new Sequence("INSERT").into("User", databaseColumns)
                                                 .values("User");

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery.buildSequence(), [
          userObject.userId,
          userObject.userName,
          userObject.userNumber,
          userObject.userLocation,
          userObject.userDate
        ]);
      })
   }
   Database.prototype.alterUser = async function (userObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("UPDATE").update("User")
                                                 .set("UserName").equals()
                                                 .set("UserNumber").equals()
                                                 .set("UserLocation").equals()
                                                 .set("ClientId").equals();

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery.buildSequence(), [
          userObject.userName,
          userObject.userNumber,
          userObject.userLocation,
          userObject.clientId
        ]);
      })
   }

  //  Database.prototype.readClient = async function (clientObject) {
  //    const databaseServer = this.databaseServer;
  //    const databaseQuery = new Sequence("SELECT *").from("Client")
  //                                                  .where("ClientId")
  //                                                  .equals(clientObject.clientId);
   //
  //    return await Queue.add(() => {
  //       return databaseServer.get(databaseQuery.getSequence());
  //    });
  //  }
  //  Database.prototype.writeClient = async function (clientObject) {
  //     this.databaseStatistics.statisticsRequests += 1;
   //
  //     const databaseServer = this.databaseServer;
  //     const databaseColumns = ["ClientId", "ClientName", "ClientStatus"];
  //     const databaseQuery = new Sequence("INSERT").into("Client", databaseColumns)
  //                                                 .values(clientObject, databaseColumns);
   //
  //     return await Queue.add(() => {
  //        return databaseServer.run(databaseQuery.getSequence());
  //     });
  //  }
  //  Database.prototype.alterClient = async function (clientObject) {
  //     this.databaseStatistics.statisticsRequests += 1;
   //
  //     const databaseServer = this.databaseServer;
  //     const databaseQuery = new Sequence("UPDATE Client").set("ClientId")
  //                                                        .equals(clientObject.ClientId)
  //                                                        .set("ClientName")
  //                                                        .equals(clientObject.ClientName)
  //                                                        .set("ClientStatus")
  //                                                        .equals(clientObject.ClientStatus);
   //
  //     return await Queue.add(() => {
  //        return databaseServer.run(databaseQuery.getSequence());
  //     });
  //  }
   //
  //  Database.prototype.readAdmin = async function (adminObject) {
  //    const databaseServer = this.databaseServer;
  //    const databaseQuery = new Sequence("SELECT *").from("Admin")
  //                                                  .where("AdminId")
  //                                                  .equals(adminObject.adminId);
   //
  //    return await Queue.add(() => {
  //       return databaseServer.get(databaseQuery.getSequence());
  //    });
  //  }
  //  Database.prototype.writeAdmin = async function (adminObject) {
  //    const databaseServer = this.databaseServer;
  //    const databaseColumns = ["AdminId", "AdminName", "AdminLocation", "AdminDate", "DashboardId"];
  //    const databaseQuery = new Sequence("INSERT").into("User", databaseColumns)
  //                                                .values(userObject, databaseColumns);
   //
  //     return await Queue.add(() => {
  //       return databaseServer.run(databaseQuery.getSequence());
  //     })
  //  }

   return Database;



}
