# تعليمات التركيب على link-get.net/chatbot

## الخطوة 1: قاعدة البيانات
1. ادخل على cPanel
2. اذهب إلى MySQL Database Wizard
3. أنشئ قاعدة بيانات جديدة (مثال: linkget_chat)
4. أنشئ مستخدم جديد (مثال: linkget_user)
5. أعطِ المستخدم كل الصلاحيات على القاعدة
6. اذهب إلى phpMyAdmin
7. اختر قاعدة البيانات
8. اضغط Import
9. اختر ملف database/schema.sql
10. اضغط Go

## الخطوة 2: رفع Backend
1. افتح cPanel → File Manager
2. اذهب إلى مجلد Home (اطلع من public_html)
3. أنشئ مجلد جديد باسم: chat-api
4. ادخل مجلد chat-api
5. اضغط Upload
6. ارفع ملفات مجلد backend/ هنا
   - server.js
   - package.json
   - .env
   - config/
   - models/
   - routes/
   - middleware/
7. عدل ملف .env:
   DB_NAME=linkget_chat
   DB_USER=linkget_user
   DB_PASSWORD=الباسورد_اللي_حطيته
   JWT_SECRET=اكتب_اي_كلام_عشوائي_طويل

## الخطوة 3: تشغيل Node.js
1. cPanel → Setup Node.js App
2. اضغط Create Application
3. املأ الحقول:
   - Node.js version: 18.x
   - Application mode: Production
   - Application root: chat-api
   - Application URL: link-get.net/chatbot
   - Application startup file: server.js
4. اضغط Create
5. اضغط Run NPM Install
6. انتظر حتى ينتهي
7. اضغط Start App

## الخطوة 4: رفع Frontend
1. من جهازك افتح Terminal
2. cd frontend
3. npm install
4. npm run build
5. سينشأ مجلد build/
6. ارفع محتوى build/ إلى public_html/chatbot/

## الخطوة 5: رفع Widget
1. ارفع widget/chat-widget.js إلى public_html/chatbot/widget/

## الخطوة 6: اختبار
افتح: https://link-get.net/chatbot
يجب أن يعمل!

## كود الويدجت للعملاء
```html
<script src="https://link-get.net/chatbot/widget/chat-widget.js?userId=YOUR_USER_ID"></script>
```
