const WebRequest = require('./WebRequest');

class ViewRequest extends WebRequest {
  constructor (viewReq, viewRes) {
    super (viewReq, viewRes);
    
    this.viewRequestParts = this.webRequest.originalUrl.replace('/v/', '').split('/');
    this.viewRequestName = this.viewRequestParts[1];
    this.viewRequestParameter = this.viewRequestParts[2];
  }
  
  parts () {
    return {partsFor: this.viewRequestParts[0], partsBy: this.viewRequestParts[1], partsValue: this.viewRequestParts[2]};
  }
  
  summary () {
    const {partsFor, partsBy, partsValue} = this.parts();
    return `Viewing ${partsFor} for ${partsValue}.`;
  }
}

module.exports = ViewRequest;