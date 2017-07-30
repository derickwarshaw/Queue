const FileSystem = require('graceful-fs');

class FileStreamer {

  /**
   * Stream from or to a file.
   * @param {String} streamerType Type of stream to establish.
   * @param {String} streamerFile Path to the file.
   * @returns {FileStreamer} FileStreamer instance.
   */
  constructor (streamerType, streamerFile) {
    this.fileStreamerType = streamerType;
    this.fileStreamerFile = streamerFile;
    
    if (this.fileStreamerType === "read") {
      this.fileStreamerStream = FileSystem.createReadStream(this.fileStreamerFile);
    } else if (this.fileStreamerType === "write") {
      this.fileStreamerStream = FileSystem.createWriteStream(this.fileStreamerFile, {flags: 'a'});
    }
  }

  /**
   * Read the file.
   * @param readCallback
   */
  read (readCallback) {
    if (this.fileStreamerType === 'read' && this.fileStreamerStream) {
      this.fileStreamerStream.on('data', readCallback);
    } else {
      throw Error("This is not a readable stream.");
    }
  }

  /**
   * Write to the file.
   * @param {String} writeData Data to write.
   */
  write (writeData) {
    if (this.fileStreamerType === 'write' && this.fileStreamerStream) {
      this.fileStreamerStream.write(writeData);
    } else {
      throw Error("This is not a writeable stream.");
    }
  }

  /**
   * Pipe to the file.
   * @param {Stream} pipeData Stream to pipe from.
   */
  pipe (pipeData) {
    if (this.fileStreamerType === 'write' && this.fileStreamerStream) {
      this.fileStreamerStream.pipe(pipeData);
    } else {
      throw Error("This is not a writeable stream");
    }
  }

}

module.exports = FileStreamer;
