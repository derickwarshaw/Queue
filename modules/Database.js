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

   Database.prototype.readClient = async function (clientId) {
      this.databaseStatistics.statisticsRequests += 1;

      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("SELECT *").from("Users")
                                                    .where("UserId")
                                                    .equals(clientId);

      return await Queue.add(() => {
         return databaseServer.get(databaseQuery);
      });
   }

   Database.prototype.writeClient = async function (clientObject) {
      this.databaseStatistics.statisticsRequests += 1;

      const databaseServer = this.databaseServer;
      const databaseColumns = ["ClientId", "ClientName", "ClientStatus"];
      const databaseQuery = new Sequence("INSERT").into("Client", databaseColumns])
                                                  .values(clientObject, databaseColumns);

      return await Queue.add(() => {
         return databaseServer.run(databaseQuery);
      });
   }

   Database.prototype.alterClient = async function (clientObject) {
      this.databaseStatistics.statisticsRequests += 1;
      
      const databaseServer = this.databaseServer;
      const databaseQuery = new Sequence("UPDATE Client").set("ClientId").equals(clientObject.ClientId)
                                                         .set("ClientName").equals(clientObject.ClientName)
                                                         .set("ClientStatus").equals(clientObject.ClientStatus);

      return await Queue.add(() => {
         return databaseServer.run(databaseQuery);
      });
   }

   return Database;



}
