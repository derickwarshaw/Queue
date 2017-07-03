/**
 * Created by Joshua Crowe on 01/07/2017.
 */

// TODO: Add JSDOC descriptions @.
class SocketRequest {
  constructor (requestSocket) {
    this.socketObejct = requestSocket;
    this.socketRequestId = requestSocket.client.id;
    this.socketRequestPath = requestSocket.client.request.url;
    this.socketRequestMethod = requestSocket.client.request.method;
  }

  summary () {
    return `${this.socketRequestMethod} -> ${this.socketRequestPath} (${this.socketRequestId})`;
  }

  userRequest (requestHandler) {
    this.socketObejct.on('user:auth', requestData => requestHandler('userRequest', requestData));
  }
  userEstablished (establishedUser) {
    this.socketObejct.emit('user:est', establishedUser);
  }
}

module.exports = SocketRequest;