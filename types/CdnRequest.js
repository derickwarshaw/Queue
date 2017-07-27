const WebRequest = require('./WebRequest');

class CdnRequest extends WebRequest {

  // TODO: JSdoc.
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

  // TODO: JSdoc.
  summary () {
    return `Serving ${this.cdnRequestFile} (${this.cdnRequestFileMime})`;
  }

}

module.exports = CdnRequest;