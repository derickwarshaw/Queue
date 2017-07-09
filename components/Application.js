/**
 * Created by Joshua Crowe on 30/06/2017.
 */

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
    this.applicationSockets = new Map();

    this.applicationExpress = Express();
    this.applicationHttp = HTTP.createServer(this.applicationExpress);
    this.applicationSockets = Socket.listen(this.applicationHttp);
    this.applicationExpress.use(Express.static(Path.join(this.applicationDirectory, '/public')));
    this.applicationEngine = Handlebars.create({
      defaultLayout: 'main'
    });
    // TODO: Find a way to set the root directory of views to files/views.
    this.applicationExpress.engine('hbs', this.applicationEngine.engine);
    this.applicationExpress.set('view engine', 'hbs');
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
   * Creates a route for the server.
   * @param {String} routeName Name of the route to establish.
   */
  route (routeName) {
    const routerRoutes = require(this.applicationDirectory + '/routes/' + routeName);
    this.applicationExpress.use(`/api/${routeName.toLowerCase()}/`, routerRoutes(Express.Router()));
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