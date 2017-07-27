const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (roomReq, roomRes) {
        "use strict";
        // TODO: Figure a way to show all views by view routes available.
        
        roomRes.send("You are on the base route for /v/");
      });
  
};