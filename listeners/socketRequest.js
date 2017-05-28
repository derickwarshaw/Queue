/**
 * Created by Josh Crowe on 28/05/2017.
 */

require('../queue.js');

module.exports = dependencyInjection => {
    const Database = dependencyInjection[0];

    async function socketRequest(requestUser, requestSocket) {
        if (requestUser.hasOwnProperty(userId) && requestUser.userId) {
            requestUser.socketId = requestSocket.handshake.issued;

            await Database.writeClient(requestUser.socketId);
        }
    }

    return socketRequest;
}
