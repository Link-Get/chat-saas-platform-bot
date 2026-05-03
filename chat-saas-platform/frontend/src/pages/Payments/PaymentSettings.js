import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Smartphone, Building, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    vodafone_cash: { enabled: true, account_number: '', account_name: '', instructions: 'أرسل المبلغ عبر فودافون كاش ثم ارفع الإيصال' },
    instapay: { enabled: true, account_number: '', account_name: '', instructions: 'أرسل المبلغ عبر إنستا باي ثم ارفع الإيصال' }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (user?.role === 'admin') fetchSettings(); }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/payments/admin-settings');
      const data = {};
      res.data.forEach(s => {
        data[s.method] = { enabled: s.enabled, account_number: s.account_number, account_name: s.account_name, instructions: s.instructions };
      });
      setSettings(data);
    } catch { }
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/payments/local-settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success('تم حفظ الإعدادات');
    } catch { toast.error('خطأ في الحفظ'); }
  };

  const handleChange = (method, field, value) => {
    setSettings(prev => ({ ...prev, [method]: { ...prev[method], [field]: value } }));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">هذه الصفحة متاحة للمشرف فقط</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الدفع المحلي</h1>
        <p className="text-gray-500 mt-1">قم بإدخال بيانات حساباتك المحلية لاستقبال المدفوعات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg"><Smartphone className="w-6 h-6 text-red-600" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">فودافون كاش</h2><p className="text-sm text-gray-500">إعدادات محفظة فودافون كاش</p></div>
          </div>
          <div className="space-y-4">
            <div><label className="label">رقم المحفظة</label><input type="text" value={settings.vodafone_cash.account_number} onChange={(e) => handleChange('vodafone_cash', 'account_number', e.target.value)} placeholder="01xxxxxxxxx" className="input-field" /></div>
            <div><label className="label">اسم صاحب المحفظة</label><input type="text" value={settings.vodafone_cash.account_name} onChange={(e) => handleChange('vodafone_cash', 'account_name', e.target.value)} placeholder="الاسم كما يظهر" className="input-field" /></div>
            <div><label className="label">تعليمات للعميل</label><textarea value={settings.vodafone_cash.instructions} onChange={(e) => handleChange('vodafone_cash', 'instructions', e.target.value)} rows={3} className="input-field" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={settings.vodafone_cash.enabled} onChange={(e) => handleChange('vodafone_cash', 'enabled', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><label className="text-sm text-gray-700">تفعيل فودافون كاش</label></div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg"><Building className="w-6 h-6 text-blue-600" /></div>
            <div><h2 className="text-lg font-bold text-gray-900">إنستا باي</h2><p className="text-sm text-gray-500">إعدادات حساب إنستا باي</p></div>
          </div>
          <div className="space-y-4">
            <div><label className="label">رقم الحساب / الموبايل المسجل</label><input type="text" value={settings.instapay.account_number} onChange={(e) => handleChange('instapay', 'account_number', e.target.value)} placeholder="01xxxxxxxxx" className="input-field" /></div>
            <div><label className="label">اسم صاحب الحساب</label><input type="text" value={settings.instapay.account_name} onChange={(e) => handleChange('instapay', 'account_name', e.target.value)} placeholder="الاسم كما يظهر" className="input-field" /></div>
            <div><label className="label">تعليمات للعميل</label><textarea value={settings.instapay.instructions} onChange={(e) => handleChange('instapay', 'instructions', e.target.value)} rows={3} className="input-field" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={settings.instapay.enabled} onChange={(e) => handleChange('instapay', 'enabled', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><label className="text-sm text-gray-700">تفعيل إنستا باي</label></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> حفظ الإعدادات
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          ✅ تم حفظ الإعدادات بنجاح
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;