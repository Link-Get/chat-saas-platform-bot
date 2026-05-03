import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Users, TrendingUp, Clock, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalChats: 156, activeChats: 8, totalAgents: 5, onlineAgents: 3,
    avgResponseTime: '2.5 دقيقة', satisfaction: '94%', todayVisitors: 45
  });

  const chartData = [
    { name: 'السبت', chats: 12 }, { name: 'الأحد', chats: 19 },
    { name: 'الإثنين', chats: 15 }, { name: 'الثلاثاء', chats: 25 },
    { name: 'الأربعاء', chats: 22 }, { name: 'الخميس', chats: 30 },
    { name: 'الجمعة', chats: 18 }
  ];

  const statCards = [
    { title: 'إجمالي المحادثات', value: stats.totalChats, icon: MessageSquare, color: 'bg-blue-500', trend: '+12%', up: true },
    { title: 'محادثات نشطة', value: stats.activeChats, icon: Clock, color: 'bg-green-500', trend: '+3', up: true },
    { title: 'وكلاء متصلين', value: `${stats.onlineAgents}/${stats.totalAgents}`, icon: Users, color: 'bg-purple-500', trend: 'نشط', up: true },
    { title: 'معدل الرضا', value: stats.satisfaction, icon: TrendingUp, color: 'bg-orange-500', trend: '+5%', up: true }
  ];

  const recentChats = [
    { id: 1, visitor: 'زائر #1001', country: 'مصر', status: 'active', agent: 'أحمد محمد', time: 'منذ 5 دقائق' },
    { id: 2, visitor: 'زائر #1002', country: 'السعودية', status: 'active', agent: 'محمد علي', time: 'منذ 12 دقيقة' },
    { id: 3, visitor: 'زائر #1003', country: 'الإمارات', status: 'pending', agent: '-', time: 'منذ 20 دقيقة' },
    { id: 4, visitor: 'زائر #1004', country: 'مصر', status: 'closed', agent: 'أحمد محمد', time: 'منذ ساعة' },
    { id: 5, visitor: 'زائر #1005', country: 'الكويت', status: 'active', agent: 'خالد عمر', time: 'منذ ساعتين' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 mt-1">مرحباً بك، {user?.name}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
          user?.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {user?.subscription_plan === 'free' ? 'الخطة المجانية' : `خطة ${user?.subscription_plan}`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.up ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                  <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-xl shadow-sm`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-6">إحصائيات المحادثات</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">المحادثات الأخيرة</h2>
          <div className="space-y-4">
            {recentChats.map((chat) => (
              <div key={chat.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className={`w-2.5 h-2.5 rounded-full ${chat.status === 'active' ? 'bg-green-500' : chat.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{chat.visitor}</p>
                  <p className="text-xs text-gray-500">{chat.country} • {chat.agent}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;