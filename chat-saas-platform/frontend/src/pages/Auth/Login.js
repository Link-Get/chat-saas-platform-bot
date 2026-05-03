import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('جميع الحقول مطلوبة'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في تسجيل الدخول');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
          <p className="text-gray-500 mt-2">أهلاً بك في منصة الدردشة الحية</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="example@email.com" required />
            </div>
            <div>
              <label className="label">كلمة المرور</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">سجل الآن</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;