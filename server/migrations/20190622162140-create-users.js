'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      user_uid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      first_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      school_uid:{
        allowNull: true,
        type:Sequelize.INTEGER,
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATE
      },
      year_of_graduation: {
        allowNull: true,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone_number: {
        allowNull: true,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
