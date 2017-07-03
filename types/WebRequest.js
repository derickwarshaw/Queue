class WebRequest {

  /**
   * Manage a web request.
   * @param {Object} requestReq Request object.
   * @param {Object} requestRes Resolve object.
   */
  constructor (requestReq, requestRes) {
    this.webRequestMethod = requestReq.method;
    this.webRequestPath = requestReq.originalUrl;

    // Set Headers
    this.webRequestHeaders = new Map();
    for (const headerKey in requestReq.headers) {
      if (requestReq.headers.hasOwnProperty(headerKey)) {
        this.webRequestHeaders.set(headerKey, requestReq.headers[headerKey]);
      }
    }
  }

  /**
   * Generate a summary of the request.
   * @returns {String} Summary of the request.
   */
  summary () {
    return `${this.webRequestMethod} -> ${this.webRequestPath} (${this.webRequestHeaders.size} headers)`;
  }
}

module.exports = WebRequest;