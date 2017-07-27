const File = require('./File');

class Logger {
  constructor () {
    this.loggerStreams = new Map();
  }
  
  async request (requestName, requestData) {
    const requstSummary = `[${requestData.time()}] [${requestName} Request] ${requestData.summary()}`;
    const requestId = `${requestName} on ${requestData.date()}`;
    
    let requestFound = this.loggerStreams.get(requestName);
    
    if (!requestFound) {
      try {
        this.loggerStreams.set(requestName, File.writeStream(`./logs/${requestId}.txt`));
        requestFound = this.loggerStreams.get(requestName);
      } catch (e) {
        await File.createFile(`./logs/${requestId}.txt`);
        this.loggerStreams.set(requestName, File.writeStream(`./logs/${requestId}.txt`));
        requestFound = this.loggerStreams.get(requestName);
      }
    }

    requestFound.write(`${requstSummary} \r\n`);
    return requstSummary;
  }
}

module.exports = Logger;