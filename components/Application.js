const HTTP = require('http');
const Path = require('path');
const Express = require('express');
const Socket = require('socket.io');
const Handlebars = require('express-handlebars');
const Translation = require('../components/Translation');

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
    this.applicationApi = '/api';
    this.applicationSockets = new Map();
  
    this.applicationExpress = Express();
    this.applicationHttp = HTTP.createServer(this.applicationExpress);
    this.applicationSockets = Socket.listen(this.applicationHttp);
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
   * Middleware for express web requests.
   * @param {Function} middleHandler Custom handler function.
   */
  middle (middleHandler) {
    this.applicationExpress.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      Translation.webRequest(req, res).then(requestInstance => {
        middleHandler(requestInstance);
        next();
      });
    });
  }

  
  
  /**
   * Set the base route.
   * @param baseRoute
   */
  base (baseRoute) {
    // TODO: Turn this into a map of Routes?
    this.applicationApi = baseRoute;
    // TODO: Path.join this.
    const routerRoutes = require(this.applicationDirectory + '/routes/Base');
    this.applicationExpress.use(this.applicationApi, routerRoutes(Express.Router()));
  }

  /**
   * Creates a route for the server.
   * @param {String} routeName Name of the route to establish.
   */
  api (routeName) {
    // TODO: Path.join this.
    const routerRoutes = require(this.applicationDirectory + '/routes/' + routeName);
    this.applicationExpress.use(`${this.applicationApi}/${routeName.toLowerCase()}/`, routerRoutes(Express.Router()));
  }

  
  
  /**
   * Set the foundation for view routes.
   * @param {String} foundRoute Base route for the views.
   */
  display (foundRoute) {
    // TODO: Turn this into a map of Routes?
    this.applicationFound = foundRoute;
    // TODO: Path.join this.
    const routerRoutes = require(this.applicationDirectory + '/routes/Display');
    this.applicationExpress.use(this.applicationFound, routerRoutes(Express.Router()));
  }

  /**
   * Add a set of views routes.
   * @param {String} viewName Name to query.
   */
  view (viewName) {
    const viewRoutes = require(Path.join(this.applicationDirectory, '/routes/', viewName));
    this.applicationExpress.use(`${this.applicationFound}/${viewName.toLowerCase()}`, viewRoutes(Express.Router()));
  }
  

  
  resources (resRoute) {
    // TODO: Turn this into a map of Routes?
    this.applicationResources = resRoute;
    const resRoutes = require(Path.join(this.applicationDirectory, '/routes/Resources'));
    this.applicationExpress.use(this.applicationResources, resRoutes(Express.Router()), function (apiReq, apiRes, apiNext) {
      if (apiReq.originalUrl.includes("scripts")) {
        apiRes.contentType("text/javascript");
      } else if (apiReq.originalUrl.includes("stylesheets")) {
        apiRes.contentType("text/css");
      }
      
      apiNext();
    });
  }
  
  cdn (cdnRoute) {
    const cdnRoutes = require(Path.join(this.applicationDirectory, '/routes/', cdnRoute));
    this.applicationExpress.use(`${this.applicationResources}/${cdnRoute.toLowerCase()}`, cdnRoutes(Express.Router()));
  }

  
  
  
  /**
   * Middleware for the render process.
   * @param {Object} renderRequest Request object.
   * @param {Object} renderResolute Resolve object.
   * @returns {Function} Renderer.
   */
  render (renderRequest, renderResolute) {
    return function (renderTemplate, renderContext) {
      return new Promise(function (renderResolve, renderReject) {
        renderResolute.render(renderTemplate, renderContext, function (renderError, renderResult) {
          if (!renderError) {
            renderResolve(renderResult);
          } else {
            renderReject(renderError);
          }
        })
      })
    }
  }

  /**
   * Starts the server request listener.
   */
  listen () {
    this.applicationHttp.listen(this.applicationPort);
    console.log(`Server is listening on ${this.applicationPort}.`)
  }

  /**
   * Middleware for socket requests.
   * @param socketHandler Custom handler function.
   */
  socket (socketHandler) {
    this.applicationSockets.on('connection', connectedSocket => {
      Translation.socketRequest(connectedSocket).then(socketHandler);
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
   * Retreive a server custom component.
   * @param {String} componentName Name of the custom component.
   * @returns {*} ?
   */
  component (componentName) {
    switch (componentName) {
      case "Identify":
        return require('uuid');
      case "Sql":
        return require('sqlite-async');
      case "Queue":
        return require('promise-queue');
      default:
        return require(this.applicationDirectory + '/components/' + componentName);
    }
  }

}

module.exports = Application;