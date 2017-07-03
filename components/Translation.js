/**
 * Created by Joshua Crowe on 01/07/2017.
 */

const WebRequest = require('../types/WebRequest');
const SocketRequest = require('../types/SocketRequest');
const User = require('../types/User');


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

  /**
   * Translate a user.
   * @param {Object} userObject Object with user-related info.
   * @returns {Promise} Translated user object.
   */
  static user (userObject) {
    return new Promise(function (userResolve, userReject) {
      const promisedUser = new User(userObject);
      userResolve(promisedUser);
    });
  }
}

module.exports = Translation;