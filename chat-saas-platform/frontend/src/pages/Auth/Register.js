import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) { toast.error('جميع الحقول المطلوبة يجب ملؤها'); return; }
    if (formData.password.length < 6) { toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setLoading(true);
    try {
      await register(formData);
      toast.success('تم إنشاء الحساب بنجاح');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في إنشاء الحساب');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء حساب</h1>
          <p className="text-gray-500 mt-2">ابدأ رحلتك مع منصة الدردشة الحية</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">الاسم الكامل *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="محمد أحمد" required />
            </div>
            <div>
              <label className="label">البريد الإلكتروني *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="example@email.com" required />
            </div>
            <div>
              <label className="label">اسم الشركة</label>
              <input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="input-field" placeholder="شركتك" />
            </div>
            <div>
              <label className="label">رقم الهاتف</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field" placeholder="01xxxxxxxx" />
            </div>
            <div>
              <label className="label">كلمة المرور *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-field pl-12" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;