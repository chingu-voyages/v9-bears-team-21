'use strict';
export default (sequelize, DataTypes) => {
  const Schools = sequelize.define('Schools', {
    school_uid:{ 
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    school_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    admin_uid: {
      allowNull: false,
      type:DataTypes.UUID,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address_line_1: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address_line_2: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    country: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    postal_code: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    city: {
      allowNull: true,
      type: DataTypes.STRING,
    }
  },{});
  Schools.associate = function(models) {
    // associations can be defined here
    Schools.hasMany(models.Users, {
      foreignKey: 'school_uid',
      onDelete: 'CASCADE'
    }),
    Schools.hasMany(models.Results, {
      foreignKey: 'school_uid',
      onDelete: 'CASCADE'
    })
  };
  return Schools;
};