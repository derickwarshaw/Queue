const SetupConstructor = require('./modules/Setup')();
const Setup = new SetupConstructor("127.0.0.1", "3000", __dirname);

// Dev require hook.
require('babel-register');
require('babel-polyfill');

// ------- Babel Transforms Below Here -------------- //



const Utility = Setup.setDependency('Utility');
const Translation = Setup.setDependency('Translation');

const FileConstructor = Setup.setDependency('File', [Setup.getCore().coreFileSystem, Utility]);
const File = new FileConstructor(Setup.getDirectory());

const ConfigConstructor = Setup.setDependency('Config', [File]);
const Config = new ConfigConstructor();

const SequenceConstructor = Setup.setDependency('Sequence', [Utility]);
const Sequence = SequenceConstructor({
   marker: "?",
   identifiers: ["SELECT", "INSERT", "UPDATE", "DELETE"],
   operands: ["*", "TOP", "INTO", "COUNT"],
   operations: ["FROM", "VALUES", "SET"],
   filters: ["WHERE", "ORDER BY"],
   orients: ["ASC", "ASCENDING", "DESC", "DESCENDING"]
});

const SocketsConstructor = Setup.setDependency('Sockets', [Setup]);
const DatabaseConstructor = Setup.setDependency('Database', [
  Sequence, Setup.getThird().thirdQueue, Setup.getThird().thirdGuid, Utility
]);


var Sockets = null, Database = null, Handler = null;


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
   Handler = Setup.setDependency('Handler', [Database, Translation]);

   console.log("Created database.");
   console.log(`The server is ready on ${Setup.getHost()}`);

   Sockets.connected(Handler);
})





/* ---- Process Handling ---- */

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


global.deleteDatabase = Setup.removeDatabase;
