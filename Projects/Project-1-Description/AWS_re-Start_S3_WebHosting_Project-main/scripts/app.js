/**
 * L'Aura Bistro - Core App Engine (Vanilla JS)
 * This global module initializes the localStorage database, manages session states,
 * and handles UI sync like navigation items and cart quantity badges dynamically.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize persistent storage schema if empty
    initLocalStorage();

    // 2. Refresh dynamic navbar badges and menus
    syncNavbar();

    // 3. Initialize any Lucide icons present on the page
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

/**
 * Initializes default localStorage schema matching the requested session model.
 */
function initLocalStorage() {
    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify({
            loggedIn: false,
            name: ""
        }));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

/**
 * Checks if user is currently authenticated.
 * @returns {boolean}
 */
function isUserLoggedIn() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
        const user = JSON.parse(userStr);
        return user && user.loggedIn === true;
    } catch (e) {
        return false;
    }
}

/**
 * Retrieves currently logged in user info.
 * @returns {Object}
 */
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user')) || { loggedIn: false, name: "" };
    } catch (e) {
        return { loggedIn: false, name: "" };
    }
}

/**
 * Updates navbar display nodes relative to active session state.
 */
function syncNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const isSubpage = window.location.pathname.includes('/pages/');
    const pfx = isSubpage ? '../' : '';
    
    // Deduce current filename to highlight active nav item
    const pathParts = window.location.pathname.split('/');
    const currentFile = pathParts[pathParts.length - 1] || 'index.html';
    
    const user = getCurrentUser();
    const loggedIn = user.loggedIn;
    
    // Build nav items active flags
    const homeActive = (currentFile === 'index.html' || currentFile === '') ? 'active' : '';
    const menuActive = (currentFile === 'menu.html' || currentFile === 'product-details.html') ? 'active' : '';
    const reservationsActive = (currentFile === 'reservations.html') ? 'active' : '';
    const ordersActive = (currentFile === 'orders-history.html') ? 'active' : '';
    
    // Build Cart badge count
    let cartCount = 0;
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cartCount = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
    } catch(e) {}
    
    const cartBadgeStyle = cartCount > 0 ? 'display: flex;' : 'display: none;';
    
    // Build header HTML dynamically
    navbar.innerHTML = `
      <div class="navbar-container">
        <a href="${pfx}index.html" class="logo">
          <span class="logo-text">
            <span class="logo-white" style="color: #ffffff; font-weight:700;">ZANI'S</span> 
            <span class="logo-gold" style="color: var(--accent-gold); font-weight:700;">EATERY</span>
          </span>
        </a>
        
        <nav class="nav-links">
          <a href="${pfx}index.html" class="nav-item ${homeActive}">Home</a>
          <a href="${pfx}pages/menu.html" class="nav-item ${menuActive}">Menu</a>
          <a href="${pfx}index.html#about-us" class="nav-item">About Us</a>
          <a href="${pfx}index.html#contacts" class="nav-item">Contacts</a>
          <a href="${pfx}pages/reservations.html" class="nav-item ${reservationsActive}">Reservations</a>
          <a href="${pfx}pages/orders-history.html" class="nav-item ${ordersActive} ${!loggedIn ? 'nav-disabled' : ''}" id="nav-orders-link">Orders</a>
        </nav>

        <div class="nav-actions">
          <a href="${pfx}pages/orders.html" class="cart-anchor ${!loggedIn ? 'nav-disabled' : ''} ${currentFile === 'orders.html' ? 'active' : ''}" id="nav-cart-link" title="View Dining Selection">
            <i data-lucide="shopping-cart" class="cart-icon"></i>
            <span class="cart-badge" id="cart-badge" style="${cartBadgeStyle}">${cartCount}</span>
          </a>
          <div id="navbar-auth-container" class="auth-box"></div>
        </div>
      </div>
    `;

    // Populate Auth box inside header
    const authContainer = document.getElementById('navbar-auth-container');
    if (authContainer) {
        if (loggedIn) {
            authContainer.innerHTML = `
                <div class="user-profile-menu" style="position: relative; display: inline-block;">
                    <style>
                        .dropdown-item:hover:not(.disabled) {
                            background: rgba(212, 175, 55, 0.08) !important;
                            color: var(--accent-gold) !important;
                        }
                    </style>
                    <div id="profile-dropdown-trigger" style="display: flex; align-items: center; gap: 6px; color: var(--text-primary); font-size: 0.85rem; cursor: pointer; padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.01); transition: all var(--transition-smooth); user-select: none;">
                        <i data-lucide="user" class="nav-icon" style="color: var(--accent-gold); width: 14px; height: 14px;"></i>
                        Hi, <strong>${escapeHTML(user.name)}</strong>
                        <i data-lucide="chevron-down" style="width: 12px; height: 12px; color: var(--text-muted); margin-left: 2px;"></i>
                    </div>
                    
                    <div id="profile-dropdown-menu" class="dropdown-menu-list" style="position: absolute; right: 0; top: 100%; margin-top: 0.65rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-top: 2.5px solid var(--accent-gold); border-radius: var(--radius-sm); padding: 0.4rem 0; width: 190px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 10000; display: none; flex-direction: column;">
                        <a href="${pfx}pages/dashboard-custom.html" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 0.65rem 1.25rem; color: #ffffff; font-size: 0.82rem; text-decoration: none; transition: all 0.15s; font-family: var(--font-sans); text-align: left;">
                            <i data-lucide="layout-dashboard" style="width: 14px; height: 14px; color: var(--accent-gold);"></i> Dashboard
                        </a>
                        <div class="dropdown-item disabled" style="display: flex; align-items: center; gap: 8px; padding: 0.65rem 1.25rem; color: var(--text-muted); font-size: 0.82rem; cursor: not-allowed; opacity: 0.45; user-select: none; font-family: var(--font-sans); text-align: left;" title="This option is disabled under executive commands">
                            <i data-lucide="user-cog" style="width: 14px; height: 14px;"></i> Account Master
                        </div>
                        <div class="dropdown-item disabled" style="display: flex; align-items: center; gap: 8px; padding: 0.65rem 1.25rem; color: var(--text-muted); font-size: 0.82rem; cursor: not-allowed; opacity: 0.45; user-select: none; font-family: var(--font-sans); text-align: left;" title="This option is disabled under executive commands">
                            <i data-lucide="award" style="width: 14px; height: 14px;"></i> Kasi Club Status
                        </div>
                        <div style="height: 1px; background: var(--border-color); margin: 0.4rem 0;"></div>
                        <button id="nav-logout-btn" class="dropdown-item" style="display: flex; align-items: center; gap: 8px; padding: 0.65rem 1.25rem; color: var(--accent-rose); font-size: 0.82rem; border: none; background: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.15s; font-family: var(--font-sans); font-weight: 500;">
                            <i data-lucide="log-out" style="width: 14px; height: 14px; color: var(--accent-rose);"></i> Sign Out
                        </button>
                    </div>
                </div>
            `;

            const trigger = document.getElementById('profile-dropdown-trigger');
            const menu = document.getElementById('profile-dropdown-menu');
            if (trigger && menu) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = menu.style.display === 'flex';
                    menu.style.display = isOpen ? 'none' : 'flex';
                    trigger.style.borderColor = isOpen ? 'rgba(255,255,255,0.05)' : 'var(--accent-gold)';
                });
                
                document.addEventListener('click', () => {
                    menu.style.display = 'none';
                    trigger.style.borderColor = 'rgba(255,255,255,0.05)';
                });
            }

            const logoutBtn = document.getElementById('nav-logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        } else {
            authContainer.innerHTML = `
                <a href="${pfx}pages/login.html" class="btn-primary flex-items align-center gap-1.5" style="padding: 0.5rem 1.25rem; font-size: 0.85rem; border-radius: var(--radius-sm);">
                    <i data-lucide="log-in" style="width: 14px; height: 14px;"></i> Sign In
                </a>
            `;
        }
    }

    // Block disabled elements if user tries to click them
    const disabledLinks = navbar.querySelectorAll('.nav-disabled');
    disabledLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            alert('Authentication required. You must sign in to view your Orders or Cart.', () => {
                window.location.href = `${pfx}pages/login.html`;
            });
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Logs out the current patron and refreshes page.
 */
