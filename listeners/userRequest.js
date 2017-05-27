require('../queue.js');

module.exports = dependencyInjection => {
   const Database = dependencyInjection[0];
   const Translation = dependencyInjection[1];

   async function clientRequest(requestUser) {
      const readUser = await Database.readUser(requestUser, "Name");

      if (readUser) {
         return Translation.user(readUser);
      } else {
         await Database.writeUser(Database.signUser(requestUser));
      }

      // Read the new entry, make sure it can be resolved.
      return Translation.user(await Database.readUser(requestUser, "Id"));
   }

   return clientRequest;
}
