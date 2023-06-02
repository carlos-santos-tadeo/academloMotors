const User = require("../models/user.model");

exports.findUsers = async (req, res) => {
  const time = req.requestTime;

  const users = await User.findAll({
    where: {
      status: "available",
    },
  });

  return res.json({
    requestTime: time,
    results: users.length,
    status: "success",
    message: "Users found",
    users,
  });
};

exports.updateUser = async (req, res) => {
  try {
    // 1. TRAERNOS EL USUARIO QUE VAMOS A ACTUALIZAR
    const { id } = req.params;
    // 2. NOS TRAEMOS DE EL BODY LA INFORMACION QUE VAMOS A ACTUALIZAR
    const {name, email} = req.body;
    // 3. BUSCAMOS EL USUARIO QUE VAMOS A ACTUALIZAR
    const user = await User.findOne({
      where: {
        id,
        status: "available",
      },
    });
    // 4. VALIDAR SI EL USUARIO EXISTE
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `User with id: ${id} not found`,
      });
    }
    // 5. PROCEDO A ACTUALIZARLO
    await user.update({ name, email });

    // 6. ENVIO LA CONFIRMACIÓN DE EXITO AL CLIENTE
    res.status(200).json({
      status: "success",
      message: "The user has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    // PASO 1: OBTENER INFORMACION A CREAR DE LA REQ.BODY
    const { name, email, password, role, status } =
      req.body;

    //PASO 2: CREAR EL USUARIO UTILIZANDO EL MODELO

    const user = await User.create({
      name,
      email, 
      password, 
      role, 
      status,
    });

    // PASO 3: ENVIAR UNA RESPUESTA AL CLIENTE

    return res.status(201).json({
      message: "The user has been created!",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

exports.findUser = async (req, res) => {
  try {
    //? 1. NOS TRAEMOS EL ID DE LOS PARAMETROS
    const { id } = req.params; //DESTRUCION DE OBJETOS

    //? 2. BUSCO EL USUARIO EN LA BASE DE DATOS
    const user = await User.findOne({
      where: {
        // id: id
        id,
        status: "available",
      },
    });

    //? 3. VALIDAR SI EL USUARIO EXISTE, SI NO, ENVIAR UN ERROR 404
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `The user with id: ${id} not found!`,
      });
    }

    //? 4. ENVIAR LA RESPUESTA AL CLIENTE
    return res.status(200).json({
      status: "success",
      message: "User found",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //! traernos el id de los parametros
    const { id } = req.params;
    //! buscar el usuario
    const user = await User.findOne({
      where: {
        status: "available",
        id,
      },
    });
    //! validar si existe el usuario
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `User with id: ${id} not found!`,
      });
    }
    //! actualizar el usuario encontrado y actualizar el status a unavailable
    await user.update({ status: "unavailable" }); //eliminacion logica
    //await user.destroy() //eliminacion fisica
    //! enviar respuesta al cliente
    return res.status(200).json({
      status: "success",
      message: "the user has been deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};