const API = require('../components/API');

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