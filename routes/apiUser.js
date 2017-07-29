const API = require('../components/API');

module.exports = userRouter => {
  "use strict";
  
  const userBase = '/';
  const userById = '/id/:userId';
  const userByDistinctor = '/distinctor/:userDistinctor';
  const userByName = '/name/:userName';
  const userByClient = '/client/:userClient';
  
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


  userRouter.get(userById, function (userReq, userRes) {
    API.getUserById(userReq.params.userId)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.patch(userById, function (userReq, userRes) {
    API.patchUserById(userReq.params.userId, userReq.body)
        .then(patched => userRes.json(patched))
        .catch(error => userRes.send(error.message));
  });
  userRouter.delete(userById, function (userReq, userRes) {
    API.deleteUserById(userReq.params.userId)
        .then(success => userRes.sendStatus(200))
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


  userRouter.get(userByName, function (userReq, userRes) {
    API.getUserByName(userReq.params.userName)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.patch(userByName, function (userReq, userRes) {
    API.patchUserByName(userReq.params.userName, userReq.body)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.delete(userByName, function (userReq, userRes) {
    API.deleteUserByName(userReq.params.userName)
        .then(success => userRes.sendStatus(200))
        .catch(error => userRes.send(error.message));
  });


  userRouter.get(userByClient, function (userReq, userRes) {
    API.getUserByClient(userReq.params.userClient)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.patch(userByClient, function (userReq, userRes) {
    API.patchUserByClient(userReq.params.userClient, userReq.body)
        .then(user => userRes.json(user))
        .catch(error => userRes.send(error.message));
  });
  userRouter.delete(userByClient, function (userReq, userRes) {
    API.deleteUserByClient(userReq.params.userClient)
        .then(success => userRes.sendStatus(200))
        .catch(error => userRes.send(error.message));
  });


  return userRouter;

};
