const Repair = require("../models/repair.model");

exports.findRepairs = async (req, res) => {
  const time = req.requestTime;

  const repairs = await Repair.findAll({
    where: {
      status: "pending",
    },
  });

  return res.json({
    requestTime: time,
    results: repairs.length,
    status: "success",
    message: "Repairs found",
    repairs,
  });
};

exports.updateRepair = async (req, res) => {
  try {
    // 1. TRAERNOS LO QUE VAMOS A ACTUALIZAR
    const { id } = req.params;
    // 2. NOS TRAEMOS DE EL BODY LA INFORMACION QUE VAMOS A ACTUALIZAR
    const {status} = req.body;
    // 3. BUSCAMOS QUE EL STATUS SEA PENDING 
    const repair = await Repair.findOne({
      where: {
        id,
        status: "pending",
      },
    });


    if (!repair) {
      return res.status(404).json({
        status: "error",
        message: `Repair with id: ${id} not found`,
      });
    }
    // 5. PROCEDO A ACTUALIZARLO
    await repair.update({status});

    // 6. ENVIO LA CONFIRMACIÓN DE EXITO 
    res.status(200).json({
      status: "success",
      message: "The repair has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

exports.createRepair = async (req, res) => {
  try {
    // PASO 1: OBTENER INFORMACION A CREAR DE LA REQ.BODY
    const { date, userId } =
      req.body;

    //PASO 2: CREAR EL REPAIRS UTILIZANDO EL MODELO

    const repair = await Repair.create({
      date,
      userId,
    });

    // PASO 3: ENVIAR UNA RESPUESTA AL CLIENTE

    return res.status(201).json({
      message: "The repair has been created!",
      repair,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

exports.findRepair = async (req, res) => {
  try {
    //? 1. NOS TRAEMOS EL ID DE LOS PARAMETROS
    const { id } = req.params; //DESTRUCION DE OBJETOS

    //? 2. BUSCO EL REPAIRS EN LA BASE DE DATOS
    const repair = await Repair.findOne({
      where: {
        // id: id
        id,
        status: "pending",
      },
    });

    //? 3. VALIDAR SI EL REPAIRS EXISTE, SI NO, ENVIAR UN ERROR 404
    if (!repair) {
      return res.status(404).json({
        status: "error",
        message: `The repair with id: ${id} not found!`,
      });
    }

    //? 4. ENVIAR LA RESPUESTA AL CLIENTE
    return res.status(200).json({
      status: "success",
      message: "Repair found",
      repair,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

exports.deleteRepair = async (req, res) => {
  try {
    //! traernos el id de los parametros
    const { id } = req.params;

    //! busco en la bd y verifico si es pending
    const repair = await Repair.findOne({
      where: {
        status: "pending",
        id,
      },
    });
    //! validar si existe 
    if (!repair) {
      return res.status(404).json({
        status: "error",
        message: `Repair with id: ${id} not found!`,
      });
    }
    //! actualizar el status encontrado y actualizar  a unavailable
    await repair.update({ status: "cancelled" }); //eliminacion logica
    //await user.destroy() //eliminacion fisica
    //! enviar respuesta 
    return res.status(200).json({
      status: "success",
      message: "the repair has been deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};