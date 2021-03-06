const WebRequest = require('./WebRequest');

class ApiRequest extends WebRequest {

  /**
   * Manage a HTTP request to the API.
   * @param {IncomingMessage} apiReq Request object.
   * @param {ServerResponse} apiRes Response object.
   */
  constructor (apiReq, apiRes) {
    super (apiReq, apiRes);

    this.apiRequestParts = this.webRequest.originalUrl.replace('/api/', '').split('/');
    this.apiRequestAssignment = this.apiRequestParts.map(part => `${part} -> `).join('');
  }

  /**
   * Get all URL parts.
   * @returns {Object} Parts.
   */
  parts () {
    return {
      partsFor: this.apiRequestParts[0],
      partsBy: this.apiRequestParts[1],
      partsValue: this.apiRequestParts[2]
    };
  }

  /**
   * Summarise the request.
   * @returns {string}
   */
  summary () {
    const {partsFor, partsBy, partsValue} = this.parts();
    return `${this.webRequestMethod} -> ${partsFor} with ${partsBy} of ${partsValue}.`;
  }

}

module.exports = ApiRequest;