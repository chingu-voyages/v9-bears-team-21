'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Results', {
      result_uid: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID
      },
      user_uid: {
        allowNull: false,
        type: Sequelize.UUID
      },
      school_uid: {
        allowNull: false,
        type: Sequelize.UUID
      },
      year: {
        allowNull: false,
        type: Sequelize.STRING
      },
      term: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subject: {
        allowNull: false,
        type: Sequelize.STRING
      },
      exam: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mark: {
        allowNull: false,
        type: Sequelize.STRING
      },
      grade: {
        allowNull: false,
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
    return queryInterface.dropTable('Results');
  }
};