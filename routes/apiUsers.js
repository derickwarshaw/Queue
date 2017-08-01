const API = require('../components/API');

module.exports = userRouter => {
  "use strict";
  
  const userBase = '/';
  const userByDistinctor = '/:userDistinctor';
  
  userRouter.get(userBase, function (userReq, userRes) {
    API.getUsers()
        .then(users => userRes.json(users))
        .catch(error => userRes.send(error.message));
  });
  userRouter.post(userBase, function (userReq, userRes) {
    API.addUser(userReq.body)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.delete(userBase, function (userReq, userRes) {
    API.deleteUsers()
        .then(users => userRes.sendStatus(200))
        .catch(error => userRes.send(error.message));
  });

  userRouter.get(userByDistinctor, function (userReq, userRes) {
    API.getUserByDistinctor(userReq.params.userDistinctor)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.patch(userByDistinctor, function (userReq, userRes) {
    API.patchUserByDistinctor(userReq.params.userDistinctor, userReq.body)
        .then(success => userRes.json(success))
        .catch(error => userRes.send(error.message));
  });
  userRouter.delete(userByDistinctor, function (userReq, userRes) {
    API.deleteUserByDistinctor(userReq.params.userDistinctor)
        .then(success => userRes.sendStatus(200))
        .catch(error => userRes.send(error.message));
  });

  return userRouter;

};
