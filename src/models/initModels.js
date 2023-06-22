const Repairs = require('../models/repairs.model');
const Users = require('./users.model');

const initModel = () => {
  Users.hasMany(Repairs, { foreignKey: 'userId' });
  Repairs.belongsTo(Users, { foreignKey: 'userId' });
};

module.exports = initModel;
