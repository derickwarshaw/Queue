/**
 * Created by Joshua Crowe on 30/06/2017.
 */

const http = require('http');
const Express = require('express');
const Socket = require('socket.io');
const Mustache = require('express-mustache');
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
    this.applicationRequests = new Map();

    this.applicationExpress = Express();
    this.applicationHttp = http.createServer(this.applicationExpress);
    this.applicationSockets = Socket.listen(this.applicationHttp);

    this.applicationExpress.use(Express.static(
       this.applicationDirectory + '/public'
    ));
    this.applicationExpress.engine('mustache', Mustache.create());
    this.applicationExpress.set('view engine', 'mustache');
    this.applicationExpress.set('views', `.\\public\\views`);
  }

  /**
   * Middleware for express web requests.
   * @param {String} middleHandler Custom handler function.
   */
  middle (middleHandler) {
    const currentApplication = this;

    this.applicationExpress.use(function (req, res, next) {
      Translation.webRequest(req, res).then(requestInstance => {
        currentApplication.applicationRequests.set((new Date).getTime(), requestInstance);
        middleHandler(requestInstance);
        next();
      });
    });
  }

  /**
   * Creates a route for the server.
   * @param {String} routePath Path to accept as route.
   * @returns {Route} Express route.
   */
  route (routePath) {
    return this.applicationExpress.route(routePath);
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
   *
   * @param handleEvent
   * @returns {*}
   */
  handle (handleEvent) {
    return require(this.applicationDirectory + '/events/' + handleEvent);
  }

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