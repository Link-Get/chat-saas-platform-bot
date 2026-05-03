# منصة الدردشة الحية - Chat SaaS Platform

## 🚀 نظرة عامة
منصة SaaS متكاملة لخدمة العملاء عبر الدردشة الحية مع نظام اشتراكات ودفع محلي.

## 📁 هيكل المشروع
```
chat-saas-platform/
├── backend/          # Node.js + Express + MySQL
├── frontend/         # React + Tailwind CSS
├── widget/           # ويدجت الدردشة القابل للتضمين
└── database/         # ملفات SQL
```

## ⚙️ متطلبات التشغيل
- Node.js >= 16
- MySQL >= 5.7
- npm أو yarn

## 🛠️ خطوات التثبيت

### 1. قاعدة البيانات
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# عدل ملف .env بإعداداتك
npm install
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## 🔧 إعدادات الإنتاج

### Backend
- عدل `DB_HOST` ليشير إلى قاعدة بيانات الإنتاج
- عدل `JWT_SECRET` إلى مفتاح قوي وعشوائي
- فعّل HTTPS

### Frontend
```bash
cd frontend
npm run build
# ارفع مجلد build/ على الاستضافة
```

## 💳 وسائل الدفع
- **فودافون كاش**: يدوي (رفع إيصال)
- **إنستا باي**: يدوي (رفع إيصال)
- **Stripe**: تكامل آلي (يتطلب إعداد مفاتيح)
- **PayPal**: تكامل آلي (يتطلب إعداد مفاتيح)

## 📄 الترخيص
MIT License
