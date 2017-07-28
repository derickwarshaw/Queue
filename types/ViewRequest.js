const WebRequest = require('./WebRequest');

class ViewRequest extends WebRequest {

  /**
   * Manage a HTTP request to the API.
   * @param {IncomingMessage} viewReq Request object.
   * @param {ServerResponse} viewRes Response object.
   */
  constructor (viewReq, viewRes) {
    super (viewReq, viewRes);
    
    this.viewRequestParts = this.webRequest.originalUrl.replace('/v/', '').split('/');
    this.viewRequestName = this.viewRequestParts[1];
    this.viewRequestParameter = this.viewRequestParts[2];
  }

  /**
   * Get all parts.
   * @returns {Object} Request parts.
   */
  parts () {
    return {partsFor: this.viewRequestParts[0], partsBy: this.viewRequestParts[1], partsValue: this.viewRequestParts[2]};
  }

  /**
   * Get the summary.
   * @returns {String} Request summary.
   */
  summary () {
    const {partsFor, partsBy, partsValue} = this.parts();
    return `Viewing ${partsFor} for ${partsValue}.`;
  }

}

module.exports = ViewRequest;