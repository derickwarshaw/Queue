/**
 * Created by Joshua Crowe on 01/07/2017.
 */

const WebRequest = require('../types/WebRequest');
const SocketRequest = require('../types/SocketRequest');

// TODO: Does this need to be here?
class Translation {

  /**
   * Translate a Web request.
   * @param {Object} requestReq Request object.
   * @param {Object} requestRes Resolve object.
   * @returns {Promise} Translated web request.
   */
  static webRequest (requestReq, requestRes) {
    return new Promise(function (requestResolve, requestReject) {
      const promisedRequest = new WebRequest(requestReq, requestRes);
      requestResolve(promisedRequest);
    });
  }

  /**
   * Translate a socket request.
   * @param {Object} requestSocket Socket object of request origin.
   * @returns {Promise} Translated socket request.
   */
  static socketRequest (requestSocket) {
    return new Promise(function (requestResolve, requestReject) {
      const promisedRequest = new SocketRequest(requestSocket);
      requestResolve(promisedRequest);
    })
  }
}

module.exports = Translation;