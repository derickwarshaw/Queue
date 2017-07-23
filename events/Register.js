const currentDatabase = require('../queue').currentDatabase;


/**
 * Register a user with a client.
 * @param {Object} registerUser User to register a client against.
 * @param {Object} registerSocket Socket for the request.
 * @returns {*} ?
 */
async function Register (registerUser, registerSocket) {
  const [readUser, readRoom, readSystem, readContained] = await Promise.all([
      currentDatabase.readUser("Distinctor", registerUser),
      currentDatabase.readRoom("Name", registerUser.userClient.clientSystem.systemRoom),
      currentDatabase.readSystem("Number", registerUser.userClient.clientSystem),
      currentDatabase.readIntegral(registerUser.userClient.clientSystem.systemNumber)
  ]);

  if (readContained) {

    if (readRoom) {

      registerUser.userClient.clientSystem.systemRoom.roomDistinctor = readRoom.roomDistinctor;
      registerUser.userClient.clientHandshake = `${registerSocket.socketHandshake}`;

      // TODO: Implement system checking if a client has already claimed it.
      if  (readSystem) {

        registerUser.userClient.clientSystem.systemDistinctor = readSystem.systemDistinctor;

        if (readUser && readUser.userClientDistinctor) {

          const resolvedClient = await currentDatabase.readClient("Distinctor", {
            clientDistinctor: readUser.userClientDistinctor
          });

          if (resolvedClient && resolvedClient.clientDistinctor) {

            registerUser.userClient.clientDistinctor = resolvedClient.clientDistinctor;
            registerUser.userClient.clientSource = resolvedClient.clientStatus;

            await currentDatabase.alterClient(registerUser.userClient);
            registerUser.userClient = await currentDatabase.readClient("Distinctor", registerUser.userClient);
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

        } else if (!readUser) {

          throw Error(`User '${registerUser.userName}' does not exist.`);

        }

      } else {

        throw Error(`System number '${registerUser.userClient.clientSystem.systemNumber}' does not relate to a system.`);

      }

    } else {

      throw Error(`Room '${registerUser.userClient.clientSystem.systemRoom.roomName}' is not a room.`);

    }

  } else {

    throw Error(`Number '${registerUser.userClient.clientSystem.systemNumber}' is not available.`);

  }
}

module.exports = Register;