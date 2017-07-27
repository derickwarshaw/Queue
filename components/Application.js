const HTTP = require('http');
const Path = require('path');
const Express = require('express');
const BodyParser = require('body-parser');
const Socket = require('socket.io');
const Handlebars = require('express-handlebars');

const WebRequest = require('../types/WebRequest');
const ApiRequest = require('../types/ApiRequest');
const ViewRequest = require('../types/ViewRequest');
const CdnRequest = require('../types/CdnRequest');
const SocketRequest = require('../types/SocketRequest');

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
    this.applicationExpressListener = null;
    this.applicationHttp = HTTP.createServer(this.applicationExpress);
    this.applicationSockets = Socket.listen(this.applicationHttp);
    
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
   * @param {String} baseRoute Route at the base of all requests.
   * @param {Array} basePaths Routes to register.
   * @param {Function} baseHandler Middleware for routes.
   */
  api (baseRoute, basePaths, baseHandler) {
    this.applicationRoutes.routesApi = baseRoute;

    const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/apiBase'));
    this.applicationExpress.use(this.applicationRoutes.routesApi, routerRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      baseHandler(new ApiRequest(baseReq, baseRes));
      baseNext();
    });

    for (let i = 0; i < basePaths.length; i++) {
      const cdnCreate = require(Path.join(this.applicationDirectory, '/routes/', `api${basePaths[i]}`));
      this.applicationExpress.use(`${this.applicationRoutes.routesApi}/${basePaths[i].toLowerCase()}`, cdnCreate(Express.Router()));
    }
  }

  /**
   * Set up the views route handler.
   * @param {String} baseRoute Route at the base of all requests.
   * @param {Array} basePaths Routes to register.
   * @param {Function} baseHandler Middleware for routes.
   */
  views (baseRoute, basePaths, baseHandler) {
    this.applicationRoutes.routesView = baseRoute;
    
    const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/viewsBase'));
    this.applicationExpress.use(this.applicationRoutes.routesView, routerRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      baseHandler(new ViewRequest(baseReq, baseRes));
      baseNext();
    });

    for (let i = 0; i < basePaths.length; i++) {
      const cdnCreate = require(Path.join(this.applicationDirectory, '/routes/', `views${basePaths[i]}`));
      this.applicationExpress.use(`${this.applicationRoutes.routesView}/${basePaths[i].toLowerCase()}`, cdnCreate(Express.Router()));
    }
  }

  /**
   * Set up the CDN route handler.
   * @param {String} baseRoute Route at the base of all requests.
   * @param {Array} basePaths Routes to register.
   * @param {Function} baseHandler Middleware for routes.
   */
  cdn (baseRoute, basePaths, baseHandler) {
    this.applicationRoutes.routesCdn = baseRoute;
    
    const resRoutes = require(Path.join(this.applicationDirectory, '/routes/cdnBase'));
    this.applicationExpress.use(this.applicationRoutes.routesCdn, resRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      baseHandler(new CdnRequest(baseReq, baseRes));
      baseNext();
    });

    for (let i = 0; i < basePaths.length; i++) {
      const cdnCreate = require(Path.join(this.applicationDirectory, '/routes/', `cdn${basePaths[i]}`));
      this.applicationExpress.use(`${this.applicationRoutes.routesCdn}/${basePaths[i].toLowerCase()}`, cdnCreate(Express.Router()));
    }
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
    const listenInstance = this.applicationHttp.listen(process.env.PORT || this.applicationPort, function () {
      console.log(`Server listening on ${listenInstance.address().port}.`);
    });
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