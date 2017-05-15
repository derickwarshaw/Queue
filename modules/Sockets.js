module.exports = dependencyInjection => {

   const Setup = dependencyInjection[0];

   function Sockets (socketsAccess) {
      this.socketsAccess = socketsAccess;

      this.socketsStatistics = {
         statisticsRequests: 0,
         statisticsHandled: 0,
         statisticsClients: 0
      };
   }

   Sockets.prototype.connected = function (connectedRunner) {
      this.socketsAccess.on('connection', connectedRunner);
   }
   Sockets.prototype.listen = function (listenName) {
      return require(`${Setup.getDirectory()}\\listeners\\${listenName}.js`);
   }
   Sockets.prototype.authenticate = function (authenticateParameters) {
      const authenticateClient = authenticateParameters.client;
      const authenticateSocket = authenticateParameters.socket;

      // Assign ID as handshake.
      authenticateClient = authenticateSocket.handshake.issued;

      return authenticateClient;
   }

   return Sockets;

}
