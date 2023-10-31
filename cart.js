class Cart {
  constructor(product) {
    let storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    this.carts = storedCarts;
    this.carts.push({
      ...product,
      isCheck: false,
    });

    localStorage.setItem('carts', JSON.stringify(this.carts));
  }
}

let carts = getCarts();

export function addProductToCart(product) {
  carts.push(new Cart(product));
}

export function getCarts() {
  // Retrieve the cart data from localStorage
  return JSON.parse(localStorage.getItem('carts')) || [];
}

export function clearCarts() {
  localStorage.removeItem('carts');
}

