const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (stylesheetReq, stylesheetRes) {
        "use strict";

        File.readDirectory('./public/stylesheets').then(scriptsFound => stylesheetRes.render('Root', {
          rootHeader: 'CDN - Stylesheets',
          rootItem: scriptsFound.map(scriptFound => {
            return {itemName: scriptFound, itemRoot: '/cdn/stylesheets'};
          })
        }));
      })
      .get('/:stylesheetName', function (stylesheetReq, stylesheetRes) {
        
        File.readFile(`./public/stylesheets/${stylesheetReq.params.stylesheetName}`)
            .then(readFile => stylesheetRes.send(readFile))
            .catch(unreadReason => stylesheetRes.send(unreadReason.message));
      });
  
};