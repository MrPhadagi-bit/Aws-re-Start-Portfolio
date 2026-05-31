/**
 * L'Aura Bistro - Cart and Product Manager (Vanilla JS)
 * This script manages catalog interactions, handles parameter-based routing for item details,
 * manages item quantities (plus/minus), governs cart actions, handles delivery/pickup status,
 * and compiles orders during checkout.
 */

const DELIVERY_FEE = 45.00; // Value in South African Rand (ZAR)

document.addEventListener('DOMContentLoaded', async () => {
    // Determine context path depth
    const isSubpage = window.location.pathname.includes('/pages/');
    const menuJsonPath = isSubpage ? '../data/menu.json' : 'data/menu.json';

    // Parse URL parameter if on product-details page
    if (window.location.pathname.includes('product-details.html')) {
        await initProductDetailsPage(menuJsonPath);
    }

    // Inspect if on orders.html (cart & checkout page)
    if (window.location.pathname.includes('orders.html')) {
        await initCartCheckoutPage(menuJsonPath);
    }
});

/**
 * PRODUCT DETAILS MODULE
 * Fetches products from menu.json, resolves matching parameter id, and populates views.
 */
async function initProductDetailsPage(menuJsonPath) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        renderProductError("No Product Identifier Provided in URL.");
        return;
    }

    try {
        // Use the highly resilient global array as primary
        let databaseItems = window.ZANI_MENU_ITEMS || [];
        if (databaseItems.length === 0) {
            const response = await fetch(menuJsonPath);
            if (response.ok) {
                const database = await response.json();
                databaseItems = database.items || [];
            }
        }
        const product = databaseItems.find(item => item.id === productId);

        if (!product) {
            renderProductError("The requested culinary artwork could not be found in our menu.");
            return;
        }

        renderProductDetails(product);
    } catch (e) {
        console.error(e);
        const databaseItems = window.ZANI_MENU_ITEMS || [];
        const product = databaseItems.find(item => item.id === productId);
        if (product) {
            renderProductDetails(product);
        } else {
            renderProductError("Connection Error. Unable to fetch dining records.");
        }
    }
}

/**
 * Renders errors on product detail page screen.
 */
function renderProductError(msg) {
    const container = document.getElementById('product-details-container');
    if (container) {
        container.innerHTML = `
            <div class="card error-card text-center" style="max-width:600px; margin:4rem auto; padding:3rem;">
                <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--accent-gold); margin:0 auto 1.5rem;"></i>
                <h2 style="margin-bottom:1rem;">Artwork Not Found</h2>
                <p style="color:var(--text-secondary); margin-bottom:2rem;">${escapeHTML(msg)}</p>
                <a href="menu.html" class="btn-primary">Return to Menu Grid</a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }
}

/**
 * Sets values in DOM for active product on the product details page.
 */
function renderProductDetails(product) {
    const imgEl = document.getElementById('product-image');
    const nameEl = document.getElementById('product-name');
    const priceEl = document.getElementById('product-price');
    const descEl = document.getElementById('product-description');
    const catEl = document.getElementById('product-category');
    const ratingEl = document.getElementById('product-rating');
    const popularityEl = document.getElementById('product-popularity');
    
    // Fallback descriptors if empty or standard lorem ipsum is needed
    const defaultDescription = `A meticulously curated dish by our masterful Executive Chef, showcasing elegant culinary harmony. We balance exquisite organic components with artisanal techniques to orchestrate an unforgettable dining encounter. Served piping hot to order with seasonal flourishes. Premium, locally sourced ingredients form the bedrock of this masterpiece.`;

    if (imgEl) {
        imgEl.src = product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
        imgEl.alt = product.name;
    }
    if (nameEl) nameEl.textContent = product.name;
    if (priceEl) priceEl.textContent = `R ${product.price.toFixed(2)}`;
    if (descEl) descEl.textContent = product.description || defaultDescription;
    if (catEl) {
        catEl.textContent = product.category;
        catEl.className = `category-tag tag-${product.category.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    if (ratingEl) {
        ratingEl.innerHTML = `
            <span class="rating-badge flex-items align-center">
                <i data-lucide="star" style="fill: var(--accent-gold); stroke: var(--accent-gold); width: 14px; height: 14px;"></i>
                <span class="font-mono text-white text-semibold ml-1">${product.rating || '4.8'}</span>
            </span>
        `;
    }

    if (popularityEl) {
        if (product.isPopular) {
            popularityEl.innerHTML = `
                <span class="popularity-badge flex-items align-center">
                    <i data-lucide="flame" style="width: 14px; height: 14px; color: var(--accent-gold);"></i>
                    <span class="ml-1">Chef's Signature</span>
                </span>
            `;
        } else if (product.isVegetarian) {
            popularityEl.innerHTML = `
                <span class="vegetarian-badge flex-items align-center">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    <span>Vegetarian Choice</span>
                </span>
            `;
        } else {
            popularityEl.style.display = 'none';
        }
    }

    // Set up quantity listeners
    let quantityValue = 1;
    const qtySpan = document.getElementById('quantity-multiplier');
    const btnMinus = document.getElementById('btn-qty-minus');
    const btnPlus = document.getElementById('btn-qty-plus');
    const btnAddToCart = document.getElementById('btn-add-to-cart');

    if (btnMinus && btnPlus && qtySpan) {
        btnMinus.addEventListener('click', () => {
            if (quantityValue > 1) {
                quantityValue--;
                qtySpan.textContent = quantityValue;
            }
        });
        btnPlus.addEventListener('click', () => {
            quantityValue++;
            qtySpan.textContent = quantityValue;
        });
    }

    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            // Check auth
            const loggedIn = window.isUserLoggedIn && window.isUserLoggedIn();
            if (!loggedIn) {
                sessionStorage.setItem('redirect_after_login', window.location.href);
                alert('Authentication Required. You must be signed in to add items to your dining cart.');
                window.location.href = 'login.html';
                return;
            }

            // User logged in, add to cart
            addItemToLocalStorageCart(product.id, quantityValue, product.name, product.price);
        });
    }

    if (window.lucide) window.lucide.createIcons();
}

