module.exports = dependencyInjection => {

   const sql = dependencyInjection[0];
   const Sequence = dependencyInjection[1];

   function Database (databaseServer) {
      this.databaseServer = databaseServer;

      this.databaseStatistics = {
         statisticsRequests: 0,
         statisticsHandled: 0
      };
   }
   // Database.prototype.readClientById = function (clientId) {
   //    return new Promise((resolveClient, rejectClient) => {
   //       const transactionSequence = new Sequence().all()
   //                                                 .from("")
   //                                                 .where()
   //                                                 .equals()
   //    })
   // }

   return Database;



}
