const dataUrl = './assets/db/shopee.json'

const DEFAULT_FILTERS = {
    search: '',
    minPrice: null,
    maxPrice: null,
    origin: '',
    promoTag: ''
};

let currentFilters = { ...DEFAULT_FILTERS };
let allProducts = [];

// Virtual data for promotions (no database needed)
const virtualPromotions = [
    {
        id: 1,
        title: 'Giảm giá 50%',
        desc: 'Áp dụng cho tất cả sản phẩm',
        discount: '50%',
        badge: 'Hot',
        color: 'linear-gradient(135deg, #ff6b00 0%, #ee4d2d 100%)'
    },
    {
        id: 2,
        title: 'Mua 2 Tặng 1',
        desc: 'Chương trình đặc biệt hôm nay',
        discount: 'Mua 2 Tặng 1',
        badge: 'New',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 3,
        title: 'Freeship Toàn Quốc',
        desc: 'Miễn phí vận chuyển cho đơn từ 100k',
        discount: 'Freeship',
        badge: 'Free',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        id: 4,
        title: 'Flash Sale',
        desc: 'Giảm sốc đến 70%',
        discount: '70%',
        badge: 'Flash',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
];

// Virtual data for sellers (no database needed)
const virtualSellers = [
    {
        id: 1,
        name: 'Shop Tech Pro',
        avatar: './assets/img/user.png',
        rating: 5,
        products: '1.2k',
        badge: 'Mall'
    },
    {
        id: 2,
        name: 'Gaming Store',
        avatar: './assets/img/user.png',
        rating: 5,
        products: '856',
        badge: 'Yêu thích'
    },
    {
        id: 3,
        name: 'Electronics Hub',
        avatar: './assets/img/user.png',
        rating: 4,
        products: '2.1k',
        badge: 'Mall'
    },
    {
        id: 4,
        name: 'Computer World',
        avatar: './assets/img/user.png',
        rating: 5,
        products: '945',
        badge: 'Yêu thích'
    },
    {
        id: 5,
        name: 'Tech Solutions',
        avatar: './assets/img/user.png',
        rating: 4,
        products: '1.5k',
        badge: 'Mall'
    },
    {
        id: 6,
        name: 'Digital Store',
        avatar: './assets/img/user.png',
        rating: 5,
        products: '678',
        badge: 'Yêu thích'
    }
];

function priceToNumber(value) {
    if (typeof value === 'number') return value;
    return Number((value || '').toString().replace(/[^\d]/g, '')) || 0;
}

function updateCartCount() {
    const cartCount = document.querySelector('.header__cart-count');
    const items = ShopeeApp ? ShopeeApp.getCart() : (JSON.parse(localStorage.getItem('shopeeCart')) || []);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
    renderMiniCart(items);
}

function renderMiniCart(items) {
    const emptyState = document.querySelector('.header__cart-list.no-cart');
    const filledState = document.querySelector('.header__cart-list.has-cart');
    const listWrapper = filledState ? filledState.querySelector('.header__cart-list-item') : null;

    if (!emptyState || !filledState || !listWrapper) {
        return;
    }

    if (!items.length) {
        emptyState.style.display = 'block';
        filledState.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    filledState.style.display = 'block';
    const html = items.slice(0, 5).map(item => `
        <li class="header__cart-item">
            <img src="${item.image}" class="header__cart-item-img" alt="${item.name}">
            <div class="header__cart-item-info">
                <div class="header__cart-item-heading">
                    <h3 class="header__cart-item-name">${item.name}</h3>
                    <p class="header__cart-item-price">${ShopeeApp.formatCurrency(item.price)}</p>
                </div>
                <div class="header__cart-item-body">
                    <p class="header__cart-item-number">x ${item.quantity}</p>
                    <div class="header__cart-item-close" data-mini-remove="${item.id}">
                        Xoá
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
        </li>
    `).join('');
    listWrapper.innerHTML = html;

    listWrapper.querySelectorAll('[data-mini-remove]').forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const id = this.getAttribute('data-mini-remove');
            ShopeeApp.removeCartItem(id);
            updateCartCount();
            ShopeeApp.toast('Đã xóa sản phẩm khỏi giỏ', 'success');
        });
    });
}

