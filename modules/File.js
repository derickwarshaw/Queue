module.exports = dependencyInjection => {

   const fileSystem = dependencyInjection[0];
   const Utility = dependencyInjection[1];

   function File () {
      this.fileBase = __dirname;
      this.filePaths = {
         pathFile: 'files',
         pathPublic: 'public'
      }
   }

   File.prototype.getPath = function (pathFile) {

   }
   File.prototype.getIndexPath = async function () {
      return `${await this.getPath('public')}/index.html`;
   }



   File.prototype.getFile = async function (filePath) {
      return fileSystem.readFile(`${await this.getPath('files')}/${filePath}`, function (fileError, fileData) {
         return fileData ? fileData : fileError;
      });
   }

   return File;

}
