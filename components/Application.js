/**
 * Created by Joshua Crowe on 30/06/2017.
 */

const http = require('http');
const Express = require('express');
const Socket = require('socket.io');
const Mustache = require('express-mustache');
const Translation = require('../components/Translation');

// TODO: Add JSDOC descriptions @.
class Application {
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

  route (routePath) {
    return this.applicationExpress.route(routePath);
  }

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

  listen () {
    this.applicationHttp.listen(this.applicationPort);
  }

  socket (socketHandler) {
    this.applicationSockets.on('connection', socketHandler);
  }

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