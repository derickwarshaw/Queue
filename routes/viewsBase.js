const currentApplication = require('../queue').currentApplication;
const API = currentApplication.component('API');

module.exports = viewsRouter => {
  "use strict";
  
  const viewsBase = '/';
  
  viewsRouter.get(viewsBase, function (viewsReq, viewsRes) {
    viewsRes.render('Root', {rootHeader: 'Queue Views'}, {
      rootItem: [{itemName: 'board', itemRoot: '/v'}]
    });
  });
  
  return viewsRouter;
  
};