function addToCart(product) {
    const result = ShopeeApp.addToCartItem(product, 1);
    if (result.ok) {
        updateCartCount();
        showNotification('Đã thêm vào giỏ hàng!');
    } else {
        showNotification(result.reason || 'Không thể thêm sản phẩm', 'error');
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    const background = type === 'error' ? '#dc3545' : '#4caf50';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${background};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Render promotions
function renderPromotions() {
    const promotionsBanner = document.getElementById('promotionsBanner');
    if (!promotionsBanner) return;
    
    const htmls = virtualPromotions.map(function(promo) {
        return `
            <div class="promotion-card" onclick="handlePromotionClick(${promo.id})" style="background: ${promo.color};">
                <div class="promotion-badge">${promo.badge}</div>
                <h3 class="promotion-title">${promo.title}</h3>
                <p class="promotion-desc">${promo.desc}</p>
                <p class="promotion-discount">${promo.discount}</p>
            </div>
        `;
    });
    
    promotionsBanner.innerHTML = htmls.join('');
}

function handlePromotionClick(promoId) {
    const promo = virtualPromotions.find(p => p.id === promoId);
    if (promo) {
        showNotification(`Áp dụng khuyến mãi: ${promo.title}`);
        // Scroll to products section
        const productsSection = document.querySelector('.home-product');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Render seller products
function renderSellerProducts() {
    const sellerProductsGrid = document.getElementById('sellerProductsGrid');
    if (!sellerProductsGrid) return;
    
    const htmls = virtualSellers.map(function(seller) {
        const stars = Array(seller.rating).fill('<i class="fas fa-star"></i>').join('');
        return `
            <div class="seller-product-card" onclick="window.location.href='./seller-products.html'">
                <img src="${seller.avatar}" alt="${seller.name}" class="seller-shop-avatar">
                <h3 class="seller-shop-name">${seller.name}</h3>
                <div class="seller-shop-rating">
                    ${stars}
                </div>
                <p class="seller-shop-stats">${seller.products} sản phẩm</p>
                <span class="seller-shop-badge">${seller.badge}</span>
            </div>
        `;
    });
    
    sellerProductsGrid.innerHTML = htmls.join('');
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.header__search-input');
    const searchBtn = document.querySelector('.header__search-btn');
    const searchHistory = document.querySelector('.header__search-history');
    
    if (searchInput) {
        // Load search history
        let searchHistoryList = JSON.parse(localStorage.getItem('shopeeSearchHistory') || '[]');
        
        function updateSearchHistory() {
            const historyList = document.querySelector('.header__search-history-list');
            if (historyList && searchHistoryList.length > 0) {
                historyList.innerHTML = searchHistoryList.slice(0, 6).map(term => `
                    <li class="header__search-history-item">
                        <a href="#" onclick="performSearch(event, '${term}')">${term}</a>
                    </li>
                `).join('');
            }
        }
        
        function performSearch(e, term) {
            if (e) e.preventDefault();
            const searchTerm = term || searchInput.value.trim();
            if (!searchTerm) return;
            
            // Add to history
            searchHistoryList = searchHistoryList.filter(t => t !== searchTerm);
            searchHistoryList.unshift(searchTerm);
            searchHistoryList = searchHistoryList.slice(0, 10);
            localStorage.setItem('shopeeSearchHistory', JSON.stringify(searchHistoryList));
            
            currentFilters.search = searchTerm.toLowerCase();
            if (searchInput.value !== searchTerm) {
                searchInput.value = searchTerm;
            }
            applyFilters();
            searchInput.value = searchTerm;
            if (searchHistory) searchHistory.style.display = 'none';
        }
        // expose for inline history links
        window.performSearch = performSearch;
        
        searchInput.addEventListener('focus', function() {
            updateSearchHistory();
            if (searchHistory) searchHistory.style.display = 'block';
        });
        
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                if (searchHistory) searchHistory.style.display = 'none';
            }, 200);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(null, null);
            }
        });
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                performSearch(null, null);
            });
        }
        
        updateSearchHistory();
    }
}

