const express = require('express');

//controllers
const repairsController = require('../controllers/repairs.controller');

// middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const repairMiddleware = require('../middlewares/repair.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();


// routes
router
  .route('/')
  .get(authMiddleware.protect, authMiddleware.restrictTo('employee'), repairsController.findRepairs)
  .post(validationMiddleware.createRepairValidation, authMiddleware.protect, repairsController.createRepair);

router
  .use(authMiddleware.protect)
  .use(authMiddleware.restrictTo('employee'))
  .use('/:id', repairMiddleware.validRepair)
  .route('/:id')
  .get(repairsController.findRepair)
  .patch(authMiddleware.protectAccountOwner, repairsController.updateRepair)
  .delete(authMiddleware.protectAccountOwner, repairsController.deleteRepair);

module.exports = router;
