const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
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
  plan: {
    type: DataTypes.ENUM('free', 'basic', 'pro', 'enterprise'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired', 'cancelled', 'pending'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('stripe', 'paypal', 'vodafone_cash', 'instapay', 'manual'),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  payment_proof: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  max_agents: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  max_chats: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  storage_gb: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1.00
  },
  custom_domain: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  analytics: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  api_access: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'subscriptions'
});

module.exports = Subscription;
