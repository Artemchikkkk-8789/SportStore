document.addEventListener('DOMContentLoaded', function () {
    // Функція для оновлення лічильника кошика
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        });
    }

    // Оновлюємо лічильник при завантаженні сторінки
    updateCartCount();

    // Обробник для кнопок "Додати до кошика"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const selectedSizeElement = productCard.querySelector('.size-option.selected');
            if (!selectedSizeElement) {
                alert("Будь ласка, виберіть розмір перед додаванням до кошика.");
                return;
            }

            const selectedSize = selectedSizeElement.dataset.size;
            const productId = this.getAttribute('data-id') + '-' + selectedSize; // Унікальний ID по розміру
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('p').textContent);
            const productImg = productCard.querySelector('img').src;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    size: selectedSize,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            alert('Товар додано до кошика!');
        });
    });

    // Відображення товарів у кошику
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    // ✅ ОНОВЛЕНА ФУНКЦІЯ displayCartItems з розміром
    function displayCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Ваш кошик порожній</p>';
            totalPriceElement.textContent = '0';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Розмір: ${item.size}</p>
                    <p>${item.price} грн × ${item.quantity}</p>
                </div>
                <div class="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)} грн
                </div>
                <span class="remove-item" data-id="${item.id}">×</span>
            `;

            cartItemsContainer.appendChild(itemElement);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = totalPrice.toFixed(2);

        // Обробник видалення
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            });
        });
    }

    // Обробник оформлення замовлення
    if (document.getElementById('checkout-btn')) {
        document.getElementById('checkout-btn').addEventListener('click', function () {
            alert('Замовлення оформлено! Дякуємо за покупку!');
            localStorage.removeItem('cart');
            displayCartItems();
            updateCartCount();
        });
    }
});

// Обробник вибору розміру
document.querySelectorAll('.size-option:not(.unavailable)').forEach(option => {
    option.addEventListener('click', function () {
        this.parentElement.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});