// Category filter
function initCategoryFilters() {
    const categoryCheckboxes = document.querySelectorAll('.category-group-item-check');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyFilters();
        });
    });
}

// Price filter
function initPriceFilter() {
    const priceFilterBtn = document.querySelector('.category-group-filter-btn');
    if (priceFilterBtn) {
        priceFilterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const fromInput = this.parentElement.querySelector('input[placeholder*="TỪ"]');
            const toInput = this.parentElement.querySelector('input[placeholder*="ĐẾN"]');
            const fromPrice = parseInt(fromInput.value.replace(/[^\d]/g, '')) || 0;
            const toPrice = parseInt(toInput.value.replace(/[^\d]/g, '')) || Infinity;
            
            currentFilters.minPrice = fromPrice || null;
            currentFilters.maxPrice = toPrice === Infinity ? null : toPrice;
            const smartMin = document.getElementById('filterPriceMin');
            const smartMax = document.getElementById('filterPriceMax');
            if (smartMin) smartMin.value = currentFilters.minPrice || '';
            if (smartMax) smartMax.value = currentFilters.maxPrice || '';
            applyFilters();
            showNotification('Đã áp dụng bộ lọc giá!');
        });
    }
}

function refreshProducts(items) {
    renderItem(items);
    responsive();
    handlePagination();
}

function applyFilters() {
    if (!allProducts.length) return;
    let items = [...allProducts];
    const { search, minPrice, maxPrice, origin, promoTag } = currentFilters;

    if (search) {
        const needle = search.toLowerCase();
        items = items.filter(p => (p.name || '').toLowerCase().includes(needle));
    }
    if (origin) {
        const originNeedle = origin.toLowerCase();
        items = items.filter(p => (p.origin || '').toLowerCase() === originNeedle);
    }
    if (minPrice !== null) {
        items = items.filter(p => priceToNumber(p.newPrice) >= minPrice);
    }
    if (maxPrice !== null) {
        items = items.filter(p => priceToNumber(p.newPrice) <= maxPrice);
    }
    if (promoTag === 'flash') {
        items = items.filter(p => Number(p.saleOff) >= 30);
    } else if (promoTag === 'freeship') {
        items = items.filter(p => Number(p.saleOff) >= 20);
    } else if (promoTag === 'new') {
        items = items.filter(p => Number(p.id) >= 15);
    }
    refreshProducts(items);
    updateCartCount();
}

function setupSmartFilters() {
    const minInput = document.getElementById('filterPriceMin');
    const maxInput = document.getElementById('filterPriceMax');
    const originSelect = document.getElementById('filterOrigin');
    const chips = document.querySelectorAll('[data-filter-chip]');
    const resetBtn = document.getElementById('filterReset');

    if (minInput) {
        minInput.addEventListener('change', () => {
            const value = parseInt(minInput.value, 10);
            currentFilters.minPrice = Number.isFinite(value) ? value : null;
            applyFilters();
        });
    }
    if (maxInput) {
        maxInput.addEventListener('change', () => {
            const value = parseInt(maxInput.value, 10);
            currentFilters.maxPrice = Number.isFinite(value) ? value : null;
            applyFilters();
        });
    }
    if (originSelect) {
        originSelect.addEventListener('change', () => {
            currentFilters.origin = originSelect.value;
            applyFilters();
        });
    }
    if (chips.length) {
        chips.forEach(chip => {
            chip.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const isActive = this.classList.contains('smart-filter-chip--active');
                chips.forEach(c => c.classList.remove('smart-filter-chip--active'));
                if (isActive) {
                    currentFilters.promoTag = '';
                } else {
                    this.classList.add('smart-filter-chip--active');
                    currentFilters.promoTag = value;
                }
                applyFilters();
            });
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters = { ...DEFAULT_FILTERS };
            if (minInput) minInput.value = '';
            if (maxInput) maxInput.value = '';
            if (originSelect) originSelect.value = '';
            chips.forEach(c => c.classList.remove('smart-filter-chip--active'));
            applyFilters();
        });
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    renderPromotions();
    renderSellerProducts();
    updateCartCount();
    initSearch();
    initCategoryFilters();
    initPriceFilter();
    setupSmartFilters();
});

