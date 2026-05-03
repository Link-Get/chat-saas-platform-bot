const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'الاسم مطلوب' }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: { msg: 'البريد الإلكتروني مستخدم بالفعل' },
    validate: {
      isEmail: { msg: 'بريد إلكتروني غير صالح' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'customer'),
    defaultValue: 'customer'
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  subscription_plan: {
    type: DataTypes.ENUM('free', 'basic', 'pro', 'enterprise'),
    defaultValue: 'free'
  },
  subscription_status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired', 'pending'),
    defaultValue: 'inactive'
  },
  subscription_start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscription_end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscription_payment_method: {
    type: DataTypes.ENUM('stripe', 'paypal', 'vodafone_cash', 'instapay', 'manual'),
    allowNull: true
  },
  widget_color: {
    type: DataTypes.STRING(50),
    defaultValue: '#0084ff'
  },
  widget_position: {
    type: DataTypes.ENUM('right', 'left'),
    defaultValue: 'right'
  },
  widget_welcome_message: {
    type: DataTypes.TEXT,
    defaultValue: 'مرحباً! كيف يمكننا مساعدتك؟'
  },
  widget_logo: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
