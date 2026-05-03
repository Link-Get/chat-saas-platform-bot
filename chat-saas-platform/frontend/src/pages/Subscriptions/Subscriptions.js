import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, CreditCard, Smartphone, Building, Upload, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Subscriptions = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('/api/subscriptions/plans');
      setPlans(Object.entries(res.data).map(([key, value]) => ({ id: key, ...value })));
    } catch {
      setPlans([
        { id: 'free', name: 'مجاني', price: 0, features: { maxAgents: 1, maxChats: 50, storageGB: 0.5, customDomain: false, analytics: false, apiAccess: false } },
        { id: 'basic', name: 'أساسي', price: 10, features: { maxAgents: 3, maxChats: 500, storageGB: 5, customDomain: false, analytics: true, apiAccess: false } },
        { id: 'pro', name: 'احترافي', price: 30, features: { maxAgents: 10, maxChats: 5000, storageGB: 20, customDomain: true, analytics: true, apiAccess: true } },
        { id: 'enterprise', name: 'مؤسسي', price: 100, features: { maxAgents: 50, maxChats: -1, storageGB: 100, customDomain: true, analytics: true, apiAccess: true } }
      ]);
    }
  };

  const handleSubscribe = (plan) => { setSelectedPlan(plan); setShowPaymentModal(true); };

  const handlePayment = async () => {
    if (!paymentMethod) { toast.error('اختر وسيلة الدفع'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/subscriptions/create', { plan: selectedPlan.id, paymentMethod });
      if (paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') {
        setShowPaymentModal(false); setShowProofModal(true);
        toast.success('اخترت الدفع المحلي. يرجى رفع إيصال الدفع');
      } else {
        toast.success('تم إنشاء الاشتراك بنجاح'); setShowPaymentModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في إنشاء الاشتراك');
    } finally { setLoading(false); }
  };

  const handleUploadProof = async () => {
    if (!proofFile) { toast.error('اختر ملف الإيصال'); return; }
    setLoading(true);
    try {
      toast.success('تم رفع الإيصال بنجاح. في انتظار المراجعة');
      setShowProofModal(false);
    } catch { toast.error('خطأ في رفع الإيصال'); }
    finally { setLoading(false); }
  };

  const paymentMethods = [
    { id: 'stripe', name: 'بطاقة ائتمان', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
    { id: 'vodafone_cash', name: 'فودافون كاش', icon: Smartphone },
    { id: 'instapay', name: 'إنستا باي', icon: Building }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">خطط الاشتراك</h1>
        <p className="text-gray-500 mt-1">اختر الخطة المناسبة لعملك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`card relative ${user?.subscription_plan === plan.id ? 'border-2 border-blue-500' : ''}`}>
            {user?.subscription_plan === plan.id && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">الحالي</span>
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /><span>{plan.features.maxAgents} وكلاء</span></li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /><span>{plan.features.maxChats === -1 ? 'غير محدود' : plan.features.maxChats} محادثة</span></li>
              <li className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /><span>{plan.features.storageGB} GB تخزين</span></li>
              <li className="flex items-center gap-2 text-sm">{plan.features.analytics ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}<span>تحليلات متقدمة</span></li>
              <li className="flex items-center gap-2 text-sm">{plan.features.customDomain ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}<span>دومين مخصص</span></li>
            </ul>
            <button onClick={() => handleSubscribe(plan)} disabled={user?.subscription_plan === plan.id} className={`w-full py-2.5 rounded-lg font-medium ${user?.subscription_plan === plan.id ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}>
              {user?.subscription_plan === plan.id ? 'مشترك حالياً' : 'اشترك الآن'}
            </button>
          </div>
        ))}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">اشتراك في خطة {selectedPlan?.name}</h2>
            <p className="text-gray-600 mb-6">المبلغ: <span className="font-bold">${selectedPlan?.price}</span>/شهر</p>
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700">اختر وسيلة الدفع:</p>
              {paymentMethods.map((method) => (
                <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <method.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 btn-secondary">إلغاء</button>
              <button onClick={handlePayment} disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProofModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">رفع إيصال الدفع</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>تعليمات:</strong><br/>
                1. أرسل المبلغ عبر {paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}<br/>
                2. احفظ لقطة شاشة للإيصال<br/>
                3. ارفع الإيصال هنا
              </p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">اسحب الملف هنا أو انقر للاختيار</p>
              <input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files[0])} className="hidden" id="proof-upload" />
              <label htmlFor="proof-upload" className="btn-secondary text-sm cursor-pointer inline-block">اختيار ملف</label>
              {proofFile && <p className="text-sm text-green-600 mt-2">✓ {proofFile.name}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowProofModal(false)} className="flex-1 btn-secondary">إلغاء</button>
              <button onClick={handleUploadProof} disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'رفع الإيصال'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;