// بيانات المنتجات
const products = [
    {
        id: 1,
        name_ar: "عطر خمرة الفاخر",
        type: 'perfume',
        price: 299.00,
        images: [
            'images/khamrah.jpg', // المسار الصحيح
            'images/kalemat.jpg'  // المسار الصحيح
        ],
        description_ar: "عطر شرقي فاخر يجمع بين نفحات العود، العنبر، والفانيليا. رائحة غنية تدوم طويلاً وتمنحك حضورًا مميزًا.",
        bestseller: true
    },
    {
        id: 2,
        name_ar: "عطر سحر الشرق",
        type: 'perfume',
        price: 249.00,
        images: [
            'images/ihsas.webp', // المسار الصحيح
            'images/arab.jpg'  // المسار الصحيح
        ],
        description_ar: "مزيج ساحر من المسك والورد والياسمين. يجسد الأناقة العربية الأصيلة ويترك انطباعًا لا يُنسى.",
        bestseller: true
    },
    {
        id: 3,
        name_ar: "ساعة أزيكي الكلاسيكية",
        type: 'watch',
        price: 349.00,
        images: [
            'images/watch1.jpg', // المسار الصحيح
            'images/images.jpeg' // المسار الصحيح
        ],
        description_ar: "ساعة رجالية أنيقة بتصميم كلاسيكي، مصنوعة من الفولاذ المقاوم للصدأ ومزودة بحزام جلدي فاخر.",
        bestseller: true
    },
    {
        id: 4,
        name_ar: "ساعة أزيكي النسائية الأنيقة",
        type: 'watch',
        price: 319.00,
        images: [
            'images/watch2.jpeg', // المسار الصحيح
            'images/asad2.webp' // المسار الصحيح
        ],
        description_ar: "ساعة نسائية فاخرة بتصميم رقيق وعصري، مرصعة بالكريستال اللامع ومناسبة لكل المناسبات.",
        bestseller: false
    }
];

// روابط صور السلايدر
const heroImages = [
    'images/khamrah.jpg',  // المسار الصحيح
    'images/watch1.jpg',   // المسار الصحيح
    'images/ihsas.webp'    // المسار الصحيح
];

// المتغيرات الرئيسية
let currentPage = 'home';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedProduct = null;
let activeFilter = 'all';
const discountEndTime = new Date().getTime() + 1200000; // 20 دقيقة من الآن

// عناصر DOM
const pageContent = document.getElementById('page-content');
const cartCountSpan = document.getElementById('cart-count');
const modal = document.getElementById("myModal");
const modalMessage = document.getElementById("modal-message");
const closeButton = document.querySelector(".close-button");

// وظائف مساعدة
function showMessage(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountSpan.textContent = count;
    cartCountSpan.style.display = count > 0 ? 'flex' : 'none';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }
    updateCartCount();
    saveCart();
    showMessage('تمت إضافة المنتج إلى السلة.');
}

function createProductCard(p) {
    return `
        <div data-action="view-product" data-id="${p.id}" class="product-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer">
            <img src="${p.images[0]}" alt="${p.name_ar}" class="w-full h-72 object-cover" />
            <div class="p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${p.name_ar}</h3>
                <p class="text-amber-700 text-lg font-bold">${p.price.toFixed(2)} درهم</p>
                <button data-action="quick-add" data-id="${p.id}" class="mt-4 bg-amber-700 text-white font-bold py-2 px-6 rounded-full hover:bg-amber-600 transition-colors">أضف إلى السلة</button>
            </div>
        </div>
    `;
}

// دالة عرض الصفحات
function renderPage() {
    pageContent.innerHTML = '';
    switch (currentPage) {
        case 'home':
            pageContent.innerHTML = renderHomepage();
            startHeroSlider();
            startCountdownTimer();
            break;
        case 'shop':
            pageContent.innerHTML = renderShopPage();
            break;
        case 'product':
            if (selectedProduct) {
                pageContent.innerHTML = renderProductPage(selectedProduct);
            }
            break;
        case 'cart':
            pageContent.innerHTML = renderCartPage();
            break;
        case 'about':
            pageContent.innerHTML = renderAboutPage();
            break;
        default:
            pageContent.innerHTML = renderHomepage();
            break;
    }
}

