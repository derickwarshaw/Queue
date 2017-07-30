const currentQueue = require('../queue').currentQueue;

const FileSystem = require('fs');
const FileStreamer = require('../types/FileStreamer');

class File {

  /**
   * Read a file.
   * @param {String} readPath Path to the file.
   * @returns {LocalPromise} Contents of the file.
   */
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
   * Read all items in a directory.
   * @param {String} directoryPath Path to directory.
   * @returns {LocalPromise.<Array.<*>>} Items in the directory.
   */
  static readDirectory (directoryPath) {
    return currentQueue.add(function () {
      return new Promise(function (readResolve, readReject) {
        FileSystem.readdir(directoryPath, function (directoryError, directoryFiles) {
          if (directoryError) readReject(directoryError); readResolve(directoryFiles);
        });
      });
    });
  }
  
  /**
   * Create  a blank file.
   * @param {String} filePath Path of file.
   * @returns {Promise.<void>}
   */
  static async createFile (filePath) {
    await this.writeFile(filePath, '');
  }

  /**
   * Create a directory.
   * @param directoryPath Path to the location of the new directory.
   */
  static async createDirectory (directoryPath) {
    return currentQueue.add(function () {
      return new Promise(function (directoryResolve, directoryReject) {
        FileSystem.mkdir(directoryPath, function (directoryError) {
          if (directoryError) directoryReject(directoryError); directoryResolve();
        });
      })
    })
  }
  
  /**
   * Write to a file.
   * @param {String} filePath Path to file.
   * @param {String} fileData Data to write.
   */
  static writeFile (filePath, fileData) {
    return currentQueue.add(function () {
      return new Promise(function (writeResolve, writeReject) {
        FileSystem.writeFile(filePath, fileData, function (fileErrror) {
          if (fileError) writeReject(fileErrror);
        
          writeResolve();
        })
      })
    })
  }
  
  /**
   * Create a write stream.
   * @param {String} streamFile Path to file.
   * @returns {FileStreamer}
   */
  static writeStream (streamFile) {
    return new FileStreamer('write', streamFile);
  }

}

module.exports = File;