fetch(dataUrl)
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        applyFilters();
    });

function shuffer(){
    if (!allProducts.length) {
        return;
    }
    allProducts = [...allProducts].sort(() => Math.random() - 0.5);
    applyFilters();
}

// main product
function renderItem(items) {
    var listProduct = document.getElementById('list-product');
    if (!listProduct) return items;
    
    var htmls = items.map(function (item) {
        const isFavorite = JSON.parse(localStorage.getItem('shopeeFavorites') || '[]').includes(item.id);
        const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');
        return `
        <div data="${item.id}" class="col l-2-4 m-3 c-6 home-product-item">
            <a class="home-product-item-link" href="#" onclick="handleProductClick(event, ${itemJson})">
                <div class="home-product-item__img" style="background-image: url(./assets/img/home/${item.id}.PNG);"></div>
                <div class="home-product-item__info">
                    <h4 class="home-product-item__name">${item.name}</h4>
                    <div class="home-product-item__price">
                        <p class="home-product-item__price-old">${item.oldPrice}đ</p>
                        <p class="home-product-item__price-new">${item.newPrice}đ</p>
                        <i class="home-product-item__ship fas fa-shipping-fast"></i>
                    </div>
                    <div class="home-product-item__footer">
                        <div class="home-product-item__save">
                            <input type="checkbox" id="heart-save-${item.id}" ${isFavorite ? 'checked' : ''} onchange="handleFavoriteToggle(event, '${item.id}')">
                            <label for="heart-save-${item.id}" class="far fa-heart"></label>
                        </div>
                        <div class="home-product-item__rating-star">
                            <i class="star-checked far fa-star"></i>
                            <i class="star-checked far fa-star"></i>
                            <i class="star-checked far fa-star"></i>
                            <i class="star-checked far fa-star"></i>
                            <i class="star-uncheck far fa-star"></i>
                        </div>
                        <div class="home-product-item__saled">Đã bán ${item.saled}</div>
                    </div>
                    <div class="home-product-item__origin">${item.origin}</div>
                    <div class="home-product-item__favourite">
                        Yêu thích
                    </div>
                    <div class="home-product-item__sale-off">
                        <div class="home-product-item__sale-off-value">${item.saleOff}%</div>
                        <div class="home-product-item__sale-off-label">GIẢM</div>
                    </div>
                </div>
                <div class="home-product-item-footer" onclick="event.stopPropagation(); addToCartFromProduct(${itemJson})">Thêm vào giỏ hàng</div>
            </a>
        </div>`;
    });
    listProduct.innerHTML = htmls.join('');
    
    // Add click handlers for similar products
    document.querySelectorAll('.home-product-item-footer').forEach(footer => {
        footer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    return items;
}

function handleProductClick(event, product) {
    event.preventDefault();
    // Show product details or add to cart
    addToCart(product);
}

function addToCartFromProduct(product) {
    addToCart(product);
}

function handleFavoriteToggle(event, productId) {
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('shopeeFavorites') || '[]');
    const isChecked = event.target.checked;
    
    if (isChecked) {
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            showNotification('Đã thêm vào yêu thích!');
        }
    } else {
        favorites = favorites.filter(id => id !== productId);
        showNotification('Đã xóa khỏi yêu thích!');
    }
    
    localStorage.setItem('shopeeFavorites', JSON.stringify(favorites));
}

