const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chats',
      key: 'id'
    }
  },
  sender: {
    type: DataTypes.ENUM('visitor', 'agent', 'system'),
    allowNull: false
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'file', 'system'),
    defaultValue: 'text'
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'messages'
});

module.exports = Message;
