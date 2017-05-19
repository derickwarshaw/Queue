module.exports = dependencyInjection => {

   const Setup = dependencyInjection[0];

   function Sockets (socketsAccess) {
      this.socketsAccess = socketsAccess;
      this.socketsRegister = new Map();
      this.socketErrors = new Map();

      this.socketsStatistics = {
         statisticsRequests: 0,
         statisticsHandled: 0,
         statisticsClients: 0
      };
   }

   Sockets.prototype.connected = function (connectedRunner) {
      const socketsInstance = this;

      socketsInstance.socketsAccess.on('connection', function (accessedSockets) {
         connectedRunner(socketsInstance.registerHandle(accessedSockets), socketsInstance);
      });
   };
   Sockets.prototype.listen = function (listenName) {
      return require(`${Setup.getDirectory()}\\listeners\\${listenName}.js`);
   };
   Sockets.prototype.authenticate = function (authenticateParameters) {
      const authenticateClient = authenticateParameters.client;
      const authenticateSocket = authenticateParameters.socket;

      // Assign ID as handshake.
      authenticateClient = authenticateSocket.handshake.issued;

      return authenticateClient;
   };
   Sockets.prototype.error = function (errorTime, errorLocation, errorObject) {
        this.socketErrors.set(errorTime.toString(), {
            errorObject: errorObject,
            errorLocation: errorLocation
        });
   };
   Sockets.prototype.errors = function () {
       for ([errorTime, errorObject] of this.socketErrors) {
           console.log(`Error at ${errorTime}`);
           console.log(errorObject);
       }
   }
   Sockets.prototype.disconnected = function (disconnectedSocket) {
       const socketInstance = this;

       disconnectedSocket.on('disconnected', (disconnectData) =>  {
           socketInstance.unregisterHandle(disconnectData);
       });
   };


   Sockets.prototype.registerHandle = function (handleObject) {
       this.socketsRegister.set(handleObject.handshake.issued, handleObject);
       return this.socketsRegister.get(handleObject.handshake.issued);
   };
   Sockets.prototype.unregisterHandle = function (handleObject) {
        this.socketsRegister.set(handleObject.handshake.issued, null);
   };


   return Sockets;

};
