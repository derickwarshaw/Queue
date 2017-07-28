const WebRequest = require('./WebRequest');

class CdnRequest extends WebRequest {

  /**
   * Manage a HTTP request to the API.
   * @param {IncomingMessage} cdnReq Request object.
   * @param {ServerResponse} cdnRes Response object.
   */
  constructor (cdnReq, cdnRes) {
    super (cdnReq, cdnRes);
    
    this.cdnRequestParts = this.webRequest.originalUrl.replace('/cdn/', '').split('/');
    this.cdnRequestFile = this.cdnRequestParts[1];

    if (this.cdnRequestFile && this.cdnRequestFile.includes('.')) {
      this.cdnRequestFileType = this.cdnRequestFile.split('.')[1];

      switch (this.cdnRequestFileType) {
        case "js": this.cdnRequestFileMime = "text/javascript"; break;
        case "css": this.cdnRequestFileMime = "text/css"; break;
      }

      this.webResponse.contentType(this.cdnRequestFileMime);
    }
  }

  /**
   * Summarise the request.
   * @returns {String} Summary of the request.
   */
  summary () {
    return `Serving ${this.cdnRequestFile} (${this.cdnRequestFileMime})`;
  }

}

module.exports = CdnRequest;