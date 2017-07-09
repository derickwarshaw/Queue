const currentDatabase = require('../queue').currentDatabase;

async function Avoid (avoidData, avoidSocket) {
  "use strict";

  await currentDatabase.deleteClient(avoidSocket.socketHandshake);
  const readClient = await currentDatabase.readClient("Handshake", {
    clientHandshake: avoidSocket.socketHandshake
  });

  if (readClient !== undefined) {
    throw Error("Failed to remove client.");
  }
}

module.exports = Avoid;