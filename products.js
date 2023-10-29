import { products, creatCardProduct } from "./script.js";

const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get("category");

displayTitle();
if (!categoryFilter) {
  createProducts(products);
} else {
  const filterProducts = products.filter((product) => product.category.some((category) => categoryFilter === category));
  createProducts(filterProducts);
}

function createProducts(products) {
  let element = document.getElementById('product-container');
  for(let product of products) {
    creatCardProduct(element, product);
  }
}

function displayTitle() {
  let titleElement = document.getElementById('title-products');
  let title = getTitle();
  titleElement.textContent = title;
}

function getTitle() {
  switch (categoryFilter) {
    case 'vase':
      return 'VASES';
    case 'candle':
      return 'CANDLES';
    case 'tray':
      return 'TRAYS';
    case 'lamp':
      return 'LAMPS'
    default:
      return 'ALL PRODUCTS';
  }
}