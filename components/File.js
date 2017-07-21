const FileSystem = require('fs');

class File {

  /**
   * Read a file.
   * @param {String} readPath Path to the file.
   * @returns {Promise.<String>} Resolves with the file read.
   */
  static readFile (readPath) {
    return new Promise(function (readResolve, readReject) {
      FileSystem.readFile(readPath, 'utf-8', function (fileError, fileData) {
        if (fileError) readReject(fileError); readResolve(fileData);
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
   * Read all file names in a directory.
   * @param {String} directoryPath Path of the directory to read.
   * @returns {Promise.<Array>} File names in the directory.
   */
  static readDirectory (directoryPath) {
    return new Promise(function (readResolve, readReject) {
      FileSystem.readdir(directoryPath, function (directoryError, directoryFiles) {
        if (directoryError) readReject(directoryError); readResolve(directoryFiles);
      });
    });
  }

  // TODO: Is there any reason to implement FileStreams?
}

module.exports = File;