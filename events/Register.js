const currentDatabase = require('../queue').currentDatabase;


/**
 * Register a user with a client.
 * @param {Object} registerUser User to register a client against.
 * @param {Object} registerSocket Socket for the request.
 * @returns {*} ?
 */
async function Register (registerUser, registerSocket) {
  const readUser = await currentDatabase.readUser("Distinctor", registerUser);
  const readRoom = await currentDatabase.readRoom("Name", registerUser.userClient.clientRoom);

  if (readRoom) {
    registerUser.userClient.clientRoom.roomDistinctor = readRoom.roomDistinctor;
    registerUser.userClient.clientHandshake = registerSocket.socketHandshake;

    if (readUser && readUser.userClientDistinctor) {
      const resolvedClient = await currentDatabase.readClient("Distinctor", {
        clientDistinctor: readUser.userClientDistinctor
      });

      if (resolvedClient && resolvedClient.clientDistinctor) {
        registerUser.userClient.clientDistinctor = resolvedClient.clientDistinctor;
        registerUser.userClient.clientStatus = resolvedClient.clientStatus;

        await currentDatabase.alterClient(registerUser.userClient);
        registerUser.userClient = await currentDatabase.readClient("Distinctor", registerUser.userClient);;
        await currentDatabase.alterUser(registerUser);

        return {
          registeredUser: await currentDatabase.readUser("Distinctor", registerUser),
          registeredClient: await currentDatabase.readClient("Distinctor", registerUser.userClient)
        };

      } else if (!resolvedClient) {
        const signedClient = currentDatabase.signClient(registerUser.userClient);
        await currentDatabase.writeClient(signedClient);

        registerUser.userClient = await currentDatabase.readClient("Distinctor", signedClient);
        await currentDatabase.alterUser(registerUser);

        return {
          registeredUser: await currentDatabase.readUser("Distinctor", registerUser),
          registeredClient: await currentDatabase.readClient("Distinctor", registerUser.userClient)
        };

      }

    } else if (readUser && !readUser.userClientDistinctor) {
      const signedClient = currentDatabase.signClient(registerUser.userClient);
      await currentDatabase.writeClient(signedClient);

      registerUser.userClient = await currentDatabase.readClient("Distinctor", signedClient);
      await currentDatabase.alterUser(registerUser);

      return {
        registeredUser: await currentDatabase.readUser("Distinctor", registerUser),
        registeredClient: await currentDatabase.readClient("Distinctor", registerUser.userClient)
      };

    } else if (!readUser) {
      throw Error(`User '${registerUser.userName}' does not exist.`);
    }

  } else {
    throw Error(`Room '${registerUser.userClient.clientRoom.roomName}' is not a room.`);
  }
}

module.exports = Register;