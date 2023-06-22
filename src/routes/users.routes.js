const express = require('express');

//controllers
const usersController = require('../controllers/users.controller');

// middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const usersMiddleware = require('../middlewares/users.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router
  .route('/')
  .get(authMiddleware.protect, usersController.findAllUsers)
  .post(validationMiddleware.createUserValidation, usersController.createUser);

router.post('/login', validationMiddleware.loginUserValidation, usersController.login);

router.use(authMiddleware.protect);

router
  .route('/:id')
  .get(usersMiddleware.validUser, usersController.findOneUser)
  .patch(usersMiddleware.validUser, usersController.updateUser)
  .delete(usersMiddleware.validUser, usersController.deleteUser);

module.exports = router;
