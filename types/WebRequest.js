class WebRequest {

  /**
   * Manage a web request.
   * @param {Object} requestReq Request object.
   * @param {Object} requestRes Resolve object.
   */
  constructor (requestReq, requestRes) {
    this.webRequestDate = new Date();
    
    this.webRequest = requestReq;
    this.webResponse = requestRes;
    
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

  
  time () {
    return `${this.webRequestDate.toLocaleDateString()} @ ${this.webRequestDate.toLocaleTimeString()}`;
  }
  
  /**
   * Generate a summary of the request.
   * @returns {String} Summary of the request.
   */
  summary () {
    return `${this.webRequestMethod} -> ${this.webRequestPath} (${this.webRequestHeaders.size} headers)`;
  }
  
  
  
  allowOrigin (originType) {
    this.webResponse.header("Access-Control-Allow-Origin", originType);
  }
  
  allowHeaders (headersAllow) {
    this.webResponse.header("Access-Control-Allow-Headers", headersAllow.join(', '));
  }
}

module.exports = WebRequest;