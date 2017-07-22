class SocketRequest {

  /**
   * Manage a socket.
   * @param {Object} requestSocket Socket generated by Socket.io
   * @returns {Object} SocketRequest instance.
   */
  constructor (requestSocket) {
    this.socketObject = requestSocket;
    this.socketRequestId = requestSocket.client.id;
    this.socketRequestPath = requestSocket.client.request.url;
    this.socketRequestMethod = requestSocket.client.request.method;
    this.socketHandshake = requestSocket.handshake.issued;
  }

  /**
   * Generate a summary about the request.
   * @returns {String} Summary about the request.
   */
  summary () {
    return `${this.socketRequestMethod} -> ${this.socketRequestPath} (${this.socketRequestId})`;
  }

  /**
   * Authenticate a user.
   * @param {Function} requestHandler Custom handler function.
   */
  authenticate (requestHandler) {
    this.socketObject.on('user:send', requestData => requestHandler('Authenticate', requestData));
  }

  /**
   * Report authentication to a user.
   * @param {Object} establishedUser Signed user object.
   */
  authenticated (establishedUser) {
    this.socketObject.emit('user:suc', establishedUser);
  }

  /**
   * Report failed authentication.
   * @param {Error} unauthenticatedReason Reason for failure.
   */
  unauthenticated (unauthenticatedReason) {
    this.socketObject.emit('user:fai', unauthenticatedReason);
  }

  /**
   * Register event listener.
   * @param {Function} registerHandler Function to handle register requests.
   */
  register (registerHandler) {
    this.socketObject.on('client:send', registerData => registerHandler('Register', registerData));
  }

  /**
   * Register success emitter.
   * @param {Object} registeredObject Updated user/client combo.
   */
  registered (registeredObject) {
    this.socketObject.emit('client:suc', registeredObject);
  }

  /**
   * Register failure emitter.
   * @param {Error} unregisteredReason Error event.
   */
  unregistered (unregisteredReason) {
    this.socketObject.emit('client:fai', unregisteredReason);
  }

  update (updateHandler) {
    this.socketObject.on('update:send', updateData => updateHandler('Update', updateData));
  }

  updated (updatedData) {
    this.socketObject.emit('update:suc', updatedData);
  }

  stagnated (stagnatedReason) {
    this.socketObject.emit('update:fai', stagnatedReason);
  }
  


  join (joinClient) {
    this.socketObject.broadcast.emit('notif:join', joinClient);
  }

  change (changeClient) {
    this.socketObject.broadcast.emit('notif:change', changeClient);
  }

  leave (leaveClient) {
    this.socketObject.broadcast.emit('notif:leave', leaveClient);
  }


  /**
   * Disconnect event listener.
   * @param {Function} avoidHandler Custom handler for the disconnect event.
   */
  avoid (avoidHandler) {
    this.socketObject.on('disconnect', disconnectData => avoidHandler('Avoid', disconnectData));
  }
}

module.exports = SocketRequest;