/**
 * Handles underlying cart storage calculations.
 */
function addItemToLocalStorageCart(id, qty, name, price) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity = parseInt(existingItem.quantity) + qty;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: qty
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Alert user
        alert(`Successfully added ${qty} x "${name}" to your Cart.`);
        
        // Sync Navbar badge
        if (window.syncNavbar) window.syncNavbar();
    } catch (e) {
        console.error("Cart action error: ", e);
        alert('Failed to update cart. Please try again.');
    }
}


/**
 * CART & CHECKOUT CONTROLLER (orders.html)
 */
async function initCartCheckoutPage(menuJsonPath) {
    // 1. Guard check - redirect immediately if user not logged in
    const loggedIn = window.isUserLoggedIn && window.isUserLoggedIn();
    if (!loggedIn) {
        sessionStorage.setItem('redirect_after_login', window.location.href);
        alert('Security checkpoint: You must be signed in to review items or perform checkout.', () => {
            window.location.href = 'login.html';
        });
        return;
    }

    // 2. Load catalogue to pull images and details for cart items if needed
    let catalogItems = window.ZANI_MENU_ITEMS || [];
    if (catalogItems.length === 0) {
        try {
            const res = await fetch(menuJsonPath);
            if (res.ok) {
                const data = await res.json();
                catalogItems = data.items || [];
            }
        } catch (error) {
            console.error("Catalog fetch error matching: ", error);
        }
    }

    // 3. Set reference nodes
    const cartItemsGrid = document.getElementById('cart-items-container');
    const orderForm = document.getElementById('checkout-form');
    
    // Toggleable delivery options
    const radioDineIn = document.getElementById('option-dine-in');
    const radioCollect = document.getElementById('option-collect');
    const radioDelivery = document.getElementById('option-delivery');
    const deliveryAddressSection = document.getElementById('delivery-address-section');
    
    // Input elements for validation
    const streetInput = document.getElementById('delivery-street');
    const cityInput = document.getElementById('delivery-city');
    const postalInput = document.getElementById('delivery-postal');
    
    // Card inputs
    const cardholderInput = document.getElementById('payment-cardholder');
    const cardnumberInput = document.getElementById('payment-cardnumber');
    const expiryInput = document.getElementById('payment-expiry');
    const cvvInput = document.getElementById('payment-cvv');

    let mode = 'DineIn'; // Default option is Dine In

    // Toggle address visibility on delivery options click
    if (deliveryAddressSection) {
        const handleModeChange = (newMode) => {
            mode = newMode;
            if (newMode === 'Delivery') {
                deliveryAddressSection.classList.remove('hidden');
                if (streetInput) streetInput.required = true;
                if (cityInput) cityInput.required = true;
                if (postalInput) postalInput.required = true;
            } else {
                deliveryAddressSection.classList.add('hidden');
                if (streetInput) {
                    streetInput.required = false;
                    streetInput.value = '';
                }
                if (cityInput) {
                    cityInput.required = false;
                    cityInput.value = '';
                }
                if (postalInput) {
                    postalInput.required = false;
                    postalInput.value = '';
                }
            }
            recalculateInvoices(newMode);
        };

        if (radioDineIn) radioDineIn.addEventListener('change', () => handleModeChange('DineIn'));
        if (radioCollect) radioCollect.addEventListener('change', () => handleModeChange('Collect'));
        if (radioDelivery) radioDelivery.addEventListener('change', () => handleModeChange('Delivery'));
    }

    // Trigger initial render of cart items
    renderCartList(catalogItems, mode);

    // Form confirmation
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (cart.length === 0) {
                alert('Your cart is empty. Please visit our Menu and add delectable gourmet courses.', () => {
                    window.location.href = 'menu.html';
                });
                return;
            }

            // 4. Client validation check
            if (mode === 'Delivery') {
                if (!streetInput.value.trim() || !cityInput.value.trim() || !postalInput.value.trim()) {
                    alert('Please enter complete delivery coordinates.');
                    return;
                }
            }

            // Payment values checkpoint
            if (!cardholderInput.value.trim() || !cardnumberInput.value.trim() || !expiryInput.value.trim() || !cvvInput.value.trim()) {
                alert('All digital card billing details are required to secure the order.');
                return;
            }

            // 5. Build transaction object
            const orderId = `LAB-${Math.floor(100000 + Math.random() * 900000)}`;
            const user = window.getCurrentUser ? window.getCurrentUser() : { name: "Guest" };
            
            // Subtotal computation
            let subtotal = 0;
            const itemizedSummary = cart.map(item => {
                const catInfo = catalogItems.find(c => c.id === item.id) || {};
                const currentPrice = catInfo.price || item.price || 0.00;
                subtotal += currentPrice * item.quantity;
                return {
                    id: item.id,
                    name: catInfo.name || item.name,
                    price: currentPrice,
                    quantity: item.quantity
                };
            });

            const deliveryCharge = (mode === 'Delivery') ? DELIVERY_FEE : 0;
            const grandTotal = subtotal + deliveryCharge;

            // Check if there is any table reservation in cart to transfer details to orders registry
            const originalReservation = cart.find(item => item.id.startsWith('res-tbl-'));
            let finalStatus = mode; // Let's default to mode (DineIn / Collect / Delivery)
            let resDetails = null;

            if (originalReservation && originalReservation.reservationDetails) {
                finalStatus = "Reservation";
                resDetails = originalReservation.reservationDetails;
            }

            const orderPayload = {
                id: orderId,
                date: new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                items: itemizedSummary,
                subtotal: subtotal,
                deliveryFee: deliveryCharge,
                total: grandTotal,
                status: finalStatus, // 'Collect' or 'Delivery' or 'Reservation'
                userName: user.name,
                addressDetails: mode === 'Delivery' ? {
                    street: streetInput.value.trim(),
                    city: cityInput.value.trim(),
                    postal: postalInput.value.trim()
                } : null,
                paymentSummary: {
                    cardholder: cardholderInput.value.trim(),
                    lastDigits: cardnumberInput.value.trim().slice(-4) || 'XXXX'
                },
                reservationDetails: resDetails
            };

            // Retrieve previous orders, insert new, and persist
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.unshift(orderPayload); // Newest order first
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear active cart
            localStorage.setItem('cart', JSON.stringify([]));
            if (window.syncNavbar) window.syncNavbar();

            // Redirect to success, forwarding ID
            alert('Chef Confirmation received! Proceeding to success dispatch page...', () => {
                window.location.href = `order-success.html?orderId=${orderId}`;
            });
        });
    }
}

