import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Palette, Type, Image, Code, Copy, Check, RefreshCw, MessageSquare } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WidgetSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    widget_color: '#0084ff',
    widget_position: 'right',
    widget_welcome_message: 'مرحباً! كيف يمكننا مساعدتك؟',
    widget_logo: ''
  });
  const [widgetCode, setWidgetCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchSettings(); generateCode(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/widgets/settings');
      setSettings(res.data);
    } catch { }
  };

  const generateCode = async () => {
    try {
      const res = await axios.get('/api/widgets/code');
      setWidgetCode(res.data.code);
    } catch {
      setWidgetCode(`<!-- كود الدردشة الحية -->\n<script src="YOUR_DOMAIN/widget/chat-widget.js?userId=${user?.id}"></script>`);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/widgets/settings', settings);
      toast.success('تم حفظ الإعدادات');
      generateCode();
    } catch { toast.error('خطأ في الحفظ'); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('تم نسخ الكود');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الويدجت</h1>
        <p className="text-gray-500 mt-1">خصص مظهر ويدجت الدردشة الخاص بك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" /> المظهر
          </h2>

          <div>
            <label className="label">لون الويدجت</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.widget_color} onChange={(e) => setSettings({...settings, widget_color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
              <input type="text" value={settings.widget_color} onChange={(e) => setSettings({...settings, widget_color: e.target.value})} className="input-field w-32" />
            </div>
          </div>

          <div>
            <label className="label">موضع الويدجت</label>
            <div className="flex gap-3">
              {['right', 'left'].map((pos) => (
                <button key={pos} onClick={() => setSettings({...settings, widget_position: pos})} className={`flex-1 py-3 rounded-lg border-2 transition ${settings.widget_position === pos ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                  {pos === 'right' ? 'اليمين' : 'اليسار'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2"><Type className="w-4 h-4" /> رسالة الترحيب</label>
            <textarea value={settings.widget_welcome_message} onChange={(e) => setSettings({...settings, widget_welcome_message: e.target.value})} rows={3} className="input-field" />
          </div>

          <div>
            <label className="label flex items-center gap-2"><Image className="w-4 h-4" /> شعار الويدجت (URL)</label>
            <input type="url" value={settings.widget_logo} onChange={(e) => setSettings({...settings, widget_logo: e.target.value})} className="input-field" placeholder="https://example.com/logo.png" />
          </div>

          <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> حفظ الإعدادات
          </button>
        </div>

        <div className="card space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" /> كود التضمين
          </h2>
          <p className="text-sm text-gray-600">انسخ هذا الكود والصقه في موقعك قبل إغلاق وسم &lt;/body&gt;</p>
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all font-mono">
              {widgetCode}
            </pre>
            <button onClick={copyCode} className="absolute top-2 left-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">معاينة الويدجت</h3>
            <div className="bg-white rounded-lg p-6 relative h-64 border border-gray-200">
              <div className={`absolute bottom-4 ${settings.widget_position === 'right' ? 'right-4' : 'left-4'}`}>
                <div className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: settings.widget_color }}>
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettings;