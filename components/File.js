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

  static readDirectory (directoryPath) {
    return currentQueue.add(function () {
      return new Promise(function (readResolve, readReject) {
        FileSystem.readdir(directoryPath, function (directoryError, directoryFiles) {
          if (directoryError) readReject(directoryError); readResolve(directoryFiles);
        });
      });
    });
  }

  static readStream (streamFile) {
    return new FileStreamer('read', streamFile);
  }
  
  static async createFile (filePath) {
    await this.writeFile(filePath, '');
  }
  
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
    
  static writeStream (streamFile) {
    return new FileStreamer('write', streamFile);
  }
}

module.exports = File;