const Sequelize = require('sequelize');

const sequelize = require('../database');

class PlanningApplication extends Sequelize.Model {}
PlanningApplication.init({
  planningApplicationId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  addressText: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
}, {
  sequelize,
  modelName: 'planningApplication'
});

module.exports = PlanningApplication;
