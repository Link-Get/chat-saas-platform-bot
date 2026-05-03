const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PaymentSettings = sequelize.define('PaymentSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  method: {
    type: DataTypes.ENUM('vodafone_cash', 'instapay'),
    allowNull: false,
    unique: true
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  account_number: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  account_name: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  instructions: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'payment_settings'
});

module.exports = PaymentSettings;
