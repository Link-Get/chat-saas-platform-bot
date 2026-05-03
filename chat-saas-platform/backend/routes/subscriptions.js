const express = require('express');
const router = express.Router();
const { Subscription, User } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

// خطط الاشتراك
const plans = {
  free: {
    name: 'مجاني',
    price: 0,
    features: {
      maxAgents: 1,
      maxChats: 50,
      storageGB: 0.5,
      customDomain: false,
      analytics: false,
      apiAccess: false
    }
  },
  basic: {
    name: 'أساسي',
    price: 10,
    features: {
      maxAgents: 3,
      maxChats: 500,
      storageGB: 5,
      customDomain: false,
      analytics: true,
      apiAccess: false
    }
  },
  pro: {
    name: 'احترافي',
    price: 30,
    features: {
      maxAgents: 10,
      maxChats: 5000,
      storageGB: 20,
      customDomain: true,
      analytics: true,
      apiAccess: true
    }
  },
  enterprise: {
    name: 'مؤسسي',
    price: 100,
    features: {
      maxAgents: 50,
      maxChats: -1,
      storageGB: 100,
      customDomain: true,
      analytics: true,
      apiAccess: true
    }
  }
};

// @route   GET /api/subscriptions/plans
// @desc    الحصول على الخطط المتاحة
// @access  Public
router.get('/plans', (req, res) => {
  res.json(plans);
});

// @route   POST /api/subscriptions/create
// @desc    إنشاء اشتراك جديد
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { plan, paymentMethod } = req.body;

    if (!plans[plan]) {
      return res.status(400).json({ message: 'خطة غير صالحة' });
    }

    const planData = plans[plan];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await Subscription.create({
      user_id: req.user.id,
      plan,
      price: planData.price,
      payment_method: paymentMethod,
      end_date: endDate,
      max_agents: planData.features.maxAgents,
      max_chats: planData.features.maxChats,
      storage_gb: planData.features.storageGB,
      custom_domain: planData.features.customDomain,
      analytics: planData.features.analytics,
      api_access: planData.features.apiAccess,
      status: (paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') ? 'pending' : 'active'
    });

    // تحديث المستخدم
    await User.update({
      subscription_plan: plan,
      subscription_status: subscription.status,
      subscription_start_date: new Date(),
      subscription_end_date: endDate,
      subscription_payment_method: paymentMethod
    }, { where: { id: req.user.id } });

    res.status(201).json({
      subscription,
      paymentInstructions: getPaymentInstructions(paymentMethod, planData.price)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/subscriptions/upload-proof/:id
// @desc    رفع إيصال الدفع
// @access  Private
router.post('/upload-proof/:id', protect, async (req, res) => {
  try {
    const { proofUrl } = req.body;

    const subscription = await Subscription.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'الاشتراك غير موجود' });
    }

    await subscription.update({
      payment_proof: proofUrl,
      payment_status: 'pending'
    });

    res.json({ 
      message: 'تم رفع إيصال الدفع بنجاح، في انتظار المراجعة',
      subscription 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/subscriptions/approve/:id
// @desc    الموافقة على الدفع (للمشرف)
// @access  Private/Admin
router.post('/approve/:id', protect, adminOnly, async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'الاشتراك غير موجود' });
    }

    await subscription.update({
      status: 'active',
      payment_status: 'completed'
    });

    await User.update({
      subscription_status: 'active'
    }, { where: { id: subscription.user_id } });

    res.json({ message: 'تم تفعيل الاشتراك بنجاح', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/subscriptions/my-subscriptions
// @desc    اشتراكات المستخدم
// @access  Private
router.get('/my-subscriptions', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/subscriptions/all
// @desc    جميع الاشتراكات (للمشرف)
// @access  Private/Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'company_name']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// دالة مساعدة
function getPaymentInstructions(method, amount) {
  const instructions = {
    vodafone_cash: {
      title: 'فودافون كاش',
      steps: [
        'افتح تطبيق فودافون كاش',
        `أرسل المبلغ ${amount}$ إلى الرقم: [سيتم إرساله لك]`,
        'احفظ لقطة شاشة للإيصال',
        'ارفع الإيصال في الأسفل'
      ],
      note: 'سيتم تفعيل اشتراكك خلال 24 ساعة بعد التحقق'
    },
    instapay: {
      title: 'إنستا باي',
      steps: [
        'افتح تطبيق إنستا باي',
        `أرسل المبلغ ${amount}$ إلى الرقم: [سيتم إرساله لك]`,
        'احفظ لقطة شاشة للإيصال',
        'ارفع الإيصال في الأسفل'
      ],
      note: 'سيتم تفعيل اشتراكك خلال 24 ساعة بعد التحقق'
    },
    stripe: {
      title: 'بطاقة ائتمان',
      steps: ['سيتم تحويلك لصفحة الدفع الآمنة'],
      redirect: true
    },
    paypal: {
      title: 'PayPal',
      steps: ['سيتم تحويلك لصفحة PayPal'],
      redirect: true
    }
  };
  return instructions[method] || null;
}

module.exports = router;
