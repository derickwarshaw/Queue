require('../queue.js');

module.exports = dependencyInjection => {
   const Database = dependencyInjection[0];

   async function clientRequest(requestSocket, requestUser) {
      const foundUser = await Database.readUser(requestUser);

      if (foundUser) {
        await Database.alterUser(foundUser);
      } else {
        requestUser = await Database.signUser(requestUser);

        await Database.writeUser(requestUser);
      }

      return await Database.readUser(requestUser);
   }

   return clientRequest;
}
