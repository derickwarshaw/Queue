const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (scriptsReq, scriptsRes) {
        "use strict";
        
        File.readDirectory('./public/scripts').then(scriptsFound => scriptsRes.render('Root', {
          rootHeader: 'Scripts Available',
          rootItem: scriptsFound.map(scriptFound => {
            return {itemName: scriptFound, itemRoot: '/cdn/scripts'};
          })
        }));
      })
      .get('/:scriptName', function (scriptReq, scriptRes) {
        
        File.readFile(`./public/scripts/${scriptReq.params.scriptName}`)
            .then(readFile => scriptRes.send(readFile))
            .catch(unreadReason => scriptRes.send(unreadReason.message));
      });
  
};