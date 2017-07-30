const API = require('../components/API');

module.exports = integrityRouter => {

  const integrityBase = '/';
  const integrityGenericUsers = '/generic/user';

  const integrityIntegralUsers = '/integral/user';
  const integrityIntegralUsersByRoom = '/integral/user/room/:integralRoom';

  const integrityExtrinsicUsers = '/extrinsic/user';
  const integrityExtrinsicUsersByRoom = '/extrinsic/user/room/:extrinsicRoom';

  integrityRouter.get(integrityGenericUsers, function (genericReq, genericRes) {
    API.getGenericUsers()
       .then(users => genericRes.json(users))
       .catch(reason => genericRes.send(reason.message));
  });

  integrityRouter.get(integrityIntegralUsers, function (integralReq, integralRes) {
    API.getIntegralUsers()
       .then(users => integralRes.json(users))
       .catch(reason => integralRes.send(reason.message));
  });
  integrityRouter.get(integrityIntegralUsersByRoom, function (integralReq, integralRes) {
    API.getIntegralUsersByRoom(integralReq.params.integralRoom)
       .then(users => integralRes.json(users))
       .catch(reason => integralRes.send(reason.message));
  });

  integrityRouter.get(integrityExtrinsicUsers, function (extrinsicReq, extrinsicRes) {
    API.getExtrinsicUsers()
       .then(users => extrinsicRes.json(users))
       .catch(reason => extrinsicRes.send(reason.message));
  });
  integrityRouter.get(integrityExtrinsicUsersByRoom, function (extrinsicReq, extrinsicRes) {
    API.getExtrinsicUsersByRoom(extrinsicReq.params.extrinsicRoom)
       .then(users => extrinsicRes.json(users))
       .catch(reason => extrinsicRes.send(reason.message));
  });

  return integrityRouter;

};