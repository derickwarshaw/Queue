const {File} = require('wrappa-core');

module.exports = stylesheetRouter => {
  "use strict";
  
  const stylesheetBase = '/';
  const stylesheetName = '/:stylesheetName';
  
  stylesheetRouter.get(stylesheetBase, function (stylesheetReq, stylesheetRes) {
    File.readDirectory('./public/stylesheets')
        .then(stylesheetsDirectory => stylesheetRes.render('Root', {
          rootHeader: 'Queue CDN: .css',
          rootItem: stylesheetsDirectory.map(directoryItem => {
            return {itemName: directoryItem, itemRoot: '/cdn/stylesheets'};
          })
        }))
        .catch(error => stylesheetRes.send(error.message));
  });
  
  stylesheetRouter.get(stylesheetName, function (stylesheetReq, stylesheetRes) {
    File.readFile(`./public/stylesheets/${stylesheetReq.params.stylesheetName}`)
        .then(readFile => stylesheetRes.send(readFile))
        .catch(unreadReason => stylesheetRes.send(unreadReason.message));
  });
  
  
  return stylesheetRouter;
  
};