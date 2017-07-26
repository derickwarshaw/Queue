const currentQueue = require('../queue').currentQueue;

const FileSystem = require('fs');

class File {

  static readFile (readPath) {
    return currentQueue.add(function () {
      return new Promise(function (readResolve, readReject) {
        FileSystem.readFile(readPath, 'utf-8', function (fileError, fileData) {
          if (fileError) readReject(fileError); readResolve(fileData);
        });
      });
    });
  }

  /**
   * Read files from a directory.
   * @param {String} readDirectoryPath Path to the directory to read from.
   * @returns {Promise.<Map>} Resolves with a Map of files from the directory.
   */
  static async readFiles (readDirectoryPath) {
    const filesToRead = await this.readDirectory(readDirectoryPath);

    let readFileCollection = new Map();
    for (let i = 0; i < filesToRead.length; i++) {
      readFileCollection.set(filesToRead[i], await this.readFile(`${readDirectoryPath}/${filesToRead[i]}`));
    }

    return readFileCollection;
  }

  static readDirectory (directoryPath) {
    return currentQueue.add(function () {
      return new Promise(function (readResolve, readReject) {
        FileSystem.readdir(directoryPath, function (directoryError, directoryFiles) {
          if (directoryError) readReject(directoryError); readResolve(directoryFiles);
        });
      });
    });
  }

  // TODO: Is there any reason to implement FileStreams?
}

module.exports = File;
module.exports = File;