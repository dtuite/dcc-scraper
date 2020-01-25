const Sequelize = require('sequelize');

const sequelize = require('../database');
const PlanningApplication = require('../planningApplication/model');

class PlanningApplicationDocument extends Sequelize.Model {}
PlanningApplicationDocument.init({
  documentId: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  ref: {
    type: Sequelize.STRING,
  },
  dateText: {
    type: Sequelize.STRING,
  },
}, {
  sequelize,
  modelName: 'planningApplicationDocument'
});

PlanningApplication.hasOne(PlanningApplicationDocument);

module.exports = PlanningApplicationDocument;
