require('../queue.js');

module.exports = dependencyInjection => {

   const Socket = dependencyInjection[1];
   const Database = dependencyInjection[2]

   async function clientRequest(requestSocket, requestUser) {
      requestData = Socket.authenticate({
         client: requestData,
         socket: requestSocket
      });


      // Step 2a: Check there is no client with the user found.
      // Step 2b: Check there is no client with the Id passed.

      const foundUser = await Database.readUser(requestUser);

      // Step 1: Check there is no user with this Id.
      if (foundUser) {
         // Matching user found.

         const foundClient = await Database.readClient(foundUser.userClient);

         if (foundClient) {
            // Matching client found.

            // Update the user client locally.
            requestUser.userClient = foundClient;

            // Update the user in the db.
            const updatedUser = await Database.alterUser(requestUser);

            requestSocket.emit('client.established', updatedUser);

         } else {
            // No matching client found.

            // Create a matching client, update the user.
            const createdClient = await Database.writeClient(requestUser.userClient);
            const updatedUser = await Database.alterUser(requestUser);

            requestSocket.emit('client.established', updatedUser);

         }

      } else {
         // No matching user found.

         const foundClient = await Database.readClient(requestUser.userClient);

         if (foundClient) {
            // Matching client found with request.

            // Update local client.
            requestUser.userClient = foundClient;

            // Create User in Database
            const createdUser = await Database.writeUser(requestUser);

            requestSocket.emit('client.established', createdUser);

         } else {
            // No matching client found with request.

         }
      }
   }

   return clientRequest;
}
