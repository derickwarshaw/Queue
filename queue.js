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
const SequenceConstructor = Setup.setDependency('Sequence', [Utility]);
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
         console.log("New client requesting authentication");

         Sockets.listen('userRequest')([Database])(connectedSocket, requestData)
         .then((authenticatedUser) => {
           connectedSocket.emit('user.established', updatedUser);
         })
         .catch((authenticationFailed) => {
           // This is unlikely to ever happen.
           requestSocket.emit('user.failure');
         });




      });

   })
})
