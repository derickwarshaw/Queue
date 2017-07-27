const currentApplication = require('../queue').currentApplication;
const File = currentApplication.component('File');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (cdnReq, cdnRes) {
        "use strict";

        File.readDirectory('./public').then(publicDirectory => cdnRes.render('Root', {
          rootHeader: 'CDN',
          rootItem: publicDirectory.map(publicItem => {
            return {itemName: publicItem, itemRoot: '/cdn'};
          })
        }));
      });
  
};