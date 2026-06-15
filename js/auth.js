// ========== إدارة المستخدم والتوثيق ==========
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('user'));
    }

    // تسجيل مستخدم جديد
    register(userData) {
        const hashedPassword = this.hashPassword(userData.password);
        const newUser = {
            id: Date.now(),
            ...userData,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            balance: 0,
            tier: 'bronze',
            verified: false
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return newUser;
    }

    // تسجيل الدخول
    login(email, password) {
        const hashedPassword = this.hashPassword(password);
        const user = this.users.find(u => u.email === email);
        
        if (user && user.password === hashedPassword) {
            this.currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, error: 'بريد أو كلمة مرور خاطئة' };
    }

    // تشفير كلمة المرور
    hashPassword(password) {
        // في الواقع، استخدم bcrypt في الخادم
        return btoa(password); // Base64 للتطوير فقط
    }

    // تسجيل الخروج
    logout() {
        this.currentUser = null;
        localStorage.removeItem('user');
    }

    // الحصول على المستخدم الحالي
    getCurrentUser() {
        return this.currentUser;
    }
}

// ========== إدارة الطلبات ==========
class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
    }

    // إنشاء طلب جديد
    createOrder(orderData) {
        const newOrder = {
            id: 'ORD-' + Date.now(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            progress: 0
        };
        
        this.orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(this.orders));
        return newOrder;
    }

    // الحصول على جميع الطلبات
    getAllOrders(userId) {
        return this.orders.filter(o => o.userId === userId);
    }

    // إلغاء الطلب
    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            order.refundAmount = order.totalPrice;
            localStorage.setItem('orders', JSON.stringify(this.orders));
            return true;
        }
        return false;
    }

    // تحديث حالة الطلب
    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            if (status === 'completed') {
                order.progress = 100;
            }
            localStorage.setItem('orders', JSON.stringify(this.orders));
            return true;
        }
        return false;
    }
}

// ========== إدارة المحفظة والأموال ==========
class WalletManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    }

    // إضافة رصيد
    addBalance(userId, amount, method) {
        const transaction = {
            id: 'TXN-' + Date.now(),
            userId,
            type: 'deposit',
            amount,
            method,
            status: 'completed',
            date: new Date().toISOString()
        };
        
        this.transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        return transaction;
    }

    // سحب الأموال
    withdrawBalance(userId, amount, method) {
        const fee = 2500; // رسم السحب
        const netAmount = amount - fee;
        
        if (netAmount <= 0) {
            return { success: false, error: 'المبلغ أقل من الحد الأدنى' };
        }

        const transaction = {
            id: 'WTH-' + Date.now(),
            userId,
            type: 'withdrawal',
            amount,
            fee,
            netAmount,
            method,
            status: 'pending',
            date: new Date().toISOString()
        };
        
        this.transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        return { success: true, transaction };
    }

    // الحصول على رصيد المستخدم
    getUserBalance(userId) {
        let balance = 0;
        this.transactions.forEach(t => {
            if (t.userId === userId && t.status === 'completed') {
                if (t.type === 'deposit') balance += t.amount;
                if (t.type === 'withdrawal') balance -= t.netAmount;
            }
        });
        return balance;
    }

    // الحصول على السجل
    getTransactionHistory(userId) {
        return this.transactions.filter(t => t.userId === userId);
    }
}

// ========== إدارة الخدمات والموردين ==========
class ServiceManager {
    constructor() {
        this.services = [
            {
                id: 1,
                name: 'متابعين تيليجرام',
                platform: 'telegram',
                basePrice: 500,
                type: 'fast',
                warranty: '30 يوم',
                supplier: 'JAP',
                verified: true
            },
            // ... المزيد من الخدمات
        ];
    }

    // البحث عن الخدمات
    searchServices(query) {
        return this.services.filter(s => 
            s.name.includes(query) || s.platform.includes(query)
        );
    }

    // تصفية الخدمات
    filterServices(platform, type) {
        return this.services.filter(s => {
            if (platform && s.platform !== platform) return false;
            if (type && s.type !== type) return false;
            return true;
        });
    }

    // حساب السعر النهائي
    calculatePrice(basePrice, quantity, userTier) {
        let discount = 0;
        switch(userTier) {
            case 'bronze': discount = 0.05; break;
            case 'silver': discount = 0.10; break;
            case 'gold': discount = 0.15; break;
            case 'imperial': discount = 0.25; break;
        }
        
        const originalPrice = basePrice * quantity;
        const discountAmount = originalPrice * discount;
        const finalPrice = originalPrice - discountAmount;
        
        return {
            originalPrice,
            discount,
            discountAmount,
            finalPrice
        };
    }
}

