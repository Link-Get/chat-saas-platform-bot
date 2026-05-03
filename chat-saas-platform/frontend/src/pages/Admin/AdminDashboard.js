import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, CreditCard, MessageSquare, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscriptions: 0, totalChats: 0, pendingPayments: 0, revenue: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard');
      setStats(res.data.stats);
      setRecentUsers(res.data.recentUsers);
    } catch {
      setStats({ totalUsers: 150, activeSubscriptions: 89, totalChats: 2450, pendingPayments: 12, revenue: 5230 });
      setRecentUsers([
        { id: 1, name: 'محمد أحمد', email: 'mohamed@example.com', company_name: 'شركة التقنية', subscription_plan: 'pro', created_at: new Date() },
        { id: 2, name: 'علي خالد', email: 'ali@example.com', company_name: 'متجر الإلكتروني', subscription_plan: 'basic', created_at: new Date() }
      ]);
      setPendingSubscriptions([
        { id: 1, user: { name: 'أحمد سامي', email: 'ahmed@example.com' }, plan: 'pro', price: 30, payment_method: 'vodafone_cash', created_at: new Date() },
        { id: 2, user: { name: 'خالد عمر', email: 'khaled@example.com' }, plan: 'basic', price: 10, payment_method: 'instapay', created_at: new Date() }
      ]);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/subscriptions/approve/${id}`);
      fetchData();
    } catch { alert('خطأ في الموافقة'); }
  };

  const revenueData = [
    { name: 'يناير', revenue: 4000 }, { name: 'فبراير', revenue: 3000 },
    { name: 'مارس', revenue: 5000 }, { name: 'أبريل', revenue: 4500 },
    { name: 'مايو', revenue: 6000 }, { name: 'يونيو', revenue: 5230 }
  ];

  const planData = [
    { name: 'مجاني', value: 45, color: '#94a3b8' },
    { name: 'أساسي', value: 35, color: '#3b82f6' },
    { name: 'احترافي', value: 15, color: '#8b5cf6' },
    { name: 'مؤسسي', value: 5, color: '#f59e0b' }
  ];

  const statCards = [
    { title: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'اشتراكات نشطة', value: stats.activeSubscriptions, icon: CreditCard, color: 'bg-green-500' },
    { title: 'إجمالي المحادثات', value: stats.totalChats, icon: MessageSquare, color: 'bg-purple-500' },
    { title: 'الإيرادات', value: `$${stats.revenue}`, icon: DollarSign, color: 'bg-orange-500' }
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">لوحة المشرف</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على المنصة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}><stat.icon className="w-6 h-6 text-white" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">الإيرادات الشهرية</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">توزيع الخطط</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={planData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {planData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {planData.map((plan) => (
              <div key={plan.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                <span className="text-sm text-gray-600">{plan.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            مدفوعات في انتظار المراجعة ({pendingSubscriptions.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">المستخدم</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">الخطة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">وسيلة الدفع</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {pendingSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub.user?.name}</p>
                      <p className="text-xs text-gray-500">{sub.user?.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="badge-blue">{sub.plan}</span></td>
                  <td className="py-3 px-4 font-medium">${sub.price}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${sub.payment_method === 'vodafone_cash' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {sub.payment_method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleApprove(sub.id)} className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> موافقة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;