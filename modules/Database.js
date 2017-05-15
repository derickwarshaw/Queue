module.exports = dependencyInjection => {

   const Sequence = dependencyInjection[0];
   const Queue = new dependencyInjection[1];

   function Database (databaseServer) {
      this.databaseServer = databaseServer;

      this.userSigns = [];
      this.databaseStatistics = {
         statisticsRequests: 0,
         statisticsHandled: 0
      };
   }
   Database.prototype.signUser = function (userObject) {
     const currentInstance = this;

     return new Promise((resolveUser, rejectUser) => {
       var newNumber = 2831;

       while (currentInstance.userSigns.includes(newNumber)) {
         newNumber = Math.round(Math.random() * (9999 - 1000) + 1000);
       }

       userObject.userId = newNumber;

       resolveUser(userObject);
     });
   }

   Database.prototype.readUser = async function (userObject) {
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT *").from("User")
                                                    .where("UserId")
                                                    .equals(userObject.userId);

      return await Queue.add(() => {
         return databaseServer.get(databaseQuery.getSequence());
      });
   }
   Database.prototype.writeUser = async function (userObject) {
     const databaseServer = this.databaseServer;
     const databaseColumns = ["UserId", "UserName", "UserNumber", "UserLocation", "UserDate"];
     const databaseQuery = new Sequence("INSERT").into("User", databaseColumns)
                                                 .values(userObject, databaseColumns);

      return await Queue.add(() => {
        console.log(databaseQuery.getSequence());
        return databaseServer.run(databaseQuery.getSequence());
      })
   }
   Database.prototype.alterUser = async function (userObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("UPDATE User").set("UserName")
                                                      .equals(userObject.userName)
                                                      .set("UserNumber")
                                                      .equals(userObject.userNumber)
                                                      .set("UserLocation")
                                                      .equals(userObject.userLocation)
                                                      .set("ClientId")
                                                      .equals(userObject.userClient.ClientId);

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery.getSequence());
      })
   }

   Database.prototype.readClient = async function (clientObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("SELECT *").from("Client")
                                                   .where("ClientId")
                                                   .equals(clientObject.clientId);

     return await Queue.add(() => {
        return databaseServer.get(databaseQuery.getSequence());
     });
   }
   Database.prototype.writeClient = async function (clientObject) {
      this.databaseStatistics.statisticsRequests += 1;

      const databaseServer = this.databaseServer;
      const databaseColumns = ["ClientId", "ClientName", "ClientStatus"];
      const databaseQuery = new Sequence("INSERT").into("Client", databaseColumns)
                                                  .values(clientObject, databaseColumns);

      return await Queue.add(() => {
         return databaseServer.run(databaseQuery.getSequence());
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
         return databaseServer.run(databaseQuery.getSequence());
      });
   }

   Database.prototype.readAdmin = async function (adminObject) {
     const databaseServer = this.databaseServer;
     const databaseQuery = new Sequence("SELECT *").from("Admin")
                                                   .where("AdminId")
                                                   .equals(adminObject.adminId);

     return await Queue.add(() => {
        return databaseServer.get(databaseQuery.getSequence());
     });
   }
   Database.prototype.writeAdmin = async function (adminObject) {
     const databaseServer = this.databaseServer;
     const databaseColumns = ["AdminId", "AdminName", "AdminLocation", "AdminDate", "DashboardId"];
     const databaseQuery = new Sequence("INSERT").into("User", databaseColumns)
                                                 .values(userObject, databaseColumns);

      return await Queue.add(() => {
        return databaseServer.run(databaseQuery.getSequence());
      })
   }

   return Database;



}
