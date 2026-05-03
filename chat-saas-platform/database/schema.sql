-- قاعدة بيانات منصة الدردشة الحية
-- Chat SaaS Platform Database Schema

CREATE DATABASE IF NOT EXISTS chat_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chat_saas;

-- جدول المستخدمين
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    company_name VARCHAR(255),
    phone VARCHAR(50),
    avatar VARCHAR(500) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    subscription_plan ENUM('free', 'basic', 'pro', 'enterprise') DEFAULT 'free',
    subscription_status ENUM('active', 'inactive', 'expired', 'pending') DEFAULT 'inactive',
    subscription_start_date DATETIME,
    subscription_end_date DATETIME,
    subscription_payment_method ENUM('stripe', 'paypal', 'vodafone_cash', 'instapay', 'manual') DEFAULT NULL,
    widget_color VARCHAR(50) DEFAULT '#0084ff',
    widget_position ENUM('right', 'left') DEFAULT 'right',
    widget_welcome_message TEXT DEFAULT 'مرحباً! كيف يمكننا مساعدتك؟',
    widget_logo VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_subscription_status (subscription_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الاشتراكات
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan ENUM('free', 'basic', 'pro', 'enterprise') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status ENUM('active', 'inactive', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    payment_method ENUM('stripe', 'paypal', 'vodafone_cash', 'instapay', 'manual') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_proof VARCHAR(500) DEFAULT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    max_agents INT DEFAULT 1,
    max_chats INT DEFAULT 100,
    storage_gb DECIMAL(5, 2) DEFAULT 1.00,
    custom_domain BOOLEAN DEFAULT FALSE,
    analytics BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الوكلاء
CREATE TABLE agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'agent') DEFAULT 'agent',
    departments JSON,
    is_online BOOLEAN DEFAULT FALSE,
    max_concurrent_chats INT DEFAULT 3,
    current_chats INT DEFAULT 0,
    avatar VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_is_online (is_online)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المحادثات
CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    visitor_id VARCHAR(255) NOT NULL,
    visitor_name VARCHAR(255) DEFAULT 'زائر',
    visitor_email VARCHAR(255) DEFAULT '',
    visitor_phone VARCHAR(50) DEFAULT '',
    visitor_ip VARCHAR(100) DEFAULT '',
    visitor_country VARCHAR(100) DEFAULT '',
    visitor_browser VARCHAR(255) DEFAULT '',
    visitor_page VARCHAR(500) DEFAULT '',
    status ENUM('active', 'closed', 'pending') DEFAULT 'active',
    agent_id INT DEFAULT NULL,
    rating_score INT DEFAULT NULL,
    rating_comment TEXT DEFAULT '',
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_visitor_id (visitor_id),
    INDEX idx_status (status),
    INDEX idx_agent_id (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الرسائل
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    sender ENUM('visitor', 'agent', 'system') NOT NULL,
    sender_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
    file_url VARCHAR(500) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_chat_id (chat_id),
    INDEX idx_sender (sender),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول إعدادات الدفع المحلي
CREATE TABLE payment_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method ENUM('vodafone_cash', 'instapay') NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    account_number VARCHAR(255) DEFAULT '',
    account_name VARCHAR(255) DEFAULT '',
    instructions TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_method (method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الإعدادات العامة
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدراج بيانات افتراضية
INSERT INTO users (name, email, password, role, company_name, subscription_plan, subscription_status) VALUES
('المشرف', 'admin@chat-saas.com', '$2a$10$YourHashedPasswordHere', 'admin', 'Chat SaaS', 'enterprise', 'active');

INSERT INTO payment_settings (method, enabled, account_number, account_name, instructions) VALUES
('vodafone_cash', TRUE, '', '', 'أرسل المبلغ عبر فودافون كاش ثم ارفع الإيصال'),
('instapay', TRUE, '', '', 'أرسل المبلغ عبر إنستا باي ثم ارفع الإيصال');
