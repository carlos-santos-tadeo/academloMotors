const express = require("express");

const repairsController = require("./../controllers/repairs.controller");

const router = express.Router();

//Rutas que no requieren id
router
  .route("/")
  .get(repairsController.findRepairs)
  .post(repairsController.createRepair);
//Rutas que necesitan de un id
router
  .route("/:id")
  .get(repairsController.findRepair)
  .patch(repairsController.updateRepair)
  .delete(repairsController.deleteRepair);

module.exports = router;
