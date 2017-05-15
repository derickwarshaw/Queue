require('../queue.js');

module.exports = dependencyInjection => {
   const Database = dependencyInjection[0];

   async function clientRequest(requestSocket, requestUser) {

      // Locate a user with this userId
      if (await Database.readUser(requestUser)) {

        // If there is one, update the coluns.
        await Database.alterUser(requestUser);

      } else {

        // Sign the object with an Id.
        requestUser = Database.signUser(requestUser);

        // Write the user to the database.
        await Database.writeUser(requestUser);

      }

      // Read the new entry, make sure it can be resolved.
      return await Database.readUser(requestUser);
   }

   return clientRequest;
}