/**
 * Renders the tabular dynamic cart view.
 */
function renderCartList(catalogItems, mode) {
    const grid = document.getElementById('cart-items-container');
    if (!grid) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length === 0) {
        grid.innerHTML = `
            <div class="empty-state text-center" style="padding: 3rem 1.5rem;">
                <i data-lucide="clipboard" style="width: 48px; height: 48px; color: var(--text-muted); margin: 0 auto 1.5rem;"></i>
                <h3 style="margin-bottom: 0.5rem; font-family: var(--font-serif); font-size:1.3rem;">Epicurean Vault Empty</h3>
                <p style="color:var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Add some of our Chef's signatures to begin checkout processing.</p>
                <a href="menu.html" class="btn-primary inline-block">Browse Culinary menu</a>
            </div>
        `;
        recalculateInvoices(mode);
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    let itemsHTML = '';
    cart.forEach((item, index) => {
        // Double check matching catalog files to display graphic assets
        const itemDetail = catalogItems.find(c => c.id === item.id) || {};
        const thumbnail = itemDetail.imageUrl || item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80';
        const price = itemDetail.price || item.price || 0.00;
        const totalLine = price * item.quantity;

        itemsHTML += `
            <div class="cart-row card-no-hover" data-item-id="${item.id}">
                <div class="cart-col-product flex-items align-center">
                    <img src="${thumbnail}" class="cart-thumb" alt="${escapeHTML(item.name)}">
                    <div class="ml-3">
                        <h4 class="cart-item-name font-serif">${escapeHTML(item.name)}</h4>
                        <span class="cart-item-unit-price font-mono text-xs text-secondary">R ${price.toFixed(2)} each</span>
                    </div>
                </div>
                <div class="cart-col-quantity flex-items align-center justify-center">
                    <button type="button" class="cart-qty-adjust-btn" onclick="updateCartLineQuantity('${item.id}', -1)">
                        <i data-lucide="minus" style="width: 12px; height: 12px;"></i>
                    </button>
                    <span class="cart-entry-count font-mono" id="row-qty-${item.id}">${item.quantity}</span>
                    <button type="button" class="cart-qty-adjust-btn" onclick="updateCartLineQuantity('${item.id}', 1)">
                        <i data-lucide="plus" style="width: 12px; height: 12px;"></i>
                    </button>
                </div>
                <div class="cart-col-total font-mono text-right text-semibold">
                    R ${totalLine.toFixed(2)}
                </div>
                <div class="cart-col-action text-right">
                    <button type="button" class="cart-delete-btn" onclick="removeCartLineItem('${item.id}')" title="Remove Course">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            </div>
        `;
    });

    grid.innerHTML = itemsHTML;
    recalculateInvoices(mode);
    if (window.lucide) window.lucide.createIcons();
}