// دالة الواجهة الرئيسية
function renderHomepage() {
    const bestsellers = products.filter(p => p.bestseller);
    return `
        <section class="relative h-[80vh] flex items-center justify-center text-white hero-slider">
            ${heroImages.map((img, index) => `
                <div class="hero-slide h-full w-full ${index === 0 ? 'active' : ''}" style="background-image: url('${img}');"></div>
            `).join('')}
            <div class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center">
                <h1 class="text-4xl md:text-6xl font-extrabold text-amber-500 mb-4 animate-fade-in-up">
                    اكتشف أناقة العطور والساعات
                </h1>
                <p class="text-xl md:text-2xl font-light mb-8 max-w-3xl animate-fade-in-up delay-1">
                    أفخم العطور العربية والساعات الأنيقة بجودة لا مثيل لها
                </p>
                <div class="flex space-x-4 mb-8 justify-center">
                    <button data-page="shop" class="bg-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-amber-600 transition-colors animate-fade-in-up delay-2">تسوق الآن</button>
                </div>
                 <div class="mt-8 text-center bg-black/50 p-4 rounded-xl max-w-sm mx-auto">
                    <p class="text-xl font-bold mb-2 text-amber-500">خصم 10% ينتهي خلال:</p>
                    <div id="countdown-timer" class="countdown-timer flex justify-center space-x-2">
                        </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">الأكثر مبيعاً</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${bestsellers.map(p => createProductCard(p)).join('')}
                </div>
            </div>
        </section>

        <section class="py-16 bg-gray-900 text-white">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-amber-500 mb-4">قصتنا</h2>
                <p class="text-lg mb-8 max-w-3xl mx-auto">
                    في AzikiStore، نؤمن بأن العطور والساعات ليست مجرد منتجات، بل هي تعبير عن الهوية والأناقة.
                    نقدم لك تشكيلة فاخرة تجمع بين الأصالة العربية والحداثة، لتمنحك لمسة من الفخامة التي تستحقها.
                </p>
                <button data-page="about" class="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                    اكتشف المزيد
                    <i class="fas fa-arrow-left mr-2"></i>
                </button>
            </div>
        </section>
    `;
}

// دالة صفحة المتجر
function renderShopPage() {
    const filteredProducts = products.filter(p => activeFilter === 'all' || p.type === activeFilter);
    return `
        <div class="pt-24 pb-12 bg-white min-h-screen">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">منتجاتنا</h2>
                <div class="flex justify-center space-x-4 mb-8">
                    <button data-action="filter" data-filter="all" class="filter-btn py-2 px-4 rounded-full font-semibold transition-colors ${activeFilter === 'all' ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-amber-100'}">
                        الكل
                    </button>
                    <button data-action="filter" data-filter="perfume" class="filter-btn py-2 px-4 rounded-full font-semibold transition-colors ${activeFilter === 'perfume' ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-amber-100'}">
                        عطور
                    </button>
                    <button data-action="filter" data-filter="watch" class="filter-btn py-2 px-4 rounded-full font-semibold transition-colors ${activeFilter === 'watch' ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-amber-100'}">
                        ساعات
                    </button>
                </div>
                <div id="product-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${filteredProducts.map(p => createProductCard(p)).join('')}
                </div>
            </div>
        </div>
    `;
}

