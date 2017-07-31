const File = require('./File');

class Logger {
  
  /**
   * Manage a log system.
   */
  constructor () {
    this.loggerStreams = new Map();
  }

  /**
   * Resolve all the appropriate files and directories.
   * @param {String} beginDirectory Path to the logs folder.
   * @returns {Promise.<void>}
   */
  async begin (beginDirectory) {
    try {
      await File.readDirectory(beginDirectory);
    } catch (beginError) {
      await File.createDirectory(beginDirectory);
    }

    try {
      await File.readDirectory(`${beginDirectory}/${(new Date()).toLocaleDateString()}`);
    } catch (beginError) {
      await File.createDirectory(`${beginDirectory}/${(new Date()).toLocaleDateString()}`);
    }
  }

  /**
   * Log a request to the server.
   * @param {String} requestName Name of the request.
   * @param {WebRequest} requestData Request instance.
   * @returns {Promise.<String>} Summary of the request.
   */
  async request (requestName, requestData) {
    const requestSummary = `[${requestData.timestamp()}] [${requestName} Request] ${requestData.summary()}`;
    const requestDate = requestData.date();
    const requestPath = `./logs/${requestDate}/${requestName} on ${requestDate}.txt`;

    let requestFound = this.loggerStreams.get(requestName);

    if (!requestFound) {
      try {
        this.loggerStreams.set(requestName, File.writeStream(requestPath));
        requestFound = this.loggerStreams.get(requestName);
      } catch (requestError) {
        await File.createFile(requestPath);
        this.loggerStreams.set(requestName, File.writeStream(requestPath));
        requestFound = this.loggerStreams.get(requestName);
      }
    }

    requestFound.write(`${requestSummary} \r\n`);
    return requestSummary;
  }

  /**
   * Log an error.
   * @param {Error} problemError Thrown error.
   * @returns {Promise.<String>} Summary of the error.
   */
  async problem (problemError) {
    const problemDate = new Date();
    const problemDates = `[${problemDate.toLocaleDateString()} @ ${problemDate.toLocaleTimeString()}]`;
    const problemSummary = `${problemDates} [${problemError.name}] [${problemError.lineNumber}] ${problemError.message}`;
    const requestPath = `./logs/${problemDate.toLocaleDateString()}/Problems on ${problemDate.toLocaleDateString()}.txt`;

    let problemFound = this.loggerStreams.get("Problems");

    if (!problemFound) {
      try {
        this.loggerStreams.set("Problems", File.writeStream(requestPath));
        problemFound = this.loggerStreams.get("Problems");
      } catch (problemError) {
        await File.createFile(requestPath);
        this.loggerStreams.set("Problems", File.writeStream(requestPath));
        problemFound = this.loggerStreams.get("Problems");
      }
    }

    problemFound.write(`${problemSummary} \r\n`);
    return problemSummary;
  }
  
  /**
   * Log a worker.
   * @param {ApplicationWorker} clusterApplication Worker.
   * @param {String} clusterMessage Message to log.
   * @returns {Promise.<String>} Log.
   */
  async worker (clusterApplication, clusterMessage) {
    const clusterDate = new Date();
    const clusterDates = `[${clusterDate.toLocaleDateString()} @ ${clusterDate.toLocaleTimeString()}]`;
    const clusterSummary = `${clusterDates} [Application Worker #${clusterApplication.id}] ${clusterMessage}.`;
    const clusterPath = `./logs/${clusterDate.toLocaleDateString()}/Workers on ${clusterDate.toLocaleDateString()}.txt`;
    
    let clusterFound = this.loggerStreams.get("Worker");
    
    if (!clusterFound) {
      try {
        this.loggerStreams.set("Worker", File.writeStream(clusterPath));
        clusterFound = this.loggerStreams.get("Worker");
      } catch (clusterError) {
        await File.createFile(clusterPath);
        this.loggerStreams.set("Worker", File.writeStream(clusterPath));
        clusterFound = this.loggerStreams.get("Worker");
      }
    }
    
    clusterFound.write(`${clusterSummary} \r\n`);
    return clusterSummary;
  }

}

module.exports = Logger;