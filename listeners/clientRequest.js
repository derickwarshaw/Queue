require('../queue.js');

module.exports = dependencyInjection => {

   const Socket = dependencyInjection[1];
   const Database = dependencyInjection[2]

   async function clientRequest(requestSocket, requestClient) {
      requestData = Socket.authenticate({
         client: requestData,
         socket: requestSocket
      });

      if (await Database.readClientByUser(requestClient.clientUser)) {
         requestSocket.emit('client.established', await Database.writeStation(requestClient));
      } else {
         requestSocket.emit('client.established', await Database.alterStation(requestClient));
      }
   }

   return clientRequest;
}
