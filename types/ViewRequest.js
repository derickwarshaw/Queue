const WebRequest = require('./WebRequest');

class ViewRequest extends WebRequest {

  // TODO: JSdoc.
  constructor (viewReq, viewRes) {
    super (viewReq, viewRes);
    
    this.viewRequestParts = this.webRequest.originalUrl.replace('/v/', '').split('/');
    this.viewRequestName = this.viewRequestParts[1];
    this.viewRequestParameter = this.viewRequestParts[2];
  }

  // TODO: JSdoc.
  parts () {
    return {partsFor: this.viewRequestParts[0], partsBy: this.viewRequestParts[1], partsValue: this.viewRequestParts[2]};
  }

  // TODO: JSdoc.
  summary () {
    const {partsFor, partsBy, partsValue} = this.parts();
    return `Viewing ${partsFor} for ${partsValue}.`;
  }

}

module.exports = ViewRequest;