/**
 * Global triggers to capture quantitative updates from the tabular layout.
 */
window.updateCartLineQuantity = function(id, count) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const target = cart.find(x => x.id === id);
        if (target) {
            const newQty = parseInt(target.quantity) + count;
            if (newQty < 1) {
                // If quantity drops below 1, confirm deletion
                removeCartLineItem(id);
                return;
            }
            target.quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Reload cart grid preserving active Delivery model checkbox selections
            refreshCartContainer();
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * Force deletes a specific row from the shopping cart.
 */
window.removeCartLineItem = function(id) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemToRemove = cart.find(x => x.id === id);
        const name = itemToRemove ? itemToRemove.name : "this item";
        
        if (confirm(`Are you sure you want to remove "${name}" from your selection?`)) {
            cart = cart.filter(x => x.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            refreshCartContainer();
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * Re-reads values and feeds catalog renderer.
 */
async function refreshCartContainer() {
    // Determine path prefix
    const isSubpage = window.location.pathname.includes('/pages/');
    const menuJsonPath = isSubpage ? '../data/menu.json' : 'data/menu.json';
    
    // Check mode
    const radioDelivery = document.getElementById('option-delivery');
    const mode = (radioDelivery && radioDelivery.checked) ? 'Delivery' : 'Collect';

    let catalogItems = window.ZANI_MENU_ITEMS || [];
    if (catalogItems.length === 0) {
        try {
            const res = await fetch(menuJsonPath);
            if (res.ok) {
                const data = await res.json();
                catalogItems = data.items || [];
            }
        } catch (e) {
            console.error(e);
        }
    }

    renderCartList(catalogItems, mode);
    if (window.syncNavbar) window.syncNavbar();
}

/**
 * Updates monetary calculation cards dynamically inside checkout layout.
 */
function recalculateInvoices(mode) {
    const subtotalLabel = document.getElementById('invoice-subtotal');
    const feeLabel = document.getElementById('invoice-delivery-fee');
    const deliveryFeeRow = document.getElementById('delivery-fee-row');
    const grandLabel = document.getElementById('invoice-grand-total');

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += (item.price || 0) * item.quantity;
    });

    const fee = (mode === 'Delivery' && cart.length > 0) ? DELIVERY_FEE : 0.00;
    const finalTotal = subtotal + fee;

    if (subtotalLabel) subtotalLabel.textContent = `R ${subtotal.toFixed(2)}`;
    
    if (feeLabel) feeLabel.textContent = `R ${fee.toFixed(2)}`;
    if (deliveryFeeRow) {
        if (mode === 'Delivery' && cart.length > 0) {
            deliveryFeeRow.classList.remove('hidden');
        } else {
            deliveryFeeRow.classList.add('hidden');
        }
    }
    
    if (grandLabel) grandLabel.textContent = `R ${finalTotal.toFixed(2)}`;
}

window.recalculateInvoices = recalculateInvoices;
