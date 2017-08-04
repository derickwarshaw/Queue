const HTTP = require('http');
const OS = require('os');
const Cluster = require('cluster');
const Path = require('path');
const Express = require('express');
const BodyParser = require('body-parser');
const Socket = require('socket.io');
const Handlebars = require('express-handlebars');
const Sticky = require('sticky-session');

const WebRequest = require('../types/WebRequest');
const ApiRequest = require('../types/ApiRequest');
const ViewRequest = require('../types/ViewRequest');
const CdnRequest = require('../types/CdnRequest');
const SocketRequest = require('../types/SocketRequest');
const ApplicationWorker = require('../types/ApplicationWorker');

class Application {

  /**
   * Acts as the root of all server properties.
   * @param {String} applicationDirectory Root directory of the server.
   * @param {Number} applicationPort Port the server should run on.
   * @returns Application instance.
   */
  constructor (applicationDirectory, applicationPort) {
    this.applicationDirectory = applicationDirectory;
    this.applicationPort = applicationPort;
    this.applicationRoutes = {};
  
    this.applicationExpress = Express();
    this.applicationHttp = HTTP.createServer(this.applicationExpress);
    this.applicationSockets = Socket.listen(this.applicationHttp);
    this.applicationSockets.set('origins', "*:*");
    
    // Express Setup.
    this.applicationExpress.use(BodyParser.urlencoded({extended: false}));
    this.applicationExpress.use(Express.static(Path.join(this.applicationDirectory, '/public')));
    this.applicationEngine = Handlebars.create({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: Path.join(__dirname + '/../public/views/layouts')
    });
    this.applicationExpress.engine('hbs', this.applicationEngine.engine);
    this.applicationExpress.set('view engine', 'hbs');
    this.applicationExpress.set('views', Path.join(__dirname, '/../public/views'));
  }
  
  /**
   * Clusters the process.
   * @param {Function} clusterWorker Instructions to give to the worker.
   */
  cluster (clusterWorker) {
    if (!Sticky.listen(this.applicationHttp, process.env.PORT || this.applicationPort)) {
      console.log("Server listening on " + process.env.PORT || this.applicationPort);
      OS.cpus().forEach(cpu => Cluster.fork());
    } else if (Cluster.isWorker) {
      clusterWorker(new ApplicationWorker(process.pid));
    }
  }
  
  /**
   * Middleware for express web requests.
   * @param {Function} middleHandler Custom handler function.
   */
  middle (middleHandler) {
    this.applicationExpress.use(function (middleReq, middleRes, middleNext) {
      middleHandler(new WebRequest(middleReq, middleRes));
      middleNext();
    });
  }

  /**
   * Set up the API route handler.
   * @param {String} apiRoute Route at the base of all requests.
   * @param {Array} apiPaths Routes to register.
   * @param {Function} apiHandler Middleware for routes.
   */
  api (apiRoute, apiPaths, apiHandler) {
    this.applicationRoutes.routesApi = apiRoute;

    const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/apiBase'));
    this.applicationExpress.use(this.applicationRoutes.routesApi, routerRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      apiHandler(new ApiRequest(baseReq, baseRes));
      baseNext();
    });

    for (let i = 0; i < apiPaths.length; i++) {
      const cdnCreate = require(Path.join(this.applicationDirectory, '/routes/', `api${apiPaths[i]}`));
      this.applicationExpress.use(`${this.applicationRoutes.routesApi}/${apiPaths[i].toLowerCase()}`, cdnCreate(Express.Router()));
    }
  }

  /**
   * Set up the views route handler.
   * @param {String} viewsRoute Route at the base of all requests.
   * @param {Array.<String>} viewsPaths Routes to register.
   * @param {Function} viewsHandler Middleware for routes.
   */
  views (viewsRoute, viewsPaths, viewsHandler) {
    this.applicationRoutes.routesView = viewsRoute;
    
    const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/viewsBase'));
    this.applicationExpress.use(this.applicationRoutes.routesView, routerRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      viewsHandler(new ViewRequest(baseReq, baseRes));
      baseNext();
    });

    for (let i = 0; i < viewsPaths.length; i++) {
      const cdnCreate = require(Path.join(this.applicationDirectory, '/routes/', `views${viewsPaths[i]}`));
      this.applicationExpress.use(`${this.applicationRoutes.routesView}/${viewsPaths[i].toLowerCase()}`, cdnCreate(Express.Router()));
    }
  }

  /**
   * Set up the CDN route handler.
   * @param {String} cdnRoute Route at the base of all requests.
   * @param {Array.<String>} cdnPaths Routes to register.
   * @param {Function} cdnHandler Middleware for routes.
   */
  cdn (cdnRoute, cdnPaths, cdnHandler) {
    this.applicationRoutes.routesCdn = cdnRoute;
    
    const resRoutes = require(Path.join(this.applicationDirectory, '/routes/cdnBase'));
    this.applicationExpress.use(this.applicationRoutes.routesCdn, resRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      cdnHandler(new CdnRequest(baseReq, baseRes));
      baseNext();
    });

    for (let i = 0; i < cdnPaths.length; i++) {
      const cdnCreate = require(Path.join(this.applicationDirectory, '/routes/', `cdn${cdnPaths[i]}`));
      this.applicationExpress.use(`${this.applicationRoutes.routesCdn}/${cdnPaths[i].toLowerCase()}`, cdnCreate(Express.Router()));
    }
  }

  /**
   * Middleware for socket requests.
   * @param socketHandler Custom handler function.
   */
  socket (socketHandler) {
    this.applicationSockets.on('connection', connectedSocket => {
      socketHandler(new SocketRequest(connectedSocket));
    });
  }

  /**
   * Query a socket event handler.
   * @param {String} handleEvent Event name.
   * @returns {*} Event handler.
   */
  handle (handleEvent) {
    return require(this.applicationDirectory + '/events/' + handleEvent);
  }
  
  /**
   * Handle the death of a cluster fork.
   * @param {Function} deathMiddleware Callback.
   */
  death (deathMiddleware) {
    Cluster.on('exit', (clusterWorker, clusterCode, clusterSignal) => {
      deathMiddleware(clusterWorker, clusterCode, clusterSignal);
      Cluster.fork();
    });
  }

}

module.exports = Application;