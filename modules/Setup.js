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
      this.setupDependency.dependencyThird.thirdGuid = require('guid');
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
      const createdSockets = this.getThird().thirdSocket.listen(socketsServer);
      this.setupSockets = createdSockets;

      return new Promise((socketsResolve, socketsReject) => {
          socketsResolve(createdSockets);
      });
   }
   Setup.prototype.createDatabase = function () {
      const setupInstance = this;
      setupInstance.setupQueries = [];

      function createDatabaseGetFile (fileName) {
         return new Promise((fileResolve, fileReject) => {
            const filePath = `${setupInstance.getDirectory()}\\files\\sql\\${fileName}.sql`;
            setupInstance.getCore().coreFileSystem.readFile(filePath, 'utf8', (fileError, fileData) => {
                console.log("Got " + fileName + ".sql");
                setupInstance.setupQueries.push(fileName);

               fileResolve(fileData.split(' ').map((currentElement) => {
                  return currentElement.trim();
               }).join(' '));
            });
         })
      }

      return (setupInstance.getThird().thirdSequel)
      .open(`${setupInstance.getDirectory()}\\queue.db`)

      .then(openDatabase => {
        setupInstance.setupDatabase = openDatabase;
        
        return Promise.all([
          createDatabaseGetFile('Client'),
          createDatabaseGetFile('User'),
          createDatabaseGetFile('Dashboard'),
          createDatabaseGetFile('Admin')
        ])
        .then(databaseFiles => {
          return openDatabase.transaction(databaseInstance => {
            return new Promise((trResolve, trReject) => {
              databaseFiles.forEach((dbFile, dbIndex) => {
                databaseInstance.run(dbFile);

                console.log(`Ran ${setupInstance.setupQueries[dbIndex]}.sql`);
              });

              trResolve(databaseInstance);
            });
          });
        });
      });
   }

   Setup.prototype.removeServer = function () {
     const setupInstance = this;

     return new Promise((serverResolve, serverReject) => {
       serverResolve(this.setupServer.close());
     });
   }
   Setup.prototype.removeSockets = function () {
     const setupInstance = this;

     return new Promise((socketsResolve, socketsReject) => {
       socketsResolve(setupInstance.setupSockets.close());
     })
   }
   Setup.prototype.removeDatabase = function () {
     const setupInstance = this;

     return setupInstance.setupDatabase.transaction((databaseInstance) => {
       return new Promise((databaseResolve, databaseReject) => {
         setupInstance.setupQueries.forEach((databaseQuery) => {
           databaseInstance.run(`DROP TABLE ${databaseQuery}`)
           .then(function () { 
             console.log("Dropped " + databaseQuery)
            })
         })

         databaseResolve();
       })
     })
   }

   return Setup;

}
