
const productsGrid = document.getElementById('products-grid');
const cartModal = document.getElementById('cart-modal');
const closeCartModalBtn = document.getElementById('close-cart-modal');
const viewCartButton = document.getElementById('view-cart-button');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalDisplay = document.getElementById('cart-total');
const cartCountSpan = document.getElementById('cart-count');
const checkoutButton = document.getElementById('checkout-button');

const API_PRODUCTS_URL = '/api/products';
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Carrega o carrinho do LocalStorage

// Função para atualizar o contador do carrinho no header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

// Função para buscar e exibir produtos
async function fetchProducts() {
    try {
        const response = await fetch(API_PRODUCTS_URL);
        const products = await response.json();
        productsGrid.innerHTML = ''; // Limpa o grid

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image_url || 'https://via.placeholder.com/200?text=Sem+Imagem'}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description || 'Nenhuma descrição disponível.'}</p>
                    <p class="price">R$ ${product.price}</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image_url || 'https://via.placeholder.com/50?text=IMG'}')">Adicionar ao Carrinho</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productsGrid.innerHTML = '<p style="text-align: center; color: var(--danger-color);">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

// Função para adicionar produto ao carrinho
function addToCart(id, name, price, imageUrl) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, imageUrl, quantity: 1 });
    }
    saveCart();
    updateCartModal();
    updateCartCount();
    alert(`${name} adicionado ao carrinho!`);
}

// Função para remover item do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartModal();
    updateCartCount();
}

// Função para ajustar quantidade
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartModal();
            updateCartCount();
        }
    }
}

// Função para salvar o carrinho no LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
    cartItemsList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item-details">
                    <span class="item-name">${item.name}</span>
                    <span>Preço: R$ ${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });
    }
    cartTotalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Event Listeners
viewCartButton.addEventListener('click', () => {
    updateCartModal(); // Garante que o modal esteja atualizado antes de abrir
    cartModal.style.display = 'flex'; // Exibe o modal
});

closeCartModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'; // Esconde o modal
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        alert('Compra finalizada! (Esta é apenas uma simulação)');
        cart = []; // Limpa o carrinho
        saveCart();
        updateCartModal();
        updateCartCount();
        cartModal.style.display = 'none';
    } else {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    }
});


// Carrega produtos e atualiza o contador do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
});
