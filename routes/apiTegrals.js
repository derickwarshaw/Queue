const API = require('../components/API');

module.exports = routerInstance => {
  "use strict";

  return routerInstance
     .get('/int/:intRoom', function (tegralReq, tegralRes) {

       API.getIntegrals(tegralReq.params.intRoom)
          .then(ints => tegralRes.json(ints))
          .then(reason => tegralRes.send(reason.message));
     })
     .get('/unt/:untRoom', function (tegralReq, tegralRes) {

       API.getUntegrals(tegralReq.params.untRoom)
          .then(ints => tegralRes.json(ints))
          .then(reason => tegralRes.send(reason.message));
     });

};