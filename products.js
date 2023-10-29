import { products, creatCardProduct } from "./script.js";

console.log('products :>> ', products);

let pathname = window.location.pathname;
if (pathname.includes('/products.html')) {
  createProducts(products);
}

function createProducts(products) {
  let element = document.getElementById('product-container');
  for(let product of products) {
    creatCardProduct(element, product);
  }
}