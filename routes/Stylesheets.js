const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (roomReq, roomRes) {
        "use strict";
        
        roomRes.send("You are on the base route for /cdn/stylesheets");
      })
      .get('/:stylesheetName', function (stylesheetReq, stylesheetRes) {
        
        File.readFile(`./public/stylesheets/${stylesheetReq.params.stylesheetName}`)
            .then(readFile => stylesheetRes.send(readFile))
            .catch(unreadReason => stylesheetRes.send(unreadReason.message));
      });
  
};