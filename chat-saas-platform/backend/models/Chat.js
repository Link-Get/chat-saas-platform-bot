const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chat = sequelize.define('Chat', {
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
  visitor_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  visitor_name: {
    type: DataTypes.STRING(255),
    defaultValue: 'زائر'
  },
  visitor_email: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  visitor_phone: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  visitor_ip: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  visitor_country: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  visitor_browser: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  visitor_page: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'pending'),
    defaultValue: 'active'
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'agents',
      key: 'id'
    }
  },
  rating_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  rating_comment: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'chats'
});

module.exports = Chat;
