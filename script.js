// ===================================
// سوق عُكاظ - نظام السلة والمنتجات
// النسخة المحسّنة 4.0
// ===================================

class OkazMarket {
    constructor() {
        this.cart = [];
        this.cartIdCounter = 0;
        this.productPrices = this.initializePrices();
        this.productData = this.initializeProductData();
        this.colorPickerSystem = null;
        this.init();
    }

    // تهيئة أسعار المنتجات
    initializePrices() {
        return {
            // العسل
            'honey-sidar': [1500, 3000, 6000],
            
            // الزيوت
            'oil-olive': [1200, 5500],
            'oil-argan': [2000, 4000],
            
            // الملابس
            'clothing-shirt': [3800]
        };
    }

    // ⭐ محدث: بيانات المنتجات مع الصور لكل مقاس
    initializeProductData() {
        return {
            'clothing-shirt': {
                name: 'قميص اليسير',
                basePrice: 3800,
                // الصور المتاحة لكل مقاس
                sizeImages: {
                   /* '52': [
                        {
                            id: 'beige-52',
                            name: 'بيج',
                            image: 'images/products/اليسير_البيج-removebg-preview.png',
                            thumb: 'images/products/اليسير_البيج-removebg-preview.png',
                            available: true
                        },
                        {
                            id: 'blue-52',
                            name: 'أزرق',
                            image: 'images/products/اليسير_الأزرق-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأزرق-removebg-preview.png',
                            available: true
                        }
                    ], */
                   /* '54': [
                        {
                            id: 'beige-54',
                            name: 'بيج',
                            image: 'images/products/اليسير_البيج-removebg-preview.png',
                            thumb: 'images/products/اليسير_البيج-removebg-preview.png',
                            available: true
                        },
                        {
                            id: 'red-54',
                            name: 'أحمر',
                            image: 'images/products/اليسير_الأحمر-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأحمر-removebg-preview.png',
                            available: true
                        },
                        {
                            id: 'blue-54',
                            name: 'أزرق',
                            image: 'images/products/اليسير_الأزرق-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأزرق-removebg-preview.png',
                            available: true
                        }
                    ],*/
                    '56': [
                        {
                            id: 'beige-56',
                            name: 'بيج',
                            image: 'images/products/اليسير_البيج-removebg-preview.png',
                            thumb: 'images/products/اليسير_البيج-removebg-preview.png',
                            available: true
                        },
                        {
                            id: 'green-56',
                            name: 'أخضر',
                            image: 'images/products/اليسير_الأخضر_-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأخضر_-removebg-preview.png',
                            available: true
                        },
                       /* {
                            id: 'blue-56',
                            name: 'أزرق',
                            image: 'images/products/اليسير_الأزرق-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأزرق-removebg-preview.png',
                            available: true
                        }*/
                    ],
                    '58': [
                       /* {
                            id: 'beige-58',
                            name: 'بيج',
                            image: 'images/products/اليسير_البيج-removebg-preview.png',
                            thumb: 'images/products/اليسير_البيج-removebg-preview.png',
                            available: true
                        },
                        {
                            id: 'red-58',
                            name: 'أحمر',
                            image: 'images/products/اليسير_الأحمر-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأحمر-removebg-preview.png',
                            available: true
                        }, */
                        {
                            id: 'green-58',
                            name: 'أخضر',
                            image: 'images/products/اليسير_الأخضر_-removebg-preview.png',
                            thumb: 'images/products/اليسير_الأخضر_-removebg-preview.png',
                            available: true
                        }
                    ]
                },
                // المتغيرات الحالية
                selectedSize: '52',
                selectedColor: null,
                selectedColorInfo: null
            }
        };
    }

    // تهيئة التطبيق
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    // عند جاهزية DOM
    onDOMReady() {
        this.attachEventListeners();
        this.updateCart();
        this.handleImageErrors();
        this.fixPriceFormatting();
        this.initSmoothScroll();
        this.initOrderForm();
        
        // تهيئة نظام الألوان (فقط في حالة وجود قسم الألبسة)
        this.initColorPickerSystem();
        
        // تهيئة السلة من التخزين المحلي إذا كان هناك
        this.loadCartFromStorage();

        // تهيئة زر العودة للأعلى
        this.initBackToTop();
    }

