const express = require('express');

const usersController = require('./../controllers/users.controller');

const router = express.Router();

//Rutas que no requieren id
router
  .route('/')
  .get(usersController.findUsers)
  .post(usersController.createUser);
//Rutas que necesitan de un id
router
  .route('/:id')
  .get(usersController.findUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
