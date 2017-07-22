const currentQueue = require('../queue').currentQueue;

const FileSystem = require('fs');

class File {

  /**
   * Read a file.
   * @param {String} filePath Path to the file.
   * @returns {*} Resolves with the file read.
   */
  static readFile (filePath) {
    return currentQueue.add(function () {
      return new Promise(function (fileResolve, fileReject) {
        FileSystem.readFile(filePath, 'utf-8', function (fileError, fileData) {
          if (fileError) fileReject(fileError); fileResolve(fileData);
        });
      });
    });
  }

}

module.exports = File;