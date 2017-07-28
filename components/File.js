const currentQueue = require('../queue').currentQueue;

const FileSystem = require('fs');

const FileStreamer = require('../types/FileStreamer');

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
   * Create a read stream.
   * @param {String} streamFile Path to file.
   * @returns {FileStreamer} File stream.
   */
  static readStream (streamFile) {
    return new FileStreamer('read', streamFile);
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