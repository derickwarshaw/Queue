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

  authenticate (requestHandler) {
    this.socketObejct.on('user:auth', requestData => requestHandler('Authenticate', requestData));
  }
  authenticated (establishedUser) {
    this.socketObejct.emit('user:est', establishedUser);
  }
  unauthorised (unauthorisedReason) {
    this.socketObejct.emit('user:unauth', unauthorisedReason);
  }


  request (requestHandler) {
    this.socketObejct.on('client:auth', requestData => requestHandler('Request', requestData));
  }
  requested (requestedUser) {
    this.socketObejct.emit('client:est', requestedUser);
  }
  rejected (rejectedReason) {
    this.socketObejct.emit('client:reject', rejectedReason);
  }
}

module.exports = SocketRequest;