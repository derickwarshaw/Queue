const currentDatabase = require('../queue').currentDatabase;

async function Update (updateUser) {
  "use strict";

  const readUser = await currentDatabase.readUser("Distinctor", updateUser);

  if (readUser) {
    const readClient = await currentDatabase.resolveClient(readUser.userClientDistinctor);

    if (readClient) {

      await currentDatabase.alterClient(updateUser.userClient);
      return await currentDatabase.resolveClient(readUser.userClientDistinctor);

    } else {
      throw Error("Client does not exist.");
    }

  } else if (!readUser) {
    throw Error("User does not exist.");
  }
}

module.exports = Update;