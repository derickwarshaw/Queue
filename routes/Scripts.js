const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (roomReq, roomRes) {
        "use strict";
        
        roomRes.send("You are on the base route for /cdn/scripts/");
      })
      .get('/:scriptName', function (scriptReq, scriptRes) {
        
        File.readFile(`./public/scripts/${scriptReq.params.scriptName}`)
            .then(readFile => scriptRes.send(readFile))
            .catch(unreadReason => scriptRes.send(unreadReason.message));
      })
  
};