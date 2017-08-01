const currentDatabase = require('../queue').currentDatabase;


/**
 * Register a user with a client.
 * @param {Object} registerUser User to register a client against.
 * @param {Object} registerSocket Socket for the request.
 * @returns {*} ?
 */
async function Register (registerUser, registerSocket) {
  const systemNumber = registerUser.userClient.clientSystem.systemNumber;
  const systemRoom = registerUser.userClient.clientSystem.systemRoom;
  
  const [readUser, readRoom, readSystem] = await Promise.all([
      currentDatabase.readUser("Distinctor", registerUser),
      currentDatabase.readRoom("Name", systemRoom),
      currentDatabase.readIntegralSystem(systemNumber, systemRoom.roomName)
  ]);

  if (readRoom && readSystem) {
    
    registerUser.userClient.clientSystem.systemRoom.roomDistinctor = readRoom.roomDistinctor;
    registerUser.userClient.clientHandshake = `${registerSocket.socketHandshake}`;
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

      } else if (!resolvedClient || resolvedClient === undefined) {

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

    throw Error(`Number '${systemNumber}' in  ${systemRoom}' is not available.`);

  }
}

module.exports = Register;