// دالة صفحة المنتج
function renderProductPage(product) {
    return `
        <div class="pt-24 pb-12 bg-white min-h-screen">
            <div class="container mx-auto px-4">
                <div class="md:flex gap-12">
                    <div class="md:w-1/2">
                        <img src="${product.images[0]}" alt="${product.name_ar}" class="w-full rounded-xl shadow-lg mb-4" id="main-product-image" />
                        <div class="flex space-x-2">
                            ${product.images.map(img => `<img src="${img}" alt="thumbnail" class="w-20 h-20 rounded-lg object-cover border-2 border-transparent hover:border-amber-700 transition-colors thumbnail-img cursor-pointer" data-src="${img}" />`).join('')}
                        </div>
                    </div>
                    <div class="md:w-1/2 mt-8 md:mt-0 product-detail-box bg-white p-6 rounded-xl shadow-lg">
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${product.name_ar}</h1>
                        <p class="text-3xl font-bold text-amber-700 mb-6">${product.price.toFixed(2)} درهم</p>
                        
                        <div class="mb-6">
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">وصف المنتج</h3>
                            <p class="text-gray-600 leading-relaxed">${product.description_ar}</p>
                        </div>
                        
                        <div class="flex items-center space-x-4 mb-6">
                            <input type="number" id="product-quantity" value="1" min="1" class="w-20 p-2 text-center border rounded-md">
                            <button data-action="add-to-cart" data-id="${product.id}" class="flex-1 bg-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-amber-600 transition-colors">
                                أضف إلى السلة
                            </button>
                        </div>
                        <a href="https://wa.me/212642163643?text=السلام عليكم، أرغب في طلب منتج ${product.name_ar}." class="w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-full shadow-lg hover:bg-emerald-500 transition-colors flex items-center justify-center">
                            <i class="fab fa-whatsapp ml-2"></i>
                            اطلب الآن عبر واتساب
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// دالة صفحة السلة
function renderCartPage() {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = cart.length > 0 ? (subtotal >= 300 ? 0 : 30.00) : 0;
    const total = subtotal + shipping;

    const cartItemsHtml = cart.length === 0 ? `<p class="text-lg text-gray-600 text-center">عربة التسوق فارغة</p>` : `
        <div class="lg:flex lg:space-x-8">
            <div class="flex-1">
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <h3 class="text-2xl font-bold mb-4">عربة التسوق</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-center">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="py-2">المنتج</th>
                                    <th class="py-2">السعر</th>
                                    <th class="py-2">الكمية</th>
                                    <th class="py-2">المجموع</th>
                                    <th class="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cart.map(item => `
                                    <tr class="border-b border-gray-100">
                                        <td class="py-4 flex items-center justify-start">
                                            <img src="${item.images[0]}" alt="${item.name_ar}" class="w-16 h-16 object-cover rounded-lg ml-4" />
                                            <span>${item.name_ar}</span>
                                        </td>
                                        <td class="py-4">${item.price.toFixed(2)} درهم</td>
                                        <td class="py-4">
                                            <div class="flex items-center justify-center space-x-2">
                                                <button data-action="update-quantity" data-id="${item.id}" data-type="decrease" class="bg-gray-200 p-1 rounded-full text-gray-700 hover:bg-gray-300">
                                                    <i class="fas fa-minus"></i>
                                                </button>
                                                <span>${item.quantity}</span>
                                                <button data-action="update-quantity" data-id="${item.id}" data-type="increase" class="bg-gray-200 p-1 rounded-full text-gray-700 hover:bg-gray-300">
                                                    <i class="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td class="py-4">${(item.price * item.quantity).toFixed(2)} درهم</td>
                                        <td class="py-4">
                                            <button data-action="remove-from-cart" data-id="${item.id}" class="text-red-500 hover:text-red-700">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="lg:w-1/3 mt-8 lg:mt-0 checkout-box bg-gray-100 p-6 rounded-xl shadow-lg h-fit">
                <h3 class="text-2xl font-bold mb-4">ملخص الطلب</h3>
                <div class="flex justify-between mb-2">
                    <span>المجموع الفرعي:</span>
                    <span>${subtotal.toFixed(2)} درهم</span>
                </div>
                <div class="flex justify-between mb-4 border-b pb-4">
                    <span>تكلفة الشحن:</span>
                    <span>${shipping.toFixed(2)} درهم</span>
                </div>
                <div class="flex justify-between font-bold text-xl mb-4">
                    <span>الإجمالي:</span>
                    <span>${total.toFixed(2)} درهم</span>
                </div>
                <a href="#" data-action="checkout-whatsapp" class="w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-full shadow-lg hover:bg-emerald-500 transition-colors flex items-center justify-center">
                    <i class="fab fa-whatsapp ml-2"></i>
                    أرسل الطلب عبر واتساب
                </a>
            </div>
        </div>
    `;
}

// دالة صفحة من نحن
function renderAboutPage() {
    return `
        <div class="pt-24 pb-12 bg-white min-h-screen">
            <div class="container mx-auto px-4 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-8">من نحن</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    مرحباً بك في AzikiStore، حيث تلتقي الأصالة العربية بالفخامة العصرية.
                    نحن متخصصون في تقديم أفخم العطور الشرقية والساعات الرجالية والنسائية الأنيقة،
                    المختارة بعناية لتناسب ذوقك الرفيع. مهمتنا هي أن نقدم لك منتجات عالية الجودة
                    تجسد الجمال والأناقة، مع تجربة تسوق مريحة وموثوقة.
                </p>
            </div>
        </div>
    `;
}

// وظائف إضافية
function startHeroSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

function startCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    function updateTimer() {
        const now = new Date().getTime();
        const distance = discountEndTime - now;

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            timerElement.innerHTML = `<span>انتهى العرض</span>`;
        } else {
            timerElement.innerHTML = `
                <span>${minutes.toString().padStart(2, '0')}</span> :
                <span>${seconds.toString().padStart(2, '0')}</span>
            `;
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Event Listeners (تُدار عبر تفويض الأحداث)
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderPage();

    if (closeButton) {
        closeButton.onclick = () => { modal.style.display = "none"; };
    }
    window.onclick = e => {
        if (e.target === modal) { modal.style.display = "none"; }
    };
});

document.addEventListener('click', e => {
    const target = e.target;
    const action = target.dataset.action || target.closest('[data-action]')?.dataset.action;
    const id = target.dataset.id || target.closest('[data-id]')?.dataset.id;
    const type = target.dataset.type;
    const page = target.dataset.page || target.closest('[data-page]')?.dataset.page;
    const filter = target.dataset.filter || target.closest('[data-filter]')?.dataset.filter;

    if (page) {
        currentPage = page;
        renderPage();
        return;
    }

    switch (action) {
        case 'view-product':
            selectedProduct = products.find(p => p.id == id);
            currentPage = 'product';
            renderPage();
            break;
        case 'quick-add':
            const productToAdd = products.find(p => p.id == id);
            if (productToAdd) {
                addToCart(productToAdd);
            }
            break;
        case 'add-to-cart':
            const quantity = parseInt(document.getElementById('product-quantity')?.value) || 1;
            const product = products.find(p => p.id == id);
            if (product) {
                addToCart(product, quantity);
            }
            break;
        case 'remove-from-cart':
            cart = cart.filter(item => item.id != id);
            updateCartCount();
            saveCart();
            renderPage();
            break;
        case 'update-quantity':
            const item = cart.find(i => i.id == id);
            if (!item) return;

            let newQuantity = item.quantity;
            if (type === 'increase') {
                newQuantity++;
            } else if (type === 'decrease' && newQuantity > 1) {
                newQuantity--;
            }
            item.quantity = newQuantity;
            updateCartCount();
            saveCart();
            renderPage();
            break;
        case 'checkout-whatsapp':
            let whatsappMessage = `مرحباً، أود طلب المنتجات التالية:\n`;
            let total = 0;
            cart.forEach(item => {
                whatsappMessage += ` - ${item.name_ar} (الكمية: ${item.quantity}) - السعر: ${item.price.toFixed(2)} درهم\n`;
                total += item.price * item.quantity;
            });
            const shippingCost = total >= 300 ? 0 : 30;
            whatsappMessage += `\nالمجموع الفرعي: ${total.toFixed(2)} درهم\n`;
            whatsappMessage += `تكلفة الشحن: ${shippingCost.toFixed(2)} درهم\n`;
            whatsappMessage += `الإجمالي: ${(total + shippingCost).toFixed(2)} درهم\n`;
            whatsappMessage = encodeURIComponent(whatsappMessage);
            window.open(`https://wa.me/212642163643?text=${whatsappMessage}`, '_blank');
            break;
        case 'filter':
            activeFilter = filter;
            renderPage();
            break;
    }
});

document.getElementById('cart-button').addEventListener('click', () => {
    currentPage = 'cart';
    renderPage();
});