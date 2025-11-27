const dataUrl = './assets/db/shopee.json'

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

// Render promotions
function renderPromotions() {
    const promotionsBanner = document.getElementById('promotionsBanner');
    if (!promotionsBanner) return;
    
    const htmls = virtualPromotions.map(function(promo) {
        return `
            <div class="promotion-card" style="background: ${promo.color};">
                <div class="promotion-badge">${promo.badge}</div>
                <h3 class="promotion-title">${promo.title}</h3>
                <p class="promotion-desc">${promo.desc}</p>
                <p class="promotion-discount">${promo.discount}</p>
            </div>
        `;
    });
    
    promotionsBanner.innerHTML = htmls.join('');
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

// Initialize promotions and sellers on page load
document.addEventListener('DOMContentLoaded', function() {
    renderPromotions();
    renderSellerProducts();
});

fetch(dataUrl)
    .then(response => response.json())
    .then(renderItem)
    .then(responsive)
    .then(handlePagination)

function shuffer(){
    fetch(dataUrl)
        .then(response => response.json())
        .then(list => {
            list = list.sort(() => Math.random() - 0.5)
            return list;
        })
        .then(renderItem)
        .then(responsive)
        .then(handlePagination)
}

// main product

function renderItem(items) {
    var listProduct = document.getElementById('list-product');
    var htmls = items.map(function (item) {
        return `
        <div data="${item.id}" class="col l-2-4 m-3 c-6 home-product-item">
            <a class="home-product-item-link" href="#">
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
                            <input type="checkbox" id="heart-save-${item.id}">
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
                <div class="home-product-item-footer">Tìm sản phẩm tương tự</div>
            </a>
        </div>`;
    })
    listProduct.innerHTML = htmls.join('');
    return items;
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
