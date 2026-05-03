const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'agent'),
    defaultValue: 'agent'
  },
  departments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  max_concurrent_chats: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  current_chats: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  }
}, {
  tableName: 'agents'
});

module.exports = Agent;
