const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LocalPaymentSetting = sequelize.define('LocalPaymentSetting', {
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
    type: DataTypes.STRING(50),
    allowNull: true
  },
  account_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  display_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'local_payment_settings'
});

module.exports = LocalPaymentSetting;