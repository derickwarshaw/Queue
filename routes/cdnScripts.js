const {File} = require('wrappa-core');

module.exports = scriptsRouter => {
  "use strict";
  
  const scriptsBase = '/';
  const scriptsName = '/:scriptName';
  
  scriptsRouter.get(scriptsBase, function (scriptsReq, scriptsRes) {
    File.readDirectory('./public/scripts')
        .then(scriptsDirectory => scriptsRes.render('Root', {
          rootHeader: 'Queue CDN: .js',
          rootItem: scriptsDirectory.map(directoryItem => {
            return {itemName: directoryItem, itemRoot: '/cdn/scripts'};
          })
        }))
        .catch(error => scriptsRes.send(error.message));
  });
  
  scriptsRouter.get(scriptsName, function (scriptsReq, scriptsRes) {
    File.readFile(`./public/scripts/${scriptsReq.params.scriptName}`)
        .then(readFile => scriptsRes.send(readFile))
        .catch(error => scriptsRes.send(error.message));
  });

  
  return scriptsRouter;
  
};