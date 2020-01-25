const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'development.sqlite3'
});

module.exports = sequelize;
