const WebRequest = require('./WebRequest');

class ApiRequest extends WebRequest {
  constructor (apiReq, apiRes) {
    super (apiReq, apiRes);

    this.apiRequestParts = this.webRequest.originalUrl.replace('/api/', '').split('/');
    this.apiRequestAssignment = this.apiRequestParts.map(part => `${part} -> `).join('');
  }
  
  parts () {
    return {partsFor: this.apiRequestParts[0], partsBy: this.apiRequestParts[1], partsValue: this.apiRequestParts[2]};
  }
  
  summary () {
    const {partsFor, partsBy, partsValue} = this.parts();
    return `${this.webRequestMethod} -> ${partsFor} with ${partsBy} of ${partsValue}.`;
  }
}

module.exports = ApiRequest;