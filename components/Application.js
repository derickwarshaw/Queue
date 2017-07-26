const HTTP = require('http');
const Path = require('path');
const Express = require('express');
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
    this.applicationHttp = HTTP.createServer(this.applicationExpress);
    this.applicationSockets = Socket.listen(this.applicationHttp);
    
    // Express Setup.
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

  
  
  // TODO: JSdoc.
  apiBase (baseRoute, baseHandler) {
      this.applicationRoutes.routesApi = baseRoute;
      
      const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/Base'));
      this.applicationExpress.use(this.applicationRoutes.routesApi, routerRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
        baseHandler(new ApiRequest(baseReq, baseRes));
        baseNext();
      });
  }

  /**
   * Creates a route for the server.
   * @param {String} routeName Name of the route to establish.
   */
  apiRoute (routeName) {
    const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/', routeName));
    this.applicationExpress.use(`${this.applicationRoutes.routesApi}/${routeName.toLowerCase()}/`, routerRoutes(Express.Router()));
  }

  
  
  // TODO: JSDoc.
  viewBase (baseRoute, baseHandler) {
    this.applicationRoutes.routesView = baseRoute;

    const routerRoutes = require(Path.join(this.applicationDirectory, '/routes/Display'));
    this.applicationExpress.use(this.applicationRoutes.routesApi, routerRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      baseHandler(new ViewRequest(baseReq, baseRes));
      baseNext();
    });
  }

  /**
   * Add a set of views routes.
   * @param {String} viewName Name to query.
   */
  viewRoute (viewName) {
    const viewRoutes = require(Path.join(this.applicationDirectory, '/routes/', viewName));
    this.applicationExpress.use(`${this.applicationRoutes.routesView}/${viewName.toLowerCase()}`, viewRoutes(Express.Router()));
  }
  

  // TODO: JSDoc.
  cdnBase (baseRoute, baseHandler) {
    this.applicationRoutes.routesCdn = baseRoute;
    
    const resRoutes = require(Path.join(this.applicationDirectory, '/routes/Resources'));
    this.applicationExpress.use(this.applicationRoutes.routesCdn, resRoutes(Express.Router()), function (baseReq, baseRes, baseNext) {
      baseHandler(new CdnRequest(baseReq, baseRes));
      baseNext();
    });
  }
  
  // TODO: JSdoc.
  cdnRoute (cdnRoute) {
    const cdnRoutes = require(Path.join(this.applicationDirectory, '/routes/', cdnRoute));
    this.applicationExpress.use(`${this.applicationRoutes.routesCdn}/${cdnRoute.toLowerCase()}`, cdnRoutes(Express.Router()));
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