const WebRequest = require('./WebRequest');

class CdnRequest extends WebRequest {
  constructor (cdnReq, cdnRes) {
    super (cdnReq, cdnRes);
    
    this.cdnRequestParts = this.webRequest.originalUrl.replace('/cdn/', '').split('/');
    this.cdnRequestFile = this.cdnRequestParts[1];
    this.cdnRequestFileType = this.cdnRequestFile.split('.')[1];
    
    switch (this.cdnRequestFileType) {
      case "js": this.cdnRequestFileMime = "text/javascript"; break;
      case "css": this.cdnRequestFileMime = "text/css"; break;
    }
    
    this.webResponse.contentType(this.cdnRequestFileMime);
  }
  
  summary () {
    return `Serving ${this.cdnRequestFile} (${this.cdnRequestFileMime})`;
  }
}

module.exports = CdnRequest;