module.exports = dependencyInjection => {

   const fileSystem = dependencyInjection[0];
   const Utility = dependencyInjection[1];

   function File (fileBase) {
      this.fileBase = fileBase;
      this.filePaths = {
         pathFile: 'files',
         pathPublic: 'public'
      }
   }

   File.prototype.getPath = function (pathFile) {
      const filePaths = this.filePaths;
      const fileDirectory = this.fileBase;

      return new Promise((resolvePath, rejectPath) => {
         for (savedPath in filePaths) {
            if (filePaths[savedPath] === pathFile) {
               resolvePath(`${fileDirectory}/${filePaths[savedPath]}`);
            }
         }
      });
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
