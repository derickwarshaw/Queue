const SetupConstructor = require('./modules/Setup')();
const Setup = new SetupConstructor("127.0.0.1", "3000", __dirname);

// Dev require hook.
require('babel-register');
require('babel-polyfill');

// ------- Babel Transforms Below Here -------------- //

const Utility = Setup.setDependency('Utility');

const FileConstructor = Setup.setDependency('File', [Setup.getCore().coreFileSystem, Utility]);
const File = new FileConstructor();

const ConfigConstructor = Setup.setDependency('Config', [File]);
const Config = new ConfigConstructor();

const SocketsConstructor = Setup.setDependency('Sockets', [Setup]);
var Sockets = null;

const SequenceConstructor = Setup.setDependency('Sequence');

const DatabaseConstructor = Setup.setDependency('Database', [Setup.getThird().thirdSequel, SequenceConstructor]);
var Database = null;


Setup.createExpress()
.then((expressServer) => {

   expressServer.use(Setup.getStatic('public'));
   expressServer.get('/', (getRequest, getResolve) => {
      getResolve.sendFile(File.getIndexPath());
   });
   console.log("Set default routes.");

   return Setup.createServer(expressServer);
})
.then((httpServer) => {

   console.log("Created server.");
   httpServer.listen(Setup.getPort());
   console.log("Started server.");

   return Setup.createSockets(httpServer);
})
.then((socketsServer) => {
   console.log("Set socket listener.");
   Sockets = new SocketsConstructor(socketsServer.sockets);
   console.log("Created socket monitor.");

   return Setup.createDatabase();
})
.then((databaseServer) => {
   console.log("Created database.");
   Database = new DatabaseConstructor(databaseServer);
   console.log("Created database listener.");

   Sockets.connected((connectedSocket) => {

      console.log("Emitted a connection notice.")
      connectedSocket.emit('client.connected');

      connectedSocket.on('client.request', (requestData) => {
         console.log("New client requesting authentication");

         Socket.listen('clientRequest')([Socket, Database])(requestData, connectedSocket);
      });

   })
})
