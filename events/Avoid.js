const currentDatabase = require('../queue').currentDatabase;

/**
 * Dispose of unused clients.
 * @param {Object} avoidData Data sent by the client.
 * @param {Object} avoidSocket Socket object.
 * @returns {Promise.<void>}
 */
async function Avoid (avoidData, avoidSocket) {
  const readClient = await currentDatabase.readClient("Handshake", {
    clientHandshake: String(avoidSocket.socketHandshake)
  });

  if (readClient || readClient !== undefined) {
    await currentDatabase.deleteClient("Handshake", {
      clientHandshake: String(avoidSocket.socketHandshake)
    });

    return readClient;
  }
}

module.exports = Avoid;