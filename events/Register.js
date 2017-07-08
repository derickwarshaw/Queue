const currentDatabase = require('../queue').currentDatabase;


/**
 * Register a user with a client.
 * @param {Object} registerUser User to register a client against.
 * @param {Object} registerSocket Socket for the request.
 * @returns {*} ?
 */
async function Register (registerUser, registerSocket) {

    // Step 1: Validate the user exists.
    const readUser = await currentDatabase.readUser("Distinctor", registerUser);
    const readRoom = await currentDatabase.readRoom("Name", registerUser.userClient.clientRoom);

    // Step 2: Validate the room.
    if (readRoom) {

        registerUser.userClient.clientRoom.roomDistinctor = readRoom.roomDistinctor;
        registerUser.userClient.clientHandshake = registerSocket.socketHandshake;

        // Step 3: Validate the client exists.
        if (readUser && readUser.userClientDistinctor) {
            // Step 3A: Update the existing client.
            const resolvedClient = await currentDatabase.resolveClient(readUser.userClientDistinctor);
            registerUser.userClient.clientDistinctor = resolvedClient.clientDistinctor;

            await currentDatabase.alterClient(registerUser.userClient);

            await currentDatabase.alterUser(registerUser);
            return currentDatabase.readUser("Distinctor", registerUser);

        } else if (readUser && !readUser.userClientDistinctor) {
            // Step 3B: Create a new client.
            registerUser.userClient = currentDatabase.signClient(registerUser.userClient);

            await currentDatabase.writeClient(registerUser.userClient);
            return await currentDatabase.readClient("Distinctor", registerUser.userClient);

        } else if (!readUser) {
            // Step 3C: Report bad user.
            throw Error(`User '${registerUser.userName}' does not exist.`);
        }
    }
}


module.exports = Register;