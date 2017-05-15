module.exports = dependencyInjection => {

   function Setup  (setupDomain, setupPort, setupDirectory) {
      this.setupApp = null;
      this.setupServer = {};

      this.setupDirectory = setupDirectory;
      this.setupDNS = {
         DNSDomain: setupDomain,
         DNSPort: setupPort
      };

      this.setupDependency = {
         dependencyCore: {},
         dependencyThird: {},
         dependencyCustom: {}
      }

      // These won't be touched by babel.
      this.setupDependency.dependencyCore.coreHttp = require('http');
      this.setupDependency.dependencyCore.coreFileSystem = require('fs');
      this.setupDependency.dependencyThird.thirdExpress = require('express');
      this.setupDependency.dependencyThird.thirdSocket = require('socket.io');
      this.setupDependency.dependencyThird.thirdSequel = require('sqlite-async');
      this.setupDependency.dependencyThird.thirdQueue = require('promise-queue');
   }

   Setup.prototype.setDependency = function (dependencyName, dependencyDepencies) {
      // Injects dependencies into custom modules and caches them.
      return (this.setupDependency.dependencyCustom[`custom${dependencyName}`] = require(`${this.getDirectory()}\\modules\\${dependencyName}`)(dependencyDepencies));
   }

   Setup.prototype.getDirectory = function () {
      return this.setupDirectory;
   }
   Setup.prototype.getDomain = function () {
      return this.setupDNS.DNSDomain;
   }
   Setup.prototype.getPort = function () {
      return this.setupDNS.DNSPort;
   }
   Setup.prototype.getHost = function () {
      return `${this.getDomain()}:${this.getPort()}`;
   }


   Setup.prototype.getCore = function () {
      return this.setupDependency.dependencyCore;
   }
   Setup.prototype.getThird = function () {
      return this.setupDependency.dependencyThird;
   }
   Setup.prototype.getCustom = function () {
      return this.setupDependency.dependencyCustom;
   }


   Setup.prototype.getConfig = function () {
      return this.setupDependency.dependencyCustom.customConfig;
   }

   Setup.prototype.getStatic = function (staticDirectory) {
      return (this.getThird().thirdExpress).static(`${this.setupDirectory}\${staticDirectory}`);
   }


   Setup.prototype.createExpress = function () {
      const setupInstance = this;

      return new Promise((expressResolve, expressReject) => {
         expressResolve(this.setupApp = this.getThird().thirdExpress());
      })
   }
   Setup.prototype.createServer = function (expressServer) {
      const setupInstance = this;

      return new Promise((serverResolve, serverReject) => {
         setupInstance.setupServer = setupInstance.getCore().coreHttp.createServer(expressServer);

         serverResolve(setupInstance.setupServer);
      });
   }
   Setup.prototype.createSockets = function (socketsServer) {
      const setupInstance = this;

      return new Promise((socketsResolve, socketsReject) => {
          socketsResolve(setupInstance.getThird().thirdSocket.listen(socketsServer));
      });
   }
   Setup.prototype.createDatabase = function () {
      const setupInstance = this;
      let setupCount = [];

      function createDatabaseGetFile (fileName) {
         return new Promise((fileResolve, fileReject) => {
            const filePath = `${setupInstance.getDirectory()}\\files\\sql\\${fileName}.sql`;
            setupInstance.getCore().coreFileSystem.readFile(filePath, 'utf8', (fileError, fileData) => {
                console.log("Got " + fileName + ".sql");
                setupCount.push(`${fileName}.sql`);

               fileResolve(fileData.split(' ').map((currentElement) => {
                  return currentElement.trim();
               }).join(' '));
            });
         })
      }

      return new Promise((databaseResolve, databaseReject) => {
         Promise.all([
           createDatabaseGetFile('Client'),
           createDatabaseGetFile('User'),
           createDatabaseGetFile('Dashboard'),
           createDatabaseGetFile('Admin')
         ])
         .then((databaseFiles) => {
            (setupInstance.getThird().thirdSequel)
            .open(`${setupInstance.getDirectory()}\\queue.db`)

            .then((databaseInstance) => {
               return databaseInstance.transaction(databaseInstance => {
                  return new Promise((trResolve, trReject) => {
                     databaseFiles.forEach((dbQuery, dbIndex) => {
                        databaseInstance.run(dbQuery);

                        console.log(`Ran ${setupCount[dbIndex]}`);
                     });

                     trResolve(databaseInstance);
                  });
               });
            })
            .then(databaseResolve)
            .catch(databaseReject);
         });
      });
   }



   return Setup;

}
