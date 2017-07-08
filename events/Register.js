const currentDatabase = require('../queue').currentDatabase;


/**
 * Register a user with a client.
 * @param {Object} registerUser User to register a client against.
 * @param {Object} registerSocket Socket for the request.
 * @returns {*} ?
 */
async function Register (registerUser, registerSocket) {

   // Step 1: Determine if the registering user exists in the database.
  // This user will have to have authenticated as a user, therefore the User object
  // should have a distinctor.
  const readUser = await currentDatabase.readUser("Distinctor", registerUser);

  // Step 2: Determine if the room they want to register as in exists.
  const readRoom = await currentDatabase.readRoom("Name", registerUser.userClient.clientRoom);

  // Step 3: Have we found a room?
  // Doing this before any of the major database processing happens.
  if (readRoom) {

    // Step 4: Update the local roomDistinctor & socketHandshake.
    // Doing this before we update the database record.
    registerUser.userClient.clientRoom.roomDistinctor = readRoom.roomDistinctor;
    registerUser.userClient.clientHandshake = registerSocket.socketHandshake;

    // Step 5: Determine the client exists.
    if (readUser && readUser.userClientDistinctor) {
      // If the user database record has a client distinctor against it,
      // We should look for that client database record.

      // Step 5A.1: Resolve the client with the user's distinctor.
      const resolvedClient = await currentDatabase.resolveClient(readUser.userClientDistinctor);

      // Step 5A.2: Determine if there is a client.
      if (resolvedClient && resolvedClient.clientDistinctor) {
        // If the found client record exists and has a distinctor against it,
        // We should organise updating it's info.

        // Step 5A.2A.1: Map the properties to keep over.
        registerUser.userClient.clientDistinctor = resolvedClient.clientDistinctor;
        registerUser.userClient.clientStatus = resolvedClient.clientStatus;

        // Step 5A.2A.2: Alter this client with the current properties.
        await currentDatabase.alterClient(registerUser.userClient);

        // Step 5A.2A.3: Read the altered client.
        const alteredClient = await currentDatabase.readClient("Distinctor", registerUser.userClient);

        // Step 5A.2A.4: Assign the altered client.
        registerUser.userClient = alteredClient;

        // Step 5A.2.5: Alter the user.
        await currentDatabase.alterUser(registerUser);

        // Step 5A.2A.5: Return the user/client.
        return {
          registeredUser: await currentDatabase.readUser("Distinctor", registerUser),
          registeredClient: await currentDatabase.readClient("Distinctor", registerUser.userClient)
        };

      } else if (!resolvedClient) {
        // If there is no client record, we should create a new one.

        // Step 5B.1: Sign the information locally.
        const signedClient = currentDatabase.signClient(registerUser.userClient);

        // Step 5B.2: Write the client to the database.
        await currentDatabase.writeClient(signedClient);

        // Step 5B.3: Read the new client from the database.
        const readClient = await currentDatabase.readClient("Distinctor", signedClient);

        // Step 5B.4: Update the local client.
        registerUser.userClient = readClient;

        // Step 5B.5: Alter the user with the new signed client.
        await currentDatabase.alterUser(registerUser);

        // Step 5B.6: Verify the user and client can be read.
        return {
          registeredUser: await currentDatabase.readUser("Distinctor", registerUser),
          registeredClient: await currentDatabase.readClient("Distinctor", registerUser.userClient)
        };

      }

    } else if (readUser && !readUser.userClientDistinctor) {
      // If the user in the database has no client distinctor against it,
      // We should go about creating a brand new client.

      // Step 5B.1: Sign the information locally.
      const signedClient = currentDatabase.signClient(registerUser.userClient);

      // Step 5B.2: Write the client to the database.
      await currentDatabase.writeClient(signedClient);

      // Step 5B.3: Read the new client from the database.
      const readClient = await currentDatabase.readClient("Distinctor", signedClient);

      // Step 5B.4: Update the local client.
      registerUser.userClient = readClient;

      // Step 5B.5: Alter the user with the new signed client.
      await currentDatabase.alterUser(registerUser);

      // Step 5B.6: Verify the user and client can be read.
      return {
        registeredUser: await currentDatabase.readUser("Distinctor", registerUser),
        registeredClient: await currentDatabase.readClient("Distinctor", registerUser.userClient)
      };

    } else if (!readUser) {
      // If teh user doesn't exist.

      // Step 5C: Kill the request.
      throw Error(`User '${registerUser.userName}' does not exist.`);
    }
  } else {

    throw Error(`Room '${registerUser.userClient.clientRoom.roomName}' is not a room.`);
  }
}


module.exports = Register;