function responsive() {
    var listItem = document.querySelectorAll('.home-product-item');
    var bodyWidth = document.body.clientWidth;
    var listItemLength = listItem.length;
    
    if(bodyWidth < 740) {
        for(var i = listItemLength - 1; i >= Math.floor(listItemLength / 2) * 2; i--) {
            listItem[i].remove();
        }
    }
    else if(bodyWidth < 1024) {
        for(var i = listItemLength - 1; i >= Math.floor(listItemLength / 4) * 4; i--) {
            listItem[i].remove();
        }
    }
}

function checkPageArrow(){
    var paginationLink = document.querySelectorAll('.pagination-item-link');
    if(document.querySelector('.pagination-item--active a').textContent == 1){
        paginationLink[0].classList.add('pagination-item-link--disable');
        if(paginationLink[0].attributes.href){
            paginationLink[0].attributes.removeNamedItem('href');
        }
    }
    else {
        paginationLink[0].classList.remove('pagination-item-link--disable');
        if(!paginationLink[0].attributes.href){
            paginationLink[0].href = '#';
        }
    }
    if (document.querySelector('.pagination-item--active a').textContent == 8){
        paginationLink[6].classList.add('pagination-item-link--disable');
        if(paginationLink[6].attributes.href){
            paginationLink[6].attributes.removeNamedItem('href');
        }
    } 
    else {
        paginationLink[6].classList.remove('pagination-item-link--disable');
        if(!paginationLink[6].attributes.href){
            paginationLink[6].href = '#';
        }
    }
}

function handlePagination(){
    var paginationItem = document.querySelectorAll('.pagination-item');
    var paginationLength = paginationItem.length;
    checkPageArrow();
    for(var i = 0; i < paginationLength; i++){
        if(i != 0 && i != 4 && i != paginationLength - 1){
            // handle active button
            var isActive = document.querySelector('.pagination-item--active a');
            if(isActive.attributes.href){
                isActive.attributes.removeNamedItem('href');
            }
            else {
                var paginationItemLink = document.querySelectorAll('.pagination-item-link');
                paginationItemLink[i].setAttribute('href', '#');
            }
            // handle other button
            paginationItem[1].onclick = function(){
                var content = this.querySelector('a').textContent;
                var paginationItemLink = document.querySelectorAll('.pagination-item-link');
                if(content >= 2){
                    paginationItemLink[1].textContent = Number(paginationItemLink[1].textContent) - 1;
                    paginationItemLink[2].textContent = Number(paginationItemLink[2].textContent) - 1;
                    paginationItemLink[3].textContent = Number(paginationItemLink[3].textContent) - 1;
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    paginationItem[2].classList.add('pagination-item--active');
                    shuffer();
                }
                if(content < 2){
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    this.classList.add('pagination-item--active');
                }
                checkPageArrow();
            }
            paginationItem[2].onclick = function(){
                document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                this.classList.add('pagination-item--active');
                shuffer();
                checkPageArrow();
            }
            paginationItem[3].onclick = function(e){
                var content = this.querySelector('a').textContent;
                var paginationItemLink = document.querySelectorAll('.pagination-item-link');
                if(content < 7){
                    paginationItemLink[1].textContent = Number(paginationItemLink[1].textContent) + 1;
                    paginationItemLink[2].textContent = Number(paginationItemLink[2].textContent) + 1;
                    paginationItemLink[3].textContent = Number(paginationItemLink[3].textContent) + 1;
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    paginationItem[2].classList.add('pagination-item--active');
                    shuffer();
                }
                if(content == 7){
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    this.classList.add('pagination-item--active');
                    e.preventDefault();
                }
                checkPageArrow();
            }
            paginationItem[5].onclick = function(e){
                var content = document.querySelector('.pagination-item--active a').textContent;
                if(content != 8){
                    var paginationItemLink = document.querySelectorAll('.pagination-item-link');
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    this.classList.add('pagination-item--active');
                    paginationItemLink[1].textContent = 5;
                    paginationItemLink[2].textContent = 6;
                    paginationItemLink[3].textContent = 7;
                    shuffer();
                    checkPageArrow();
                }
                else {
                    e.preventDefault();
                }
            }
        }
        else if (i == 0 || i == paginationLength - 1){
            var paginationItemLink = document.querySelectorAll('.pagination-item-link');
            // arrow left
            paginationItem[0].onclick = function(){
                if(document.querySelector('.pagination-item--active a').textContent == 8){
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    paginationItem[3].classList.add('pagination-item--active');
                }
                else if(document.querySelector('.pagination-item--active a').textContent == 2){
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    paginationItem[1].classList.add('pagination-item--active');
                }
                else if(document.querySelector('.pagination-item--active a').textContent > 1){
                    paginationItemLink[1].textContent = Number(paginationItemLink[1].textContent) - 1;
                    paginationItemLink[2].textContent = Number(paginationItemLink[2].textContent) - 1;
                    paginationItemLink[3].textContent = Number(paginationItemLink[3].textContent) - 1;
                    shuffer();
                }
                checkPageArrow();
            }
            // arrow right
            paginationItem[paginationLength - 1].onclick = function(){
                if(document.querySelector('.pagination-item--active a').textContent == 7){
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    paginationItem[5].classList.add('pagination-item--active');
                }
                else if(document.querySelector('.pagination-item--active a').textContent == 1){
                    document.querySelector('.pagination-item--active').classList.remove('pagination-item--active');
                    paginationItem[2].classList.add('pagination-item--active');
                }
                else if(document.querySelector('.pagination-item--active a').textContent < 7){
                    paginationItemLink[1].textContent = Number(paginationItemLink[1].textContent) + 1;
                    paginationItemLink[2].textContent = Number(paginationItemLink[2].textContent) + 1;
                    paginationItemLink[3].textContent = Number(paginationItemLink[3].textContent) + 1;
                    shuffer();
                }
                checkPageArrow();
            }
        }
    }
}

