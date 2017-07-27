const FileSystem = require('graceful-fs');

class FileStreamer {
  constructor (streamerType, streamerFile) {
    this.fileStreamerType = streamerType;
    this.fileStreamerFile = streamerFile;
    
    if (this.fileStreamerType === "read") {
      this.fileStreamerStream = FileSystem.createReadStream(this.fileStreamerFile);
    } else if (this.fileStreamerType === "write") {
      this.fileStreamerStream = FileSystem.createWriteStream(this.fileStreamerFile);
    }
  }
  
  read (readCallback) {
    if (this.fileStreamerType === 'read' && this.fileStreamerStream) {
      this.fileStreamerStream.on('data', readCallback);
    } else {
      throw Error("This is not a readable stream.");
    }
  }
  
  write (writeData) {
    if (this.fileStreamerType === 'write' && this.fileStreamerStream) {
      this.fileStreamerStream.write(writeData);
    } else {
      throw Error("This is not a writeable stream.");
    }
  }
  
  pipe (pipeData) {
    if (this.fileStreamerType === 'write' && this.fileStreamerStream) {
      this.fileStreamerStream.pipe(pipeData);
    } else {
      throw Error("This is not a writeable stream");
    }
  }
}

module.exports = FileStreamer;
