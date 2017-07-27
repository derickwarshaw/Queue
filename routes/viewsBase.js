const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = routerInstance => {
  "use strict";
  
  return routerInstance
      .get('/', function (roomReq, roomRes) {
        "use strict";
        
        roomRes.render('Root', {
          rootHeader: 'Views',
          rootItem: [{itemName: 'board', itemRoot: '/v'}]
        });
      });
  
};