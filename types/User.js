/**
 * Created by Joshua Crowe on 02/07/2017.
 */

// TODO: Add JSDOC descriptions @.
class User {
  constructor (userObject) {
    // TODO: Add type protection/checking.
    this.userId = userObject.UserId;
    this.userName = userObject.UserName;
    this.userNumber = userObject.UserNumber;
    this.userLocation = userObject.UserLocation;
    this.userDate = userObject.UserDate;
    this.clientId = null;
    this.adminId = null;
  }
}

module.exports = User;