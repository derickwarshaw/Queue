module.exports = dependencyInjection => {

   const Sequence = dependencyInjection[0];
   const Queue = dependencyInjection[1];

   function Database (databaseServer) {
      this.databaseServer = databaseServer;

      this.databaseStatistics = {
         statisticsRequests: 0,
         statisticsHandled: 0
      };
   }

   Database.prototype.readUser = async function (userObject) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT *").from("Users")
                                                    .where("UserId")
                                                    .equals(userObject.userId);

      return await Queue.add(() => {
         return databaseServer.get(databaseQuery);
      });
   }
   Database.prototype.writeUser = async function (userObject) {
     const databaseServer = this.databaseServer;
     const databaseColumns = ["UserId", "UserName", "UserLocation", "UserDate", "ClientId"];
     const databaseQuery = new Sequence("INSERT").into("User", databaseColumns)
                                                 .values(userObject, databaseColumns);

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery);
      })
   }
   Database.prototype.alterUser = async function (userObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("UPDATE User").set("UserId")
                                                      .equals(userObject.UserId)
                                                      .set("UserName")
                                                      .equals(userObject.UserName)
                                                      .set("UserLocation")
                                                      .equals(userObject.UserLocation)
                                                      .set("UserDate")
                                                      .equals(userObject.UserDate)
                                                      .set("ClientId")
                                                      .equals(userObject.userClient.ClientId);

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery);
      })
   }

   Database.prototype.readClient = async function (clientObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("SELECT *").from("Client")
                                                   .where("ClientId")
                                                   .equals(userObject.userId);

     return await Queue.add(() => {
        return databaseServer.get(databaseQuery);
     });
   }
   Database.prototype.writeClient = async function (clientObject) {
      this.databaseStatistics.statisticsRequests += 1;

      const databaseServer = this.databaseServer;
      const databaseColumns = ["ClientId", "ClientName", "ClientStatus"];
      const databaseQuery = new Sequence("INSERT").into("Client", databaseColumns)
                                                  .values(clientObject, databaseColumns);

      return await Queue.add(() => {
         return databaseServer.run(databaseQuery);
      });
   }
   Database.prototype.alterClient = async function (clientObject) {
      this.databaseStatistics.statisticsRequests += 1;

      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("UPDATE Client").set("ClientId")
                                                         .equals(clientObject.ClientId)
                                                         .set("ClientName")
                                                         .equals(clientObject.ClientName)
                                                         .set("ClientStatus")
                                                         .equals(clientObject.ClientStatus);

      return await Queue.add(() => {
         return databaseServer.run(databaseQuery);
      });
   }

   Database.prototype.readAdmin = async function (adminObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("SELECT *").from("Admin")
                                                   .where("AdminId")
                                                   .equals(adminObject.adminId);

     return await Queue.add(() => {
        return databaseServer.get(databaseQuery);
     });
   }
   Database.prototype.writeAdmin = async function (adminObject) {
     const databaseServer = this.databaseServer;
     const databaseColumns = ["AdminId", "AdminName", "AdminLocation", "AdminDate", "DashboardId"];
     const databaseQuery = new Sequence("INSERT").into("User", databaseColumns)
                                                 .values(userObject, databaseColumns);

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery);
      })
   }

   return Database;



}
