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
  webReference: {
    type: Sequelize.STRING,
  },
  applicationDate: {
    type: Sequelize.DATEONLY,
  },
  decisionDate: {
    type: Sequelize.DATEONLY,
  },
  registrationDate: {
    type: Sequelize.DATEONLY,
  },
  finalGrantDate: {
    type: Sequelize.DATEONLY,
  },
  lastDateForObservations: {
    type: Sequelize.DATEONLY,
  },
  applicationType: {
    type: Sequelize.STRING,
  },
  proposal: {
    type: Sequelize.STRING,
  },
  applicantName: {
    type: Sequelize.STRING,
  },
  applicantCompany: {
    type: Sequelize.STRING,
  },
  agentName: {
    type: Sequelize.STRING,
  },
  agentCompany: {
    type: Sequelize.STRING,
  },
  agentCompanyAddress: {
    type: Sequelize.STRING,
  },
  caseOfficer: {
    type: Sequelize.STRING,
  },
}, {
  sequelize,
  modelName: 'planningApplication'
});

module.exports = PlanningApplication;
