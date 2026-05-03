const { sequelize } = require('../config/database');
const User = require('./User');
const Subscription = require('./Subscription');
const Chat = require('./Chat');
const Message = require('./Message');
const Agent = require('./Agent');
const PaymentSettings = require('./PaymentSettings');

// تعريف العلاقات
User.hasMany(Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Agent, { foreignKey: 'owner_id', as: 'agents' });
Agent.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Chat, { foreignKey: 'user_id', as: 'chats' });
Chat.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

Chat.belongsTo(Agent, { foreignKey: 'agent_id', as: 'agent' });
Agent.hasMany(Chat, { foreignKey: 'agent_id', as: 'chats' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ تم مزامنة قاعدة البيانات');
  } catch (error) {
    console.error('❌ خطأ في المزامنة:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Subscription,
  Chat,
  Message,
  Agent,
  PaymentSettings,
  syncDatabase
};