    // تهيئة زر العودة للأعلى
    initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // تهيئة نظام الألوان (قسم الألبسة)
    initColorPickerSystem() {
        const shirtSection = document.getElementById('shirt-size-select');
        if (!shirtSection) return;

        this.colorPickerSystem = new ColorPickerSystem(this);
        
        this.colorPickerSystem.onColorSelected = (colorData) => {
            this.updateSelectedColorForCart(colorData);
        };
        
        this.initializeDefaultProduct();
    }

    // تهيئة المنتج الافتراضي
    initializeDefaultProduct() {
        const shirtSizeSelect = document.getElementById('shirt-size-select');
        if (shirtSizeSelect && this.colorPickerSystem) {
            shirtSizeSelect.value = '52';
            this.colorPickerSystem.handleSizeChange('52');
        }
    }

    // ⭐ جديد: تحديث اللون المحدد للسلة
    updateSelectedColorForCart(colorData) {
        const productData = this.productData['clothing-shirt'];
        if (productData) {
            productData.selectedColor = colorData.name;
            productData.selectedColorInfo = colorData;
        }
    }

    // تحميل السلة من التخزين المحلي
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('okaz-market-cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateCart();
            }
        } catch (error) {
            console.warn('فشل تحميل السلة من التخزين:', error);
        }
    }

    // حفظ السلة في التخزين المحلي
    saveCartToStorage() {
        try {
            localStorage.setItem('okaz-market-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.warn('فشل حفظ السلة في التخزين:', error);
        }
    }

    // ربط جميع الأحداث
    attachEventListeners() {
        // تحديث الأسعار عند تغيير الخيارات
        document.querySelectorAll('.size-select').forEach(select => {
            select.addEventListener('change', () => this.updateSimpleProductPrice(select));
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('input', () => this.handleQuantityChange(input));
        });

        // تحديث أسعار الملابس عند تغيير المقاس (إن وُجد)
        document.querySelectorAll('.clothing-size-select').forEach(select => {
            select.addEventListener('change', (e) => {
                if (this.colorPickerSystem) {
                    this.colorPickerSystem.handleSizeChange(e.target.value);
                }
                this.updateClothingProductPrice(select);
            });
        });

        // إضافة المنتجات للسلة
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', () => this.addToCart(button));
        });
    }

    // معالجة أخطاء الصور
    handleImageErrors() {
        document.querySelectorAll('.product-real-image').forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const icon = document.createElement('div');
                icon.innerHTML = '📦';
                icon.style.cssText = 'font-size:4rem;opacity:0.3;display:flex;align-items:center;justify-content:center;width:100%;height:100%';
                this.parentNode.appendChild(icon);
            });
        });
    }

    // تحديث سعر المنتج البسيط
    updateSimpleProductPrice(element) {
        const productCard = element.closest('.product-card');
        if (!productCard) return;

        const productId = element.dataset.product;
        const sizeSelect = productCard.querySelector('.size-select');
        const quantityInput = productCard.querySelector('.quantity-input');
        const priceElement = productCard.querySelector('.price');

        if (!sizeSelect || !quantityInput || !priceElement) return;

        const sizeIndex = parseInt(sizeSelect.value);
        const quantity = Math.max(1, parseInt(quantityInput.value) || 1);

        if (this.productPrices[productId]?.[sizeIndex]) {
            const totalPrice = this.productPrices[productId][sizeIndex] * quantity;
            this.updatePriceDisplay(priceElement, totalPrice);
        }
    }

    // تحديث سعر منتج الملابس
    updateClothingProductPrice(element) {
        const productCard = element.closest('.product-card');
        if (!productCard) return;

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        if (!addToCartBtn) return;

        const productId = addToCartBtn.dataset.product;
        const quantityInput = productCard.querySelector('.quantity-input');
        const priceElement = productCard.querySelector('.price');

        if (!quantityInput || !priceElement) return;

        const quantity = Math.max(1, parseInt(quantityInput.value) || 1);
        const unitPrice = this.productPrices[productId]?.[0] || 0;
        const totalPrice = unitPrice * quantity;

        this.updatePriceDisplay(priceElement, totalPrice);
    }

    // معالجة تغيير الكمية
    handleQuantityChange(input) {
        const productCard = input.closest('.product-card');
        if (!productCard) return;

        // التحقق من القيمة الدنيا
        const value = parseInt(input.value);
        if (value < 1) {
            input.value = 1;
        }

        // تحديث السعر حسب نوع المنتج
        const sizeSelect = productCard.querySelector('.size-select');
        const clothingSizeSelect = productCard.querySelector('.clothing-size-select');
        
        if (sizeSelect) {
            // منتج بسيط (عسل، زيوت)
            this.updateSimpleProductPrice(sizeSelect);
        } else if (clothingSizeSelect) {
            // منتج ملابس
            this.updateClothingProductPrice(input);
        }
    }

    // تحديث عرض السعر
    updatePriceDisplay(priceElement, price) {
        const formattedPrice = this.formatNumber(price);
        priceElement.innerHTML = `
            <span class="price-number">${formattedPrice}</span>
            <span class="currency">دج</span>
        `;
    }

    // تنسيق الأرقام
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // إضافة منتج للسلة
    addToCart(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        const productId = button.dataset.product;
        const productType = button.dataset.type;
        const productName = productCard.querySelector('.product-name')?.textContent.trim() || 'منتج';
        const quantityInput = productCard.querySelector('.quantity-input');
        const quantity = Math.max(1, parseInt(quantityInput?.value) || 1);

        // ⭐ محدث: التحقق من اختيار اللون للملابس
        if (productType === 'clothing') {
            const colorPicker = this.colorPickerSystem;
            if (!colorPicker || !colorPicker.selectedColorData) {
                this.showToast('⚠️ الرجاء اختيار لون أولاً');
                return;
            }
        }

        let cartItem = {
            id: ++this.cartIdCounter,
            productId,
            name: productName,
            quantity,
            dateAdded: new Date().toISOString()
        };

        if (productType === 'simple') {
            cartItem = this.buildSimpleCartItem(cartItem, productCard);
        } else if (productType === 'clothing') {
            cartItem = this.buildClothingCartItem(cartItem, productCard);
        }

        if (cartItem.totalPrice) {
            this.cart.push(cartItem);
            this.updateCart();
            this.saveCartToStorage();
            this.showToast(`✅ تمت إضافة ${productName} إلى السلة`);
            
            // إعادة تعيين الكمية
            if (quantityInput) {
                quantityInput.value = 1;
            }
            
        } else {
            this.showToast('⚠️ حدث خطأ في إضافة المنتج');
        }
    }

    // بناء عنصر سلة بسيط
    buildSimpleCartItem(cartItem, productCard) {
        const sizeSelect = productCard.querySelector('.size-select');
        if (!sizeSelect) return cartItem;

        const sizeIndex = parseInt(sizeSelect.value);
        const sizeText = sizeSelect.options[sizeSelect.selectedIndex]?.text || '';

        cartItem.size = sizeText;
        cartItem.unitPrice = this.productPrices[cartItem.productId]?.[sizeIndex] || 0;
        cartItem.totalPrice = cartItem.unitPrice * cartItem.quantity;

        return cartItem;
    }

    // ⭐ محدث: بناء عنصر سلة ملابس مع بيانات القائمة المنبثقة
    buildClothingCartItem(cartItem, productCard) {
        const sizeSelect = productCard.querySelector('.clothing-size-select');
        
        // الحصول على المقاس المختار
        if (sizeSelect) {
            const selectedSize = sizeSelect.value;
            const sizeText = sizeSelect.options[sizeSelect.selectedIndex]?.text || selectedSize;
            cartItem.size = `المقاس: ${sizeText}`;
        }
        
        // الحصول على اللون المختار من نظام القائمة المنبثقة
        if (this.colorPickerSystem && this.colorPickerSystem.selectedColorData) {
            cartItem.color = this.colorPickerSystem.selectedColorData.name;
            cartItem.colorImage = this.colorPickerSystem.selectedColorData.image;
        } else {
            cartItem.color = 'غير محدد';
        }
        
        cartItem.unitPrice = this.productPrices[cartItem.productId]?.[0] || 0;
        cartItem.totalPrice = cartItem.unitPrice * cartItem.quantity;
        
        return cartItem;
    }

    // تحديث عرض السلة
    updateCart() {
        const cartContainer = document.getElementById('cartItemsContainer');
        const cartCountBadge = document.getElementById('cartCount');

        if (!cartContainer || !cartCountBadge) return;

        cartCountBadge.textContent = this.cart.length;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = this.getEmptyCartHTML();
            this.updateNavTotal(0);
            return;
        }

        const { itemsHTML, total } = this.buildCartHTML();
        cartContainer.innerHTML = itemsHTML + this.getTotalHTML(total);
        this.updateNavTotal(total);
    }

    // HTML للسلة الفارغة
    getEmptyCartHTML() {
        return `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>السلة فارغة</h3>
                <p>لم تقم بإضافة أي منتجات بعد</p>
            </div>
        `;
    }

    // بناء HTML السلة
    buildCartHTML() {
        let itemsHTML = '<div class="cart-items">';
        let total = 0;

        this.cart.forEach(item => {
            total += item.totalPrice;
            const details = this.buildItemDetails(item);
            
            itemsHTML += `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${this.escapeHtml(item.name)}</div>
                        <div class="cart-item-details">${details}</div>
                    </div>
                    <div class="cart-item-price">
                        <span class="price-number">${this.formatNumber(item.totalPrice)}</span>
                        <span class="currency">دج</span>
                    </div>
                    <button class="remove-btn" onclick="window.okazMarket.removeFromCart(${item.id})" 
                            aria-label="حذف ${this.escapeHtml(item.name)}"
                            title="حذف المنتج">
                        ✕
                    </button>
                </div>
            `;
        });

        itemsHTML += '</div>';
        return { itemsHTML, total };
    }

    // بناء تفاصيل المنتج
    buildItemDetails(item) {
        const details = [];
        
        details.push(`الكمية: ${item.quantity}`);
        if (item.size) details.push(item.size);
        if (item.color) details.push(`اللون: ${item.color}`);
        if (item.type) details.push(`النوع: ${item.type}`);
        
        return details.join(' | ');
    }

    // HTML للمجموع
    getTotalHTML(total) {
        return `
            <div class="cart-total">
                <h3>المجموع الكلي</h3>
                <div class="total-price">
                    <span class="price-number">${this.formatNumber(total)}</span>
                    <span class="currency">دج</span>
                </div>
            </div>
        `;
    }

    // إزالة منتج من السلة
    removeFromCart(itemId) {
        const itemToRemove = this.cart.find(item => item.id === itemId);
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCart();
        this.saveCartToStorage();
        
        if (itemToRemove) {
            this.showToast(`🗑️ تم حذف ${itemToRemove.name} من السلة`);
        }
    }

    // عرض إشعار
    showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('aria-atomic', 'true');
        
        let icon = 'ℹ️';
        if (message.includes('✅')) icon = '✅';
        if (message.includes('⚠️')) icon = '⚠️';
        if (message.includes('🗑️')) icon = '🗑️';
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message.replace(/[✅⚠️🗑️]/g, '')}</div>
        `;
        
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);

        toast.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
    }

    // تحديث السعر الإجمالي في شريط التنقل
    updateNavTotal(total) {
        let navTotal = document.getElementById('cartTotalNav');
        if (!navTotal) {
            const cartLink = document.querySelector('a[href="#cart"]');
            if (!cartLink) return;
            navTotal = document.createElement('span');
            navTotal.id = 'cartTotalNav';
            navTotal.className = 'cart-total-nav';
            cartLink.appendChild(navTotal);
        }
        navTotal.textContent = `${this.formatNumber(total)} دج`;
        navTotal.style.display = total > 0 ? 'inline' : 'none';
    }

    // إصلاح تنسيق الأسعار
    fixPriceFormatting() {
        document.querySelectorAll('.price').forEach(priceElement => {
            const text = priceElement.textContent.trim();
            const numberMatch = text.match(/(\d+(?:[,\.]\d+)*)/);
            
            if (numberMatch) {
                const number = numberMatch[1];
                priceElement.innerHTML = `
                    <span class="price-number">${number}</span>
                    <span class="currency">دج</span>
                `;
            }
        });
    }

    // تهيئة التمرير السلس
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || href === '#!') {
                    e.preventDefault();
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    anchor.classList.add('active');
                    
                    history.pushState(null, null, href);
                }
            });
        });

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 100;
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // تهيئة نموذج الطلب
    initOrderForm() {
        const orderForm = document.getElementById('orderForm');
        if (!orderForm) return;

        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });

        const inputs = orderForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateSingleField(input);
            });
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                if (input.value.trim().length > 0) {
                    this.validateSingleField(input);
                }
            });
        });

        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    // التحقق من حقل واحد
    validateSingleField(input) {
        const id = input.id;
        const value = input.value.trim();
        let error = '';

        if (!value) {
            error = 'هذا الحقل مطلوب';
        } else if (id === 'firstName' || id === 'lastName') {
            if (value.length < 2) error = 'يجب أن يحتوي الاسم على حرفين على الأقل';
            else if (/\d/.test(value)) error = 'الاسم يجب ألا يحتوي على أرقام';
        } else if (id === 'phone') {
            if (value.length < 10) error = 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل';
            else if (!/^0\d{9,}$/.test(value)) error = 'رقم الهاتف غير صحيح، ابدأ بـ 0';
        } else if (id === 'address') {
            if (value.length < 5) error = 'يرجى إدخال عنوان كامل (5 أحرف على الأقل)';
        }

        this.showFieldError(input, error);
        return !error;
    }

    // عرض خطأ الحقل
    showFieldError(input, message) {
        const existing = input.parentNode.querySelector('.input-error');
        existing?.remove();

        input.classList.remove('input-valid');
        input.classList.remove('input-invalid');

        if (message) {
            input.classList.add('input-invalid');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'input-error';
            errorSpan.textContent = message;
            input.parentNode.appendChild(errorSpan);
        } else {
            input.classList.add('input-valid');
        }
    }

    // إزالة خطأ الحقل
    clearFieldError(input) {
        input.classList.remove('input-invalid');
        input.classList.remove('input-valid');
        input.parentNode.querySelector('.input-error')?.remove();
    }

    // إرسال الطلب
    submitOrder() {
        if (this.cart.length === 0) {
            this.showToast('⚠️ السلة فارغة! الرجاء إضافة منتجات قبل إتمام الطلب.');
            return;
        }

        const fields = ['firstName', 'lastName', 'phone', 'address'];
        let allValid = true;
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input && !this.validateSingleField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            const firstError = document.querySelector('.input-invalid');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError?.focus();
            this.showToast('⚠️ الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح');
            return;
        }

        const formData = this.getFormData();
        const message = this.buildWhatsAppMessage(formData);
        const orderForm = document.getElementById('orderForm');

        const whatsappNumber = '213774650563';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        const submitBtn = document.querySelector('.submit-order-btn');
        const originalText = submitBtn?.innerHTML;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        }

        this.saveOrderHistory(formData);

        setTimeout(() => {
            const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

            if (newWindow) {
                this.showToast('✅ تم فتح واتساب لإرسال الطلب');

                this.cart = [];
                this.updateCart();
                this.saveCartToStorage();
                orderForm?.reset();
                document.querySelectorAll('.input-valid').forEach(el => el.classList.remove('input-valid'));
            } else {
                this.showToast('⚠️ يرجى السماح للنوافذ المنبثقة لإرسال الطلب');
            }
        }, 800);
    }

    // حفظ الطلب في السجل المحلي
    saveOrderHistory(formData) {
        try {
            const history = JSON.parse(localStorage.getItem('okaz-orders') || '[]');
            history.push({
                date: new Date().toISOString(),
                customer: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                items: this.cart.length,
                total: this.cart.reduce((sum, item) => sum + item.totalPrice, 0)
            });
            if (history.length > 50) history.shift();
            localStorage.setItem('okaz-orders', JSON.stringify(history));
        } catch (e) {
            // silent
        }
    }

    // الحصول على بيانات النموذج
    getFormData() {
        return {
            firstName: document.getElementById('firstName')?.value.trim() || '',
            lastName: document.getElementById('lastName')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            address: document.getElementById('address')?.value.trim() || '',
            notes: document.getElementById('notes')?.value.trim() || '',
            orderDate: new Date().toLocaleDateString('ar-SA')
        };
    }

    // بناء رسالة واتساب
    buildWhatsAppMessage(formData) {
        let message = `*طلب جديد من سوق عُكاظ* 🏮\n\n`;
        message += `📅 تاريخ الطلب: ${formData.orderDate}\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*معلومات العميل:*\n`;
        message += `👤 الاسم: ${formData.firstName} ${formData.lastName}\n`;
        message += `📱 الهاتف: ${formData.phone}\n`;
        message += `📍 العنوان: ${formData.address}\n`;
        
        if (formData.notes) {
            message += `📝 ملاحظات: ${formData.notes}\n`;
        }

        message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*تفاصيل الطلب:*\n\n`;

        let total = 0;
        this.cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   📦 الكمية: ${item.quantity}\n`;
            
            if (item.size) message += `   📏 ${item.size}\n`;
            if (item.color) message += `   🎨 اللون: ${item.color}\n`;
            
            message += `   💰 السعر: ${this.formatNumber(item.totalPrice)} دج\n`;
            message += `   ──────────────\n`;
            total += item.totalPrice;
        });

        message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `*💰 المجموع الكلي: ${this.formatNumber(total)} دج*\n`;
        message += `*💎 عدد المنتجات: ${this.cart.length}*\n\n`;
        message += `شكراً لتسوقكم معنا في سوق عُكاظ! 🌟\n`;
        message += `نتطلع لخدمتكم دائماً 🤲`;

        return message;
    }

    // تنظيف HTML (منع XSS)
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

}

// ===================================
// نظام اختيار الألوان بقائمة منبثقة
// ===================================

class ColorPickerSystem {
    constructor(okazMarket) {
        this.okazMarket = okazMarket;
        this.currentSize = null;
        this.selectedColor = null;
        this.selectedColorData = null;
        this.tempSelectedColor = null;
        this.currentColorsData = null;
        this.init();
    }
    
    init() {
        // ربط حدث تغيير المقاس
        const sizeSelect = document.getElementById('shirt-size-select');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', (e) => {
                this.handleSizeChange(e.target.value);
            });
        }
        
        // تهيئة الأحداث
        this.initEvents();
    }
    
    initEvents() {
        // زر فتح القائمة (مباشر من HTML)
        const openBtn = document.getElementById('open-color-picker-btn');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openColorPicker());
        }
        
        // زر إغلاق القائمة
        const closeBtn = document.querySelector('.close-popup-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeColorPicker());
        }
        
        // زر تأكيد الاختيار
        const confirmBtn = document.querySelector('.confirm-color-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmColorSelection());
        }
        
        // إغلاق بالنقر خارج القائمة
        const overlay = document.getElementById('color-popup-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeColorPicker());
        }
    }
    
    // معالجة تغيير المقاس
    handleSizeChange(size) {
        this.currentSize = size;
        this.selectedColor = null;
        this.selectedColorData = null;
        this.tempSelectedColor = null;
        
        // تحديث زر اختيار اللون
        this.updateColorPickerButton(size);
        
        // إخفاء معاينة اللون
        this.hideColorPreview();
        
        // تعطيل زر الإضافة
        this.disableAddToCartButton();
        
        // تحضير البيانات للقائمة
        this.prepareColorPopupData(size);
    }
    
    // تحديث زر اختيار اللون
    updateColorPickerButton(size) {
        const btn = document.getElementById('open-color-picker-btn');
        const btnText = btn.querySelector('.color-picker-text');
        
        if (btnText) {
            btnText.textContent = `اختر اللون (مقاس ${size})`;
        }
        
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
    
    // تحضير بيانات القائمة
    prepareColorPopupData(size) {
        const productData = this.okazMarket?.productData?.['clothing-shirt'];
        if (!productData || !productData.sizeImages[size]) {
            this.currentColorsData = [];
            return;
        }
        
        this.currentColorsData = productData.sizeImages[size];
    }
    
    // فتح قائمة الألوان
    openColorPicker() {
        if (!this.currentSize || !this.currentColorsData || this.currentColorsData.length === 0) {
            this.okazMarket.showToast('⚠️ لا توجد ألوان متاحة لهذا المقاس');
            return;
        }
        
        // تحضير وعرض القائمة
        this.displayColorPopup();
        
        // إظهار القائمة
        const popup = document.getElementById('color-picker-popup');
        const overlay = document.getElementById('color-popup-overlay');
        
        if (popup && overlay) {
            popup.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // تمييز اللون المختار حالياً إن وجد
        if (this.tempSelectedColor) {
            this.highlightSelectedColorInPopup();
        }
    }
    
    // عرض القائمة المنبثقة
    displayColorPopup() {
        const colorsGrid = document.getElementById('color-images-grid');
        const noColorsMsg = document.getElementById('popup-no-colors');
        
        if (!colorsGrid) return;
        
        // تفريغ الشبكة
        colorsGrid.innerHTML = '';
        
        // إضافة الصور للشبكة
        this.currentColorsData.forEach(color => {
            const colorElement = this.createColorElement(color);
            colorsGrid.appendChild(colorElement);
        });
        
        // إخفاء رسالة عدم وجود ألوان
        if (noColorsMsg) {
            noColorsMsg.style.display = 'none';
        }
        
        // إضافة أحداث النقر
        this.attachPopupColorEvents();
    }
    
    // إنشاء عنصر اللون في القائمة
    createColorElement(colorData) {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-image-option';
        colorDiv.dataset.colorId = colorData.id;
        colorDiv.dataset.colorName = colorData.name;
        colorDiv.dataset.image = colorData.image;
        
        // التحقق مما إذا كان هذا اللون هو المحدد حالياً
        const isSelected = this.tempSelectedColor?.id === colorData.id || 
                          this.selectedColorData?.id === colorData.id;
        
        if (isSelected) {
            colorDiv.classList.add('selected');
        }
        
        colorDiv.innerHTML = `
            <img src="${colorData.thumb || colorData.image}" 
                 alt="قميص ${colorData.name}"
                 class="popup-color-thumbnail">
            <div class="color-image-label">${colorData.name}</div>
            <div class="color-checkmark">✓</div>
        `;
        
        return colorDiv;
    }
    
    // إضافة أحداث النقر للصور في القائمة
    attachPopupColorEvents() {
        const colorOptions = document.querySelectorAll('.color-image-option');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // إزالة التحديد من الجميع
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                
                // إضافة التحديد للعنصر المختار
                option.classList.add('selected');
                
                // تخزين الاختيار المؤقت
                this.tempSelectedColor = {
                    id: option.dataset.colorId,
                    name: option.dataset.colorName,
                    image: option.dataset.image
                };
            });
        });
    }
    
    // تمييز اللون المختار في القائمة
    highlightSelectedColorInPopup() {
        if (!this.tempSelectedColor) return;
        
        const colorOptions = document.querySelectorAll('.color-image-option');
        colorOptions.forEach(option => {
            if (option.dataset.colorId === this.tempSelectedColor.id) {
                option.classList.add('selected');
            }
        });
    }
    
    // تأكيد اختيار اللون
    confirmColorSelection() {
        if (!this.tempSelectedColor) {
            this.okazMarket.showToast('⏳ الرجاء اختيار لون أولاً');
            return;
        }
        
        // حفظ الاختيار النهائي
        this.selectedColor = this.tempSelectedColor.name;
        this.selectedColorData = this.tempSelectedColor;
        
        // تحديث الصورة الرئيسية
        this.updateMainImage(this.tempSelectedColor.image);
        
        // عرض معاينة اللون
        this.showColorPreview(this.tempSelectedColor);
        
        // تمكين زر الإضافة
        this.enableAddToCartButton();
        
        // تحديث بيانات OkazMarket
        if (this.okazMarket && this.okazMarket.onColorSelected) {
            this.okazMarket.onColorSelected(this.tempSelectedColor);
        }
        
        // إغلاق القائمة
        this.closeColorPicker();
    }
    
    // إغلاق قائمة الألوان
    closeColorPicker() {
        const popup = document.getElementById('color-picker-popup');
        const overlay = document.getElementById('color-popup-overlay');
        
        if (popup && overlay) {
            popup.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // تحديث الصورة الرئيسية
    updateMainImage(imageUrl) {
        const mainImage = document.getElementById('shirt-main-image');
        if (mainImage) {
            mainImage.style.transition = 'opacity 0.3s ease';
            mainImage.style.opacity = '0.3';
            
            setTimeout(() => {
                mainImage.src = imageUrl;
                mainImage.style.opacity = '1';
            }, 200);
        }
    }
    
    // عرض معاينة اللون المختار
    showColorPreview(colorData) {
        const previewContainer = document.getElementById('selected-color-preview');
        const colorThumb = document.getElementById('selected-color-thumb');
        const colorName = document.getElementById('selected-color-name');
        
        if (previewContainer && colorThumb && colorName) {
            colorThumb.src = colorData.image;
            colorThumb.alt = `قميص ${colorData.name}`;
            colorName.textContent = colorData.name;
            
            previewContainer.style.display = 'flex';
        }
    }
    
    // إخفاء معاينة اللون
    hideColorPreview() {
        const previewContainer = document.getElementById('selected-color-preview');
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
    }
    
    // تمكين زر الإضافة
    enableAddToCartButton() {
        const addButton = document.getElementById('add-shirt-to-cart');
        if (addButton && this.selectedColor) {
            addButton.disabled = false;
            addButton.style.opacity = '1';
            addButton.style.cursor = 'pointer';
        }
    }
    
    // تعطيل زر الإضافة
    disableAddToCartButton() {
        const addButton = document.getElementById('add-shirt-to-cart');
        if (addButton) {
            addButton.disabled = true;
            addButton.style.opacity = '0.6';
            addButton.style.cursor = 'not-allowed';
        }
    }
}

// ==========================================
// الوظائف المساعدة العامة
// ==========================================

// تحديث الوقت الحقيقي
function updateLiveTime() {
    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-DZ', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('ar-DZ', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const timeElement = document.getElementById('live-time');
        if (timeElement) {
            timeElement.textContent = `${dateString} - ${timeString}`;
        }
    };
    
    updateTime();
    setInterval(updateTime, 1000);
}

// إضافة تأثيرات للصور
function addImageHoverEffects() {
    document.querySelectorAll('.product-real-image').forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.03)';
            img.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// تهيئة الأزرار التفاعلية
function initInteractiveButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.98)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });
}

// ==========================================
// التهيئة الرئيسية
// ==========================================

function initializeAllSystems() {
    // إنشاء نسخة من التطبيق
    window.okazMarket = new OkazMarket();
    
    // تهيئة الميزات الإضافية
    updateLiveTime();
    addImageHoverEffects();
    initInteractiveButtons();
}

// تهيئة عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllSystems);
} else {
    initializeAllSystems();
}

// دعم للمتصفحات القديمة
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

 