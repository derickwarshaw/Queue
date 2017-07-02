/**
 * Created by Joshua Crowe on 01/07/2017.
 */

class WebRequest {
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

  summary () {
    return `${this.webRequestMethod} -> ${this.webRequestPath} (${this.webRequestHeaders.size} headers)`;
  }
}

module.exports = WebRequest;