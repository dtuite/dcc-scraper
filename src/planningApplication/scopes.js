const sequelize = require('../database');
const PlanningApplication = require('./model');

module.exports.findAllPlanningApplicationsWithoutDocuments = () => (
  PlanningApplication.findAll({
    // I have to use the singular version of planningApplication here rather than the plural
    // because sequalize starts the query with:
    //   select ... from planningApplications as planningApplication ...
    where: sequelize.literal(`
      NOT EXISTS (
        SELECT 1
        FROM planningApplicationDocuments
        WHERE planningApplicationDocuments.planningApplicationId = planningApplication.id
      )
    `),
  })
);

