/**
 * Created by Joshua Crowe on 01/07/2017.
 */

const WebRequest = require('../types/WebRequest');
const SocketRequest = require('../types/SocketRequest');
const User = require('../types/User');

class Translation {
  static webRequest (requestReq, requestRes) {
    return new Promise(function (requestResolve, requestReject) {
      const promisedRequest = new WebRequest(requestReq, requestRes);
      requestResolve(promisedRequest);
    });
  }
  static socketRequest (requestSocket) {
    return new Promise(function (requestResolve, requestReject) {
      const promisedRequest = new SocketRequest(requestSocket);
      requestResolve(promisedRequest);
    })
  }


  static user (userObject) {
    return new Promise(function (userResolve, userReject) {
      const promisedUser = new User(userObject);
      userResolve(promisedUser);
    });
  }
}

module.exports = Translation;