// catagory

var headerCatagoryItem = document.querySelectorAll('.header__sort-item');

for(var i = 0; i < 4; i++){
    headerCatagoryItem[i].onclick = function(){
        var headerCatagoryActive = document.querySelector('.header__sort-item--active');
        headerCatagoryActive.classList.remove('header__sort-item--active');
        this.classList.add('header__sort-item--active');
        shuffer();
    }

}

var mobileCatagoryItem = document.querySelectorAll('.mobile-category-item');

for(var i = 0; i < mobileCatagoryItem.length; i++){
    mobileCatagoryItem[i].onclick = function(){
        shuffer();
    }
}

var homeFilter = document.querySelectorAll('.home-filter-btn');

for(var i = 0; i < 3; i++){
    homeFilter[i].onclick = function(){
        var homeFilterActive = document.querySelector('.home-filter-btn.btn--primary');
        homeFilterActive.classList.remove('btn--primary');
        this.classList.add('btn--primary');
        shuffer();
    }
}

var homeFilterSort = document.querySelectorAll('.home-filter-sort-item-link');

for(var i = 0; i < 2; i++){
    homeFilterSort[i].onclick = function(){
        shuffer();
    }
}

var homeFilterPage = document.querySelectorAll('.home-filter-page-btn');

homeFilterPage[0].onclick = function(){
    var currentPage = document.querySelector('.home-filter-page-now');
    if(currentPage.textContent != 1){
        currentPage.textContent = Number(currentPage.textContent) - 1;
        shuffer();
    }
    if(currentPage.textContent != 14){
        homeFilterPage[1].classList.remove('home-filter-page-btn--disable');
    }
    if(currentPage.textContent == 1){
        homeFilterPage[0].classList.add('home-filter-page-btn--disable');
    }
}
homeFilterPage[1].onclick = function(){
    var currentPage = document.querySelector('.home-filter-page-now');
    if(currentPage.textContent != 14){
        currentPage.textContent = Number(currentPage.textContent) + 1;
        shuffer();
    }
    if(currentPage.textContent != 1){
        homeFilterPage[0].classList.remove('home-filter-page-btn--disable');
    }
    if(currentPage.textContent == 14){
        homeFilterPage[1].classList.add('home-filter-page-btn--disable');
    }
}

