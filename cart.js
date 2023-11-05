import { calculatePriceOfProduct } from './script.js'

class Cart {
  constructor(product) {
    let storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    this.carts = storedCarts;
    this.carts.push({
      ...product,
      selectedAmount: 1,
    });

    localStorage.setItem('carts', JSON.stringify(this.carts));
  }
}

let carts = getCarts();
displayProducts();
calulateOrders();

export function addProductToCart(product) {
  let stored = getCarts();
  const haveProductIndex = stored.findIndex((s) => product.id == s.id);
  if (haveProductIndex >= 0) {
    stored[haveProductIndex].selectedAmount += 1;
    carts = stored;
    updateCarts();
    updateAmountValue(product.id , stored[haveProductIndex].selectedAmount);
    calulateOrders();
  } else {
    carts.push(new Cart(product));
    calulateOrders();
  }
}

export function getCarts() {
  return JSON.parse(localStorage.getItem('carts')) || [];
}

export function updateCarts() {
  return localStorage.setItem('carts', JSON.stringify(carts));
}

export function clearCarts() {
  localStorage.removeItem('carts');
  calulateOrders();
}

function reduceProduct(id) {
  const haveProductIndex = carts.findIndex((s) => id == s.id);
  if (haveProductIndex >= 0) {
    carts[haveProductIndex].selectedAmount -= 1;
    updateCarts();
    updateAmountValue(id , carts[haveProductIndex].selectedAmount);
    calulateOrders();
  }
}

function removeProduct(id) {
  const productIndex = carts.findIndex((s) => id == s.id);
  if (productIndex >= 0) {
    carts.splice(productIndex, 1);
    updateCarts();
    displayProducts();
    calulateOrders();
  }
}


function displayProducts() {
  let cartProducts = document.getElementById('cart-product');
  if (!cartProducts) {
    return;
  }
  cartProducts.innerHTML = null;
  for (let product of carts) {
    const id = product.id;
    let cardProduct = document.createElement('div');
    cardProduct.classList.add('card');
    cardProduct.classList.add('cart-card');
    cardProduct.innerHTML = `
      <div class="d-flex">
        <a href="/product-detail.html?id=${id}">
        <div class="cart-card-img" style="background-image: url(src/images/products/product_${id}.webp);"></div>
      </a>
      <div class="px-3">
        <a href="/product-detail.html?id=${id}">
          <h4 class="m-0 cursor-pointer product-name">${product.name}</h4>
        </a>
        <p class="cart-product-detail text-muted pt-2 f-12">
          ${product.description}
        </p>
        <div class="d-flex flex-column flex-lg-row justify-content-between pt-1">
          ${calculatePriceOfProduct(product.price, product.percent_discount)}
          <div class="d-flex align-items-center">
            <div class="btn-group mt-2 mt-lg-0" role="toolbar" aria-label="Basic outlined example">
              <button type="button" class="btn btn-outline" id="reduce-product-${id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
              </button>

              <div class="position-relative">
                <input type="number" class="form-control cart-product-amount text-center">
                <span class="product-amount-value" id="selected-amount-product-${id}">${ product.selectedAmount }</span>
              </div>

              <button type="button" class="btn btn-outline" id="add-product-${id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </button>
            </div>
            <div class="px-2 pt-1 pt-lg-0">
              <button class="cart-product-trash" id="remove-product-${id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#C52E2E" class="bi bi-trash3" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      `
    cartProducts?.appendChild(cardProduct);

    let reduceButton = document.getElementById(`reduce-product-${id}`);
    let addButton = document.getElementById(`add-product-${id}`);
    let removeButton = document.getElementById(`remove-product-${id}`);

    reduceButton?.addEventListener('click', function() {
      reduceProduct(id);
    });

    addButton?.addEventListener('click', function() {
      addProductToCart(product)
    });

    removeButton?.addEventListener('click', function() {
      removeProduct(id);
    });
  }
}

function updateAmountValue(id, amount) {
  const selectedAmount = document.getElementById(`selected-amount-product-${id}`);
  if (selectedAmount) {
    selectedAmount.textContent = amount;
  }
}

function calulateOrders() {
  let subTotal = document.getElementById('sub-total');
  let shipping = document.getElementById('shipping');
  let total = document.getElementById('total');

  const subTotalValue = calculateSubTotal();
  const shippingValue = calculateShipping();

  if (subTotal) {
    subTotal.textContent = `$${subTotalValue}`;
  }

  if (shipping) {
    shipping.textContent = `$${shippingValue}`;
  }

  if (total) {
    total.textContent = `$${(Number(subTotalValue) + Number(shippingValue)).toFixed(2)}`;
  }
}

function calculateSubTotal() {
  let subTotal = 0;
  carts.forEach(product => {
    if (product.percent_discount) {
      subTotal += (product.price - (product.price * product.percent_discount / 100)) * product.selectedAmount;
    } else {
      subTotal += product.price * product.selectedAmount;
    }
  });
  return subTotal.toFixed(2);
}

function calculateShipping() {
  const amount = carts.reduce((sum, product) => sum + product.selectedAmount, 0);
  const shipping = amount >= 3 ? 0 : (calculateSubTotal() * 15 / 100);
  return  shipping.toFixed(2);
}