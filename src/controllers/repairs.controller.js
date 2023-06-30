const Repair = require('../models/repairs.model');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/users.model');


//obtenemos las reparaciones
exports.findRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    where: { status: ['pending', 'completed'] },
    attributes: {
      exclude: ['status'],
    },
    include: [
      {
        model: Users,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: repairs.length,
    repairs,
  });
});

//creamos una nueva reparacion
exports.createRepair = catchAsync(async (req, res, next) => {
  //traemos informacion del req.body
  const { date, motorsNumber, description } = req.body;
  const { id } = req.sessionUser;

  //se crea utilizando el modelo
  const repair = await Repair.create({
    date,
    motorsNumber: motorsNumber.toLowerCase(),
    description,
    userId: id,
  });

  //enviamos la respuesta
  res.status(201).json({
    message: 'The repair has been created',
    repair,
  });
});

exports.findRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const oneRepair = await Repair.findOne({
    where: {
      id,
      status: 'pending',
    },
  });

  //validar si repairs existe, si no enviar error 404
  if (!oneRepair) {
    return res.status(404).json({
      status: 'error',
      message: `The repair with id: ${id} not found!`,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'repair found',
    oneRepair,
  });
});

exports.updateRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  const updatedRepair = await repair.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'Repair updated',
    repair: updatedRepair,
  });
});

exports.deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  //actualizamos el status
  await repair.update({ status: 'cancelled' });

  //procedo a enviar la informacion con exito
  res.status(200).json({
    status: 'success',
    message: `The repair with id:${repair.id} has been deleted`,
  });
});
