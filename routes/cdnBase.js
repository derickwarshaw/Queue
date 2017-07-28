const API = require('../components/File');

module.exports = cdnRouter => {
  "use strict";
  
  const cdnBase = '/';
  
  cdnRouter.get(cdnBase, function (cdnReq, cdnRes) {
    File.readDirectory('./public')
        .then(publicDirectory => cdnRes.render('Root', {
          rootHeader: 'Queue CDN',
          rootItem: publicDirectory.map(directoryItem => {
            return {itemName: directoryItem, itemRoot: '/cdn'};
          })
        }))
        .catch(error => cdnRes.send(error.message));
  })
  
  return cdnRouter;
  
};