import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Shield, UserCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', role: 'agent' });

  useEffect(() => { fetchAgents(); }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get('/api/agents');
      setAgents(res.data);
    } catch {
      setAgents([
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'admin', is_online: true, current_chats: 2 },
        { id: 2, name: 'محمد علي', email: 'mohamed@example.com', role: 'agent', is_online: true, current_chats: 1 },
        { id: 3, name: 'خالد عمر', email: 'khaled@example.com', role: 'agent', is_online: false, current_chats: 0 }
      ]);
    }
  };

  const handleAddAgent = async () => {
    try {
      await axios.post('/api/agents', newAgent);
      toast.success('تم إضافة الوكيل بنجاح');
      setShowAddModal(false);
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'خطأ في إضافة الوكيل');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الوكيل؟')) return;
    try {
      await axios.delete(`/api/agents/${id}`);
      toast.success('تم الحذف بنجاح');
      fetchAgents();
    } catch { toast.error('خطأ في الحذف'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الوكلاء</h1>
          <p className="text-gray-500 mt-1">إدارة فريق الدعم الخاص بك</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> إضافة وكيل
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${agent.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{agent.role === 'admin' ? 'مشرف' : 'وكيل'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{agent.current_chats} محادثة حالية</span>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center gap-1">
                <Edit2 className="w-4 h-4" /> تعديل
              </button>
              <button onClick={() => handleDelete(agent.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition">
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إضافة وكيل جديد</h2>
            <div className="space-y-4">
              <div>
                <label className="label">الاسم الكامل</label>
                <input type="text" value={newAgent.name} onChange={(e) => setNewAgent({...newAgent, name: e.target.value})} className="input-field" placeholder="محمد أحمد" />
              </div>
              <div>
                <label className="label">البريد الإلكتروني</label>
                <input type="email" value={newAgent.email} onChange={(e) => setNewAgent({...newAgent, email: e.target.value})} className="input-field" placeholder="agent@example.com" />
              </div>
              <div>
                <label className="label">الدور</label>
                <select value={newAgent.role} onChange={(e) => setNewAgent({...newAgent, role: e.target.value})} className="input-field">
                  <option value="agent">وكيل</option>
                  <option value="admin">مشرف</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">إلغاء</button>
              <button onClick={handleAddAgent} className="flex-1 btn-primary">إضافة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;