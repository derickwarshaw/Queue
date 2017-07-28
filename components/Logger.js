const File = require('./File');

class Logger {
  
  /**
   * Manage a log system.
   */
  constructor () {
    this.loggerStreams = new Map();
  }
  
  /**
   * Log a request.
   * @param {String} requestName Category of request.
   * @param {String} requestData Summary.
   * @returns {Promise.<string>}
   */
  async request (requestName, requestData) {
    const requstSummary = `[${requestData.timestamp()}] [${requestName} Request] ${requestData.summary()}`;
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
  
  /**
   * Log a problem.
   * @param {Error} problemError Error thrown.
   * @returns {Promise.<void>}
   */
  async problem (problemError) {
    const problemDate = new Date();
    
    let problemFound = this.loggerStreams.get("Problem");
    
    if (!problemFound) {
      try {
        this.loggerStreams.set("Problem", File.writeStream(`./logs/${problemId}.txt`));
        problemFound = this.loggerStreams.get("Problem");
      } catch (e) {
        await File.createFile(`./logs/${problemId}.txt`);
        this.loggerStreams.set("Problem", File.writeStream(`./logs/${problemId}.txt`));
        problemFound = this.loggerStreams.get("Problem");
      }
    }
    
    problemFound.write(`Problem on ${problemDate.toLocaleDateString()} @ ${problemDate.toLocaleTimeString()} \r\n`);
    problemFound.write(problemError.message);
    problemFound.write(problemError.stack);
    problemFound.write("\r\n \r\n");
  }

}

module.exports = Logger;