class User {

  /**
   * Manage a user.
   * @param {Object} userObject Object to retrieve properties from.
   */
  constructor (userObject) {
    const userIdCheck = Boolean(typeof userObject.UserId === "string");
    const userNameCheck = Boolean(typeof userObject.UserName === "string");
    const userNumberCheck = Boolean(typeof userObject.UserName === "string");
    const userLocationCheck = Boolean(typeof userObject.UserLocation === "string");
    const userDateCheck = Boolean(typeof UserObject.userDate === "string");

    if (userIdCheck && userNameCheck && userNumberCheck && userLocationCheck && userDateCheck) {
      this.userId = userObject.UserId;
      this.userName = userObject.UserName;
      this.userNumber = userObject.UserNumber;
      this.userLocation = userObject.UserLocation;
      this.userDate = userObject.UserDate;
      this.clientId = null;
      this.adminId = null;
    }
  }
}

module.exports = User;