// auth modal controller
(function () {
    var modal = document.querySelector('.modal');
    if (!modal) {
        return;
    }

    var authForms = modal.querySelectorAll('.auth-form');
    var triggers = document.querySelectorAll('[data-auth-target]');
    var switchButtons = modal.querySelectorAll('[data-switch-target]');
    var backButtons = modal.querySelectorAll('.auth-form__back');
    var formRegistry = {};
    var currentUser = null;
    var registerTrigger = document.querySelector('[data-auth-target="register"]');
    var loginTrigger = document.querySelector('[data-auth-target="login"]');
    var registerItem = registerTrigger ? registerTrigger.closest('.header__nav-item') : null;
    var loginItem = loginTrigger ? loginTrigger.closest('.header__nav-item') : null;
    var userItem = document.querySelector('[data-auth-user]');
    var userNameLabel = userItem ? userItem.querySelector('[data-user-name]') : null;
    var logoutAction = userItem ? userItem.querySelector('[data-user-logout]') : null;

    authForms.forEach(function (form) {
        var key = form.getAttribute('data-auth-form');
        if (key) {
            formRegistry[key] = form;
        }
    });

    var mockProfiles = {
        register: ['0987654321', 'Demo@1234', 'Demo@1234'],
        login: ['0987654321', 'Demo@1234']
    };

    bindAuthActions('register');
    bindAuthActions('login');
    if (logoutAction) {
        logoutAction.addEventListener('click', function (event) {
            event.preventDefault();
            currentUser = null;
            updateUserNavigation();
        });
    }
    updateUserNavigation();

    function openAuth(target) {
        var type = formRegistry[target] ? target : 'login';
        modal.classList.add('is-open');
        authForms.forEach(function (form) {
            var isActive = form.getAttribute('data-auth-form') === type;
            form.classList.toggle('is-active', isActive);
        });
        prefill(type);
    }

    function closeAuth() {
        modal.classList.remove('is-open');
    }

    function prefill(type) {
        var form = formRegistry[type];
        if (!form) {
            return;
        }
        var values = mockProfiles[type] || [];
        var inputs = form.querySelectorAll('.auth-form__input');
        inputs.forEach(function (input, index) {
            input.value = values[index] || '';
        });
    }

    function bindAuthActions(type) {
        var form = formRegistry[type];
        if (!form) {
            return;
        }
        var primaryBtn = form.querySelector('.auth-form__control .btn.btn--primary');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', function (event) {
                event.preventDefault();
                handleAuthSubmit(type);
            });
        }
        form.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleAuthSubmit(type);
            }
        });
    }

    function handleAuthSubmit(type) {
        var form = formRegistry[type];
        if (!form) {
            return;
        }
        var inputs = form.querySelectorAll('.auth-form__input');
        var identity = inputs[0] ? inputs[0].value.trim() : '';
        var fallback = type === 'register' ? 'Khách mới Shopee' : 'Người dùng Shopee';
        currentUser = {
            name: identity || fallback,
            phone: identity || mockProfiles.login[0],
            type: type
        };
        updateUserNavigation();
        closeAuth();
    }

    function updateUserNavigation() {
        if (currentUser) {
            if (userItem) {
                userItem.classList.add('is-active');
            }
            if (userNameLabel) {
                userNameLabel.textContent = currentUser.name;
            }
            if (registerItem) {
                registerItem.classList.add('header__nav-item--hidden');
            }
            if (loginItem) {
                loginItem.classList.add('header__nav-item--hidden');
            }
        } else {
            if (userItem) {
                userItem.classList.remove('is-active');
            }
            if (registerItem) {
                registerItem.classList.remove('header__nav-item--hidden');
            }
            if (loginItem) {
                loginItem.classList.remove('header__nav-item--hidden');
            }
        }
    }

    triggers.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            openAuth(btn.getAttribute('data-auth-target'));
        });
    });

    switchButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            openAuth(btn.getAttribute('data-switch-target'));
        });
    });

    backButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            closeAuth();
        });
    });

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeAuth();
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape') {
            closeAuth();
        }
    });
})();
