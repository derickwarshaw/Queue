const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

/**
 * Authenticate a user.
 * @param {Object} authenticateUser Unsigned user object.
 * @returns {Object} Signed user object.
 */
async function Authenticate (authenticateUser) {
    if (authenticateUser && authenticateUser.userDistinctor) {
        return await currentDatabase.readUser("Distinctor", authenticateUser);
    } else if (authenticateUser && !authenticateUser.userDistinctor) {
        const readUser = await currentDatabase.readUser("Name", authenticateUser);

        if (readUser) {
            return readUser;
        } else {
            const signedUser = currentDatabase.signUser(authenticateUser);

            await currentDatabase.writeUser(signedUser);
            return await currentDatabase.readUser("Distinctor", signedUser);
        }
    }
}

module.exports = Authenticate;