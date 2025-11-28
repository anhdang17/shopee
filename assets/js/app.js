(function(window) {
    const STORAGE_KEYS = {
        USERS: 'shopeeUsers',
        CART: 'shopeeCart',
        SELLER_SESSION: 'shopeeSeller',
        SELLER_PRODUCTS: 'shopeeSellerProducts',
        SELLER_PROMOS: 'shopeeSellerPromotions',
        SELLER_REPORTS: 'shopeeSellerReports',
        FORGOT_TOKENS: 'shopeeForgotTokens',
        INVENTORY: 'shopeeInventory',
        SELLER_ACCOUNTS: 'shopeeSellerAccounts',
        PROMO_ASSIGNMENTS: 'shopeePromoAssignments',
        CHECKOUT_PROFILE: 'shopeeCheckoutProfile'
    };

    const DEFAULT_USERS = [
        {
            id: 'user-demo',
            name: 'Demo Shopper',
            email: 'demo@shopee.vn',
            phone: '0987654321',
            address: 'Hà Nội',
            memberSince: 2020,
            password: 'Demo@1234'
        }
    ];

    const DEFAULT_SELLER_ACCOUNTS = [
        { email: 'seller@shopee.vn', phone: '0911002200', password: 'Seller@123', status: 'active', role: 'seller', name: 'Tech Mall' },
        { email: 'locked@shopee.vn', phone: '0900111222', password: 'Seller@123', status: 'locked', role: 'seller', name: 'Khoá Shop' },
        { email: 'user@shopee.vn', phone: '0999888777', password: 'User@1234', status: 'active', role: 'buyer', name: 'Buyer Account' }
    ];

    const DEFAULT_INVENTORY = {
        '1': { stock: 50, sku: 'SP001' },
        '2': { stock: 30, sku: 'SP002' },
        '3': { stock: 0, sku: 'SP003' },
        '4': { stock: 12, sku: 'SP004' },
        '5': { stock: 6, sku: 'SP005' },
        '6': { stock: 17, sku: 'SP006' },
        '7': { stock: 80, sku: 'SP007' },
        '8': { stock: 24, sku: 'SP008' },
        '9': { stock: 60, sku: 'SP009' },
        '10': { stock: 5, sku: 'SP010' }
    };

    const DEFAULT_SELLER_PRODUCTS = [
        { id: 'sp-s-1', name: 'Thanh Thanh 2000 1m57 46kg 88-62-89', price: 2000000, stock: 50, status: 'active', sku: 'SP001', image: './assets/img/buy/1.PNG', description: 'Mẫu sản phẩm kinh điển' },
        { id: 'sp-s-2', name: 'Hồng Ánh 1998 1m62 48kg 89-64-91', price: 2500000, stock: 30, status: 'active', sku: 'SP002', image: './assets/img/buy/2.PNG', description: 'Phiên bản giới hạn' },
        { id: 'sp-s-3', name: 'Quỳnh Như 1999 1m65 49kg 90-62-89', price: 2800000, stock: 20, status: 'pending', sku: 'SP003', image: './assets/img/buy/3.PNG', description: 'Đang chờ duyệt' }
    ];

    const DEFAULT_PROMOTIONS = [
        { id: 'promo-1', name: 'Giảm giá 20%', code: 'SALE20', type: 'discount', discount: 20, startDate: '2025-01-01', endDate: '2025-01-31', products: ['all'], status: 'active' },
        { id: 'promo-2', name: 'Mua 2 tặng 1', code: 'B2G1', type: 'buy2get1', discount: 0, startDate: '2025-02-15', endDate: '2025-02-28', products: ['SP001', 'SP002'], status: 'pending' }
    ];

    const DEFAULT_REPORTS = {
        dailyRevenue: [
            { date: '2025-02-20', total: 5200000 },
            { date: '2025-02-21', total: 6100000 }
        ],
        monthlyRevenue: [
            { month: '2025-01', total: 125000000 },
            { month: '2025-02', total: 139000000 }
        ]
    };

    const DEFAULT_CHECKOUT_PROFILE = {
        shippingMethod: 'standard',
        paymentMethod: 'cod',
        shippingAddress: {
            recipientName: '',
            recipientPhone: '',
            addressLine: '',
            city: '',
            note: ''
        },
        paymentCard: {
            cardName: '',
            cardNumber: '',
            expiry: '',
            cvv: ''
        }
    };

    /**
     * Utilities
     */
    function seedIfNeeded(key, defaultValue) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
        }
    }

    seedIfNeeded(STORAGE_KEYS.USERS, DEFAULT_USERS);
    seedIfNeeded(STORAGE_KEYS.CART, []);
    seedIfNeeded(STORAGE_KEYS.SELLER_ACCOUNTS, DEFAULT_SELLER_ACCOUNTS);
    seedIfNeeded(STORAGE_KEYS.INVENTORY, DEFAULT_INVENTORY);
    seedIfNeeded(STORAGE_KEYS.SELLER_PRODUCTS, DEFAULT_SELLER_PRODUCTS);
    seedIfNeeded(STORAGE_KEYS.SELLER_PROMOS, DEFAULT_PROMOTIONS);
    seedIfNeeded(STORAGE_KEYS.SELLER_REPORTS, DEFAULT_REPORTS);
    seedIfNeeded(STORAGE_KEYS.FORGOT_TOKENS, {});
    seedIfNeeded(STORAGE_KEYS.PROMO_ASSIGNMENTS, {});
    seedIfNeeded(STORAGE_KEYS.CHECKOUT_PROFILE, DEFAULT_CHECKOUT_PROFILE);

    const parseJSON = (value, fallback) => {
        try {
            return JSON.parse(value) || fallback;
        } catch (error) {
            console.warn('ShopeeApp parse error', error);
            return fallback;
        }
    };

    /**
     * User helpers
     */
    function getUsers() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.USERS), []).map(user => ({
            ...user,
            password: user.password || 'Demo@1234'
        }));
    }

    function saveUsers(list) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
    }

    function findUser(identity) {
        const normalized = (identity || '').trim().toLowerCase();
        return getUsers().find(user =>
            user.email.toLowerCase() === normalized || user.phone === normalized
        );
    }

    function upsertUser(user) {
        const list = getUsers();
        const idx = list.findIndex(item => item.email.toLowerCase() === user.email.toLowerCase());
        if (idx > -1) {
            list[idx] = { ...list[idx], ...user };
        } else {
            list.push(user);
        }
        saveUsers(list);
    }

    /**
     * Seller helpers
     */
    function getSellerAccounts() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.SELLER_ACCOUNTS), DEFAULT_SELLER_ACCOUNTS);
    }

    function getSellerProducts() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.SELLER_PRODUCTS), DEFAULT_SELLER_PRODUCTS);
    }

    function saveSellerProducts(list) {
        localStorage.setItem(STORAGE_KEYS.SELLER_PRODUCTS, JSON.stringify(list));
    }

    function getPromotions() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.SELLER_PROMOS), DEFAULT_PROMOTIONS);
    }

    function savePromotions(list) {
        localStorage.setItem(STORAGE_KEYS.SELLER_PROMOS, JSON.stringify(list));
    }

    function getReports() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.SELLER_REPORTS), DEFAULT_REPORTS);
    }

    /**
     * Inventory helpers
     */
    function getInventory() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.INVENTORY), DEFAULT_INVENTORY);
    }

    function saveInventory(map) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(map));
    }

    function setInventory(productId, stock) {
        const inventory = getInventory();
        inventory[productId] = { ...(inventory[productId] || {}), stock };
        saveInventory(inventory);
    }

    /**
     * Cart helpers
     */
    function getCart() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.CART), []);
    }

    function saveCart(items) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    }

    function normalizePrice(textPrice) {
        if (typeof textPrice === 'number') return textPrice;
        const digits = (textPrice || '').replace(/[^\d]/g, '');
        return Number(digits || 0);
    }

    function getAvailableStock(productId) {
        const inventory = getInventory();
        return inventory[productId]?.stock ?? 10;
    }

    function addToCartItem(product, qty = 1) {
        const items = getCart();
        const index = items.findIndex(item => item.id === product.id);
        const available = getAvailableStock(product.id);

        if (available <= 0) {
            return { ok: false, reason: 'Hết hàng' };
        }

        const nextQuantity = (items[index]?.quantity || 0) + qty;
        if (nextQuantity > available) {
            return { ok: false, reason: 'Vượt quá tồn kho' };
        }

        const payload = {
            id: product.id,
            name: product.name,
            price: normalizePrice(product.newPrice || product.price),
            image: product.image || `./assets/img/home/${product.id}.PNG`,
            quantity: nextQuantity,
            maxQuantity: available
        };

        if (index > -1) {
            items[index] = payload;
        } else {
            items.push(payload);
        }

        saveCart(items);
        return { ok: true, items };
    }

    function updateCartQuantity(productId, qty) {
        const items = getCart();
        const index = items.findIndex(item => item.id === productId);
        if (index === -1) {
            return { ok: false, reason: 'Không tìm thấy sản phẩm' };
        }
        const available = getAvailableStock(productId);
        if (qty <= 0) {
            items.splice(index, 1);
        } else if (qty > available) {
            items[index].quantity = available;
            items[index].maxQuantity = available;
            saveCart(items);
            return { ok: false, reason: 'Vượt quá tồn kho' };
        } else {
            items[index].quantity = qty;
            items[index].maxQuantity = available;
        }
        saveCart(items);
        return { ok: true, items };
    }

    function removeCartItem(productId) {
        const items = getCart().filter(item => item.id !== productId);
        saveCart(items);
        return items;
    }

    function clearCart() {
        saveCart([]);
        return [];
    }

    function cartTotals(items) {
        const list = items || getCart();
        const subtotal = list.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return {
            subtotal,
            formatted: formatCurrency(subtotal)
        };
    }

    /**
     * Forgot password tokens
     */
    function getForgotTokens() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.FORGOT_TOKENS), {});
    }

    /**
     * Promotion assignments (product -> promo code)
     */
    function getPromoAssignments() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.PROMO_ASSIGNMENTS), {});
    }

    function savePromoAssignments(map) {
        localStorage.setItem(STORAGE_KEYS.PROMO_ASSIGNMENTS, JSON.stringify(map));
    }

    function saveForgotTokens(map) {
        localStorage.setItem(STORAGE_KEYS.FORGOT_TOKENS, JSON.stringify(map));
    }

    function getCheckoutProfile() {
        return parseJSON(localStorage.getItem(STORAGE_KEYS.CHECKOUT_PROFILE), DEFAULT_CHECKOUT_PROFILE);
    }

    function saveCheckoutProfile(profile) {
        const payload = {
            ...DEFAULT_CHECKOUT_PROFILE,
            ...profile,
            shippingAddress: { ...DEFAULT_CHECKOUT_PROFILE.shippingAddress, ...(profile.shippingAddress || {}) },
            paymentCard: { ...DEFAULT_CHECKOUT_PROFILE.paymentCard, ...(profile.paymentCard || {}) }
        };
        localStorage.setItem(STORAGE_KEYS.CHECKOUT_PROFILE, JSON.stringify(payload));
    }

    function issueForgotToken(email) {
        const tokens = getForgotTokens();
        const token = Math.random().toString(36).substring(2, 8).toUpperCase();
        tokens[email.toLowerCase()] = { token, issuedAt: Date.now() };
        saveForgotTokens(tokens);
        return token;
    }

    function validateForgotToken(email, token) {
        const tokens = getForgotTokens();
        const entry = tokens[email.toLowerCase()];
        if (!entry) return false;
        return entry.token === token.trim().toUpperCase();
    }

    function clearForgotToken(email) {
        const tokens = getForgotTokens();
        if (tokens[email.toLowerCase()]) {
            delete tokens[email.toLowerCase()];
            saveForgotTokens(tokens);
        }
    }

    /**
     * Formatters & validators
     */
    function formatCurrency(value) {
        return Number(value || 0).toLocaleString('vi-VN') + 'đ';
    }

    const validators = {
        email(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
        },
        password(value) {
            if (!value || value.length < 8) return false;
            return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
        },
        phone(value) {
            return /^(0|\+84)\d{9}$/.test((value || '').replace(/\s+/g, ''));
        },
        imageUrl(value) {
            if (!value) return true;
            return /^(https?:\/\/.+|\.{0,2}\/.+)\.(png|jpg|jpeg|gif|webp)$/i.test(value);
        }
    };

    function toast(message, type = 'success') {
        const existing = document.querySelector('.shopee-toast');
        if (existing) {
            existing.remove();
        }
        const toastEl = document.createElement('div');
        toastEl.className = `shopee-toast shopee-toast--${type}`;
        const palette = {
            success: '#28a745',
            error: '#dc3545',
            info: '#0ea5e9'
        };
        const background = palette[type] || palette.success;
        toastEl.textContent = message;
        toastEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 20px;
            border-radius: 6px;
            background: ${background};
            color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
        `;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 2500);
    }

    window.ShopeeApp = {
        STORAGE_KEYS,
        getUsers,
        saveUsers,
        upsertUser,
        findUser,
        getSellerAccounts,
        getSellerProducts,
        saveSellerProducts,
        getPromotions,
        savePromotions,
        getReports,
        getInventory,
        setInventory,
        addToCartItem,
        getCart,
        saveCart,
        cartTotals,
        updateCartQuantity,
        removeCartItem,
        clearCart,
        issueForgotToken,
        validateForgotToken,
        clearForgotToken,
        validators,
        toast,
        getAvailableStock,
        formatCurrency,
        getPromoAssignments,
        savePromoAssignments,
        getCheckoutProfile,
        saveCheckoutProfile
    };
})(window);

