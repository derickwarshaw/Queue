const currentDatabase = require('../queue').currentDatabase;


/**
 * Register a user with a client.
 * @param {Object} registerUser User to register a client against.
 * @param {Object} registerSocket Socket for the request.
 * @returns {*} ?
 */
async function Register (registerUser, registerSocket) {

    // Validate the user exists.
    if (!(await currentDatabase.readUser("Distinctor", registerUser))) {
        throw Error("User does not exist.");
    }

    try {
        // If user does not have a client distinctor, this should throw an error.
        return await currentDatabase.readClient("Distinctor", registerUser.userClient);

    } catch (registerError) {
        // There's no client registered.
        let readRoom;

        // Step 1: Validate the room/get the distinctor.
        try {
            readRoom = currentDatabase.readRoom("Name", registerUser.userRoom);
        } catch (roomError) {
            throw Error("User has not been given a room.")
        }

        if (readRoom) {
            registerUser.userRoom.roomDistinctor = readRoom.roomDistinctor;
        } else {
            throw Error(`${registerUser.userRoom.roomName} is not a registered room.`);
        }

        // Step 2: Get the handshake.
        registerUser.userClient.clientHandshake = registerSocket.handshake.id;

        // Step 3: Write the client.
        await currentDatabase.writeClient(registerUser.userClient);

        // Step 4: Read the client.
        return await currentDatabase.readClient("Distinctor", registerUser.userClient.clientDistinctor);
    }
}