function logoutUser() {
    localStorage.setItem('user', JSON.stringify({
        loggedIn: false,
        name: ""
    }));
    // Note: Empties cart only if requested - let's preserve the cart for next user login, or clear it. 
    // Let's clear the cart upon logout so registration or next session starts fresh.
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Redirect to home page or reload
    const isSubpage = window.location.pathname.includes('/pages/');
    const homeUrl = isSubpage ? '../index.html' : 'index.html';
    alert('Logged out successfully.', () => {
        window.location.href = homeUrl;
    });
}

/**
 * Safely escapes dynamic HTML values to avoid XSS vulnerabilities
 */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function resolveImageUrl(url, isSubpage) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (isSubpage) {
        return url.startsWith('../') ? url : '../' + url;
    } else {
        return url.startsWith('../') ? url.substring(3) : url;
    }
}

// Inject custom alert modal styles globally
if (typeof document !== 'undefined') {
    const styleId = 'zani-alert-global-styles';
    if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.textContent = `
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideUp {
            from { transform: scale(0.94) translateY(15px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          .custom-modal-fade-in {
            animation: modalFadeIn 0.2s ease-out forwards;
          }
          .custom-modal-slide-up {
            animation: modalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `;
        document.head.appendChild(styleEl);
    }
}

// Overwrite default alert with cohesive, beautiful, dismissible gold modal alerts
window.alert = function(message, onDismiss) {
    const modalId = 'global-custom-alert-modal';
    
    // Remove if already exists
    const oldModal = document.getElementById(modalId);
    if (oldModal) oldModal.remove();

    const lgText = String(message || '');
    const lines = lgText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let bodyHTML = '';
    
    lines.forEach(line => {
        if (line.startsWith('Reference:') || line.startsWith('Table:') || line.startsWith('Date:') || line.startsWith('Password:')) {
            const parts = line.split(':');
            const label = parts[0];
            const val = parts.slice(1).join(':');
            bodyHTML += `<div style="text-align: left; margin: 0.4rem auto; max-width: 340px; font-size: 0.88rem; background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-left: 2px solid var(--accent-gold); border-radius: 2px" class="font-mono"><strong style="color:var(--accent-gold);">${label}:</strong> ${val}</div>`;
        } else {
            bodyHTML += `<p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.65rem;">${line}</p>`;
        }
    });

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'custom-modal-fade-in';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    modal.style.backdropFilter = 'blur(10px)';
    modal.style.webkitBackdropFilter = 'blur(10px)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '999999';

    modal.innerHTML = `
        <div class="custom-modal-slide-up" style="background: var(--gray-900); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 2.5rem 2rem; max-width: 480px; width: 90%; text-align: center; box-shadow: var(--shadow-xl); position: relative; border-top: 4px solid var(--accent-gold);">
            <button id="alert-close-x" style="position: absolute; right: 1.25rem; top: 1.25rem; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s;"><i data-lucide="x" style="width: 20px; height: 20px;"></i></button>
            <div style="background: rgba(197, 168, 128, 0.08); width: 62px; height: 62px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; border: 1px solid rgba(197, 168, 128, 0.2);">
                <i data-lucide="bell" style="width: 28px; height: 28px; color: var(--accent-gold);"></i>
            </div>
            <h3 class="font-serif" style="font-size: 1.45rem; color: #ffffff; margin-bottom: 0.75rem; font-weight: 500;">Bistro Chronicle Notice</h3>
            <div style="margin-bottom: 2rem; max-height: 240px; overflow-y: auto; padding: 0 0.5rem;">
                ${bodyHTML}
            </div>
            <button id="alert-btn-dismiss" class="btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm); border: none; background: var(--accent-gold); color: #000000; transition: background var(--transition-normal);">
                Acknowledge & Continue
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Setup Lucide icons inside modal
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const performDismiss = () => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.2s ease-out';
        setTimeout(() => {
            modal.remove();
            if (typeof onDismiss === 'function') {
                onDismiss();
            }
        }, 200);
    };

    modal.querySelector('#alert-close-x').addEventListener('click', performDismiss);
    modal.querySelector('#alert-btn-dismiss').addEventListener('click', performDismiss);
    modal.addEventListener('click', (ev) => {
        if (ev.target === modal) performDismiss();
    });
};

// Make functions globally available for other scripts
window.initLocalStorage = initLocalStorage;
window.isUserLoggedIn = isUserLoggedIn;
window.getCurrentUser = getCurrentUser;
window.syncNavbar = syncNavbar;
window.logoutUser = logoutUser;
window.escapeHTML = escapeHTML;
window.resolveImageUrl = resolveImageUrl;

// Universal High-Quality Gourmet Products Catalog (Offline-first resilient source)
window.ZANI_MENU_ITEMS = [
  {
    "id": "item-01",
    "name": "Zani’s Monster Double Burger",
    "description": "Double decker premium Wagyu beef patties basted in our secret glaze, layered with melted double cheddar, fresh crisp lettuce, ripe tomatoes, and red onions on a toasted brioche bun, served with rustic skin-on fries.",
    "category": "Mains",
    "price": 165.00,
    "rating": 5.0,
    "isVegetarian": false,
    "isPopular": true,
    "imageUrl": "../resources/images/image_1.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-02",
    "name": "Zani’s Signature Feast Platter",
    "description": "The ultimate carnivore combo: a flame-grilled beef burger, tender quarter chicken marinated in secret spices, artisan gourmet sausage cuts, served over crispy hand-cut chips, basted with premium relish and accompanied by our signature chef's pink dip.",
    "category": "Mains",
    "price": 195.00,
    "rating": 4.9,
    "isVegetarian": false,
    "isPopular": true,
    "imageUrl": "../resources/images/image_2.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-03",
    "name": "Bistro Gourmet Wrap Combo",
    "description": "Grilled marinated chicken breast chunks, wrapped snugly in a toasted soft tortilla wrap with fresh shredded greens and garlic sauce, alongside sizzling golden fries, peri-peri wings, and cheese sauce.",
    "category": "Mains",
    "price": 145.00,
    "rating": 4.8,
    "isVegetarian": false,
    "isPopular": true,
    "imageUrl": "../resources/images/image_3.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-04",
    "name": "Eatery Flame-Grilled Wings",
    "description": "Eight flame-licked buffalo chicken wings glazed in our sweet and tangy Zani sauce, served over golden fries with spicy dipping aioli.",
    "category": "Mains",
    "price": 115.00,
    "rating": 4.7,
    "isVegetarian": false,
    "isPopular": false,
    "imageUrl": "../resources/images/image_4.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-05",
    "name": "Zani’s Waffle Cone & Ice Cream",
    "description": "A delightful deconstructed dessert tray featuring premium vanilla bean and milk gelato scoops, mini crunchy waffle sections, edible sugar cones, and a drizzle of warm dark Belgian chocolate sauce.",
    "category": "Desserts",
    "price": 85.00,
    "rating": 4.9,
    "isVegetarian": true,
    "isPopular": true,
    "imageUrl": "../resources/images/image_5.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-06",
    "name": "Zani's Classic Oreo Shakes",
    "description": "Our famous triple-thick milkshakes blended with premium cookies-and-cream ice cream, topped with clouds of fresh whipped cream, rich chocolate syrup, and a whole crunchy Oreo cookie.",
    "category": "Beverages",
    "price": 65.00,
    "rating": 5.0,
    "isPopular": true,
    "isVegetarian": true,
    "imageUrl": "../resources/images/image_6.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-07",
    "name": "Gourmet Ribs & Double Patty Combo",
    "description": "Three basted pork loin ribs paired with a double-stack cheddar cheese burger and golden rustic french fries. Ultimate satiety guaranteed.",
    "category": "Mains",
    "price": 220.00,
    "rating": 4.9,
    "isPopular": false,
    "isVegetarian": false,
    "imageUrl": "../resources/images/image_7.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-08",
    "name": "Bistro Sunset Mocktail",
    "description": "A carbonated tropical mixture of fresh passion fruit pulp, squeezed lemonade, organic orange nectar, and a splash of wild rose syrup, served ice-cold.",
    "category": "Beverages",
    "price": 55.00,
    "rating": 4.8,
    "isPopular": false,
    "isVegetarian": true,
    "imageUrl": "../resources/images/image_8.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=500&q=80"
  },
  {
    "id": "item-09",
    "name": "Fresh Berry Sparkler",
    "description": "A sparkling refreshing crush of organic summer strawberries, wild blueberries, freshly sprigged mint leaves, lime slices, and tonic water.",
    "category": "Beverages",
    "price": 50.00,
    "rating": 4.7,
    "isPopular": false,
    "isVegetarian": true,
    "imageUrl": "../resources/images/image_9.jpeg",
    "alternateUrl": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80"
  }
];

function normalizeResourcePath(path) {
  if (!path || !path.startsWith('../resources/')) return path;
  const isSubpage = window.location.pathname.includes('/pages/');
  return isSubpage ? path : path.replace('../', '');
}

window.ZANI_MENU_ITEMS = window.ZANI_MENU_ITEMS.map((item) => ({
  ...item,
  imageUrl: normalizeResourcePath(item.imageUrl),
}));
