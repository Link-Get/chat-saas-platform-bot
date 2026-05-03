import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث..."
            className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="hidden md:flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user?.subscription_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user?.subscription_plan === 'free' ? 'مجاني' : user?.subscription_plan}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;