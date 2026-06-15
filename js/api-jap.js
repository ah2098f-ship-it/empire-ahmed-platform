// ========== ربط JAP API ==========
class JAPAPIManager {
    constructor(apiKey, apiUrl) {
        this.apiKey = apiKey; // 290d9da4b0e8dbff9dca9173a2c2f6cf
        this.apiUrl = apiUrl || 'https://api.example.com/v2';
        this.encryptKey();
    }

    // تشفير المفتاح
    encryptKey() {
        // استخدم تشفير حقيقي في الإنتاج
        this.encryptedKey = btoa(this.apiKey);
    }

    // جلب الخدمات من JAP
    async fetchServices() {
        try {
            // في الواقع:
            // const response = await fetch(`${this.apiUrl}/services`, {
            //     headers: { 'Authorization': `Bearer ${this.apiKey}` }
            // });
            // return await response.json();
            
            // للتطوير:
            return this.mockServices();
        } catch (error) {
            console.error('��طأ في جلب الخدمات:', error);
            return [];
        }
    }

    // إنشاء طلب جديد
    async createOrder(orderData) {
        try {
            // const response = await fetch(`${this.apiUrl}/orders`, {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${this.apiKey}`,
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(orderData)
            // });
            // return await response.json();
            
            return {
                success: true,
                orderId: 'ORD-' + Date.now(),
                message: 'تم إنشاء الطلب بنجاح'
            };
        } catch (error) {
            console.error('خطأ في إنشاء الطلب:', error);
            return { success: false, error: error.message };
        }
    }

    // التحقق من حالة الطلب
    async checkOrderStatus(orderId) {
        try {
            // const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
            //     headers: { 'Authorization': `Bearer ${this.apiKey}` }
            // });
            // return await response.json();
            
            return {
                orderId,
                status: 'processing',
                progress: 45,
                message: 'جاري المعالجة'
            };
        } catch (error) {
            console.error('خطأ في التحقق من الحالة:', error);
            return null;
        }
    }

    // إلغاء الطلب
    async cancelOrder(orderId) {
        try {
            // const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
            //     method: 'DELETE',
            //     headers: { 'Authorization': `Bearer ${this.apiKey}` }
            // });
            // return await response.json();
            
            return {
                success: true,
                message: 'تم إلغاء الطلب بنجاح',
                refundAmount: 50000
            };
        } catch (error) {
            console.error('خطأ في إلغاء الطلب:', error);
            return { success: false };
        }
    }

    // الخدمات الوهمية للاختبار
    mockServices() {
        return [
            { id: 1, name: 'متابعين تيليجرام', price: 500, platform: 'telegram' },
            { id: 2, name: 'لايكات إنستجرام', price: 1000, platform: 'instagram' },
            { id: 3, name: 'مشاهدات تيك توك', price: 750, platform: 'tiktok' },
            // ...
        ];
    }

    // معالجة الأخطاء والإعادة
    async retryRequest(fn, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
}

// ========== التكامل مع الموقع ==========
const japAPI = new JAPAPIManager('290d9da4b0e8dbff9dca9173a2c2f6cf');

// تصدير
window.JAPAPIManager = JAPAPIManager;
window.japAPI = japAPI;
