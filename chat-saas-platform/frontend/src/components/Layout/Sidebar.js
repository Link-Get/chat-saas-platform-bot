import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, MessageSquare, Users, CreditCard,
  Settings, Shield, LogOut, X, ChevronLeft
} from 'lucide-react';

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { path: '/chats', icon: MessageSquare, label: 'المحادثات' },
    { path: '/agents', icon: Users, label: 'الوكلاء' },
    { path: '/subscriptions', icon: CreditCard, label: 'الاشتراكات' },
    { path: '/widget', icon: Settings, label: 'إعدادات الويدجت' },
  ];

  const adminItems = [
    { path: '/payments', icon: CreditCard, label: 'إعدادات الدفع' },
    { path: '/admin', icon: Shield, label: 'لوحة المشرف' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Chat SaaS</h1>
              <p className="text-xs text-gray-500">منصة الدردشة</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="px-4 text-xs font-medium text-gray-400 uppercase mb-2">المشرف</p>
                {adminItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;