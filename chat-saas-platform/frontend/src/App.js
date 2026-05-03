import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Chats from './pages/Chats/Chats';
import Agents from './pages/Agents/Agents';
import Subscriptions from './pages/Subscriptions/Subscriptions';
import WidgetSettings from './pages/Widget/WidgetSettings';
import PaymentSettings from './pages/Payments/PaymentSettings';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-left" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="chats" element={<Chats />} />
            <Route path="agents" element={<Agents />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="widget" element={<WidgetSettings />} />
            <Route path="payments" element={<PaymentSettings />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;