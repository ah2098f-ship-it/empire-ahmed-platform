// ========== دوال الأساسيات ==========

// تسجيل الدخول
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// التحقق من المستخدم
function checkUserLoggedIn() {
    const user = localStorage.getItem('user');
    if (!user && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
}

// تحديث المعلومات
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = user.firstName || 'مستخدم';
    }
}

// تهيئة الموقع
document.addEventListener('DOMContentLoaded', () => {
    checkUserLoggedIn();
    updateUserInfo();
    setupEventListeners();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // التنقل
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href === '#') {
                e.preventDefault();
            }
        });
    });

    // النموذج
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // معالجة تفويض
        });
    });
}

// تصدير
window.logout = logout;
window.checkUserLoggedIn = checkUserLoggedIn;
window.updateUserInfo = updateUserInfo;
