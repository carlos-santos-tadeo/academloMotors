const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'available' },
  });

  res.json({
    results: users.length,
    status: 'success',
    users,
  });
});

//creamos un usuario
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(404).json({
      status: 'error',
      message: `There is already a user with this email: ${email}`,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //traemos informacion de la req.body
  const { email, password } = req.body;

  //buscamos y revisamos si existe usuario
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError(`User with email:${email} not found`, 404));
  }

  // validar si es correcta la contraseña
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Wrong email or password`, 401));
  }

  //se genera el token
  const token = await generateJWT(user.id);

  //enviamos respuesta
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//obtenemos un usuario por su id
exports.findOneUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  //buscamos y revisamos si existe usuario
  const oneUser = await User.findOne({
    where: {
      id,
      status: 'available',
    },
  });

  if (!oneUser) {
    return res.status(404).json({
      status: 'error',
      message: `User with id: ${id} not found!`,
    });
  }

  //enviamos respuesta
  return res.status(200).json({
    status: 'success',
    message: 'User found',
    oneUser,
  });
});

//actualizamos usuario
exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  //traemos info del req.body
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({
    status: 'success',
    message: `The user with id:${user.id} updated`,
  });
});

//eliminamos usuario
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: `User with id:${user.id} been deleted`,
  });
});
