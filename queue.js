const SetupConstructor = require('./modules/Setup')();
const Setup = new SetupConstructor("127.0.0.1", "3000", __dirname);

// Dev require hook.
require('babel-register');
require('babel-polyfill');

// ------- Babel Transforms Below Here -------------- //



const Utility = Setup.setDependency('Utility');

const FileConstructor = Setup.setDependency('File', [Setup.getCore().coreFileSystem, Utility]);
const File = new FileConstructor(Setup.getDirectory());

const ConfigConstructor = Setup.setDependency('Config', [File]);
const Config = new ConfigConstructor();

const SocketsConstructor = Setup.setDependency('Sockets', [Setup]);
const SequenceConstructor = Setup.setDependency('Sequence', [Utility, Setup.getThird().thirdGuid]);
const DatabaseConstructor = Setup.setDependency('Database', [
  SequenceConstructor, Setup.getThird().thirdQueue, Setup.getThird().thirdGuid
]);

var Sockets = null, Database = null;


Setup.createExpress()
.then((expressServer) => {

   expressServer.use(Setup.getStatic('public'));
   expressServer.get('/', (getRequest, getResolve) => {
      File.getIndexPath().then((indexPath) => {
         getResolve.sendFile(indexPath);
         console.log(`Served ${indexPath.substring(indexPath.lastIndexOf('/'))} for '/'`);
      });
   });
    console.log(`Set route for '/'`);

   return Setup.createServer(expressServer);
})
.then((httpServer) => {
   httpServer.listen(Setup.getPort());
   console.log("Started server.");

   return Setup.createSockets(httpServer);
})
.then((socketsServer) => {
   Sockets = new SocketsConstructor(socketsServer.sockets);
   console.log("Set socket listener.");

   return Setup.createDatabase();
})
.then((databaseServer) => {
   Database = new DatabaseConstructor(databaseServer);

   console.log("Created database.");

   console.log(`The server is ready on ${Setup.getHost()}`);
   Sockets.connected((connectedSocket) => {

      console.log("Emitted a connection notice.")
      connectedSocket.emit('user.connected');

      // --------- User Establishment ----- */
      connectedSocket.on('user.request', (requestData) => {
         console.log(`User "${requestData.userName}" requesting signing.`);

         Sockets.listen('userRequest')([Database])(requestData)
         .then((authenticatedUser) => {
           connectedSocket.emit('user.established', updatedUser);
           console.log(`User "${requestData.userName}" was signed.`);
         })
         .catch((authenticationFailed) => {
           // This is unlikely to ever happen.
           connectedSocket.emit('user.failure');
           console.log(`User "${requestData.userName}" failed signing: ${authenticationFailed.message}`);
         });
      });

   })
})





/* ---- Process Handling ---- */

// Received when server is performing standard exit
process.on('exit', function () {
   console.log("Server is Exiting"); // a.k.a intentional
});

// Received when CTRL + C is pressed in terminal
process.on('SIGINT', function () {
   console.log("CTRL + C was pressed."); // a.k.a intentional

  Setup.removeSockets()
  .then(function () {
    return Setup.removeServer();
  })
  .then(function () {
    return Setup.removeDatabase();
  })
  .then(function () {
    console.log("Server finished exiting. Bye bye.");
    process.exit();
  });
});

// Received when the server crashes due to error
process.on('uncaughtException', function (e) {
   console.log("Server crashed."); // a.k.a unintentional
   console.log(e.stack);
});