// ========== البوت الذكي ==========
class SmartBot {
    constructor() {
        this.responses = {
            'كيفية الطلب': 'اذهب لقسم الخدمات واختر الخدمة ثم أدخل البيانات المطلوبة',
            'هل الأموال محمية': 'نعم! جميع المعاملات محمية بتشفير 256-bit',
            'كم مدة السحب': 'السحب يتم خلال 24 ساعة على الأكثر',
            'ما رسوم السحب': 'رسوم السحب 2,500 دينار من كل طلب سحب',
            'هل يوجد ضمان': 'نعم! جميع الخدمات عليها ضمان من 7 أيام إلى مدى الحياة'
        };
    }

    // الرد التلقائي
    getResponse(question) {
        // بحث بسيط
        for (const [key, response] of Object.entries(this.responses)) {
            if (question.includes(key)) {
                return response;
            }
        }
        return 'شكراً على سؤالك! يرجى التواصل مع فريق الدعم للمزيد من المساعدة.';
    }

    // تعلم من التفاعلات
    learnFromInteraction(question, answer) {
        // يمكن تحسين هذا باستخدام ML
        console.log('تعلم من:', question, answer);
    }
}

// ========== التشفير والأمان ==========
class SecurityManager {
    // تشفير البيانات
    static encryptData(data, key) {
        // استخدم مكتبة تشفير حقيقية في الإنتاج
        return btoa(JSON.stringify(data)); // Base64 للتطوير
    }

    // فك تشفير البيانات
    static decryptData(encrypted, key) {
        return JSON.parse(atob(encrypted));
    }

    // التحقق من الهوية
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // كشف الاحتيال
    static detectFraud(order, userHistory) {
        // قواعس بسيطة للكشف
        if (order.amount > userHistory.avgOrder * 5) {
            return { isFraud: true, reason: 'مبلغ غير عادي' };
        }
        return { isFraud: false };
    }

    // تسجيل محاولات الدخول
    static logLoginAttempt(userId, success) {
        console.log({
            userId,
            success,
            timestamp: new Date().toISOString(),
            ip: 'hidden' // في الواقع، احفظ IP حقيقي
        });
    }
}

// ========== إدارة النسخ الاحتياطية ==========
class BackupManager {
    static backupAllData() {
        const backup = {
            users: localStorage.getItem('users'),
            orders: localStorage.getItem('orders'),
            transactions: localStorage.getItem('transactions'),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('backup_' + Date.now(), JSON.stringify(backup));
        return backup;
    }

    static restoreFromBackup(backupKey) {
        const backup = JSON.parse(localStorage.getItem(backupKey));
        if (backup) {
            localStorage.setItem('users', backup.users);
            localStorage.setItem('orders', backup.orders);
            localStorage.setItem('transactions', backup.transactions);
            return true;
        }
        return false;
    }

    static scheduleAutoBackup() {
        // احفظ كل ساعة
        setInterval(() => {
            this.backupAllData();
        }, 3600000);
    }
}

// ========== الإشعارات ==========
class NotificationManager {
    static notify(message, type = 'info') {
        const notification = {
            message,
            type, // success, error, warning, info
            timestamp: new Date().toISOString()
        };
        
        console.log('🔔 إشعار:', notification);
        // يمكن استخدام مكتبة إشعارات مثل Toastr
    }

    static notifyOrderStatus(orderId, status) {
        const messages = {
            'completed': '✅ تم إكمال طلبك بنجاح!',
            'pending': '⏳ طلبك قيد المعالجة...',
            'cancelled': '❌ تم إلغاء الطلب',
            'failed': '⚠️ فشل الطلب'
        };
        
        this.notify(messages[status] || 'تحديث الطلب');
    }

    static notifyWithdrawal(status) {
        const messages = {
            'approved': '✅ تمت الموافقة على طلب السحب!',
            'pending': '⏳ طلب السحب قيد المراجعة...',
            'completed': '💰 تم التحويل بنجاح!'
        };
        
        this.notify(messages[status] || 'تحديث السحب');
    }
}

// ========== التصدير ==========
window.AuthManager = AuthManager;
window.OrderManager = OrderManager;
window.WalletManager = WalletManager;
window.ServiceManager = ServiceManager;
window.SmartBot = SmartBot;
window.SecurityManager = SecurityManager;
window.BackupManager = BackupManager;
window.NotificationManager = NotificationManager;
