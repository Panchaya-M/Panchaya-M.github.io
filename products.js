import { products, creatCardProduct } from "./script.js";

const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get("category");

let filterProducts = [];

displayTitle();
if (!categoryFilter) {
  filterProducts = products;
  createProducts(filterProducts);
} else {
  filterProducts = products.filter((product) => product.category.some((category) => categoryFilter === category));
  createProducts(filterProducts);
}

function createProducts(products) {
  let element = document.getElementById('product-container');
  element.innerHTML = null;
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

let btnSortRelevance = document.getElementById('sort-relevance');
let btnSortLow =document.getElementById('sort-low');
let btnSortHigh =document.getElementById('sort-high');

btnSortRelevance.addEventListener('click', function() {
  const sortProducts = filterProducts.sort((a,b) => a.id - b.id);
  createProducts(sortProducts);
})

btnSortLow.addEventListener('click', function() {
  let sortProducts = filterProducts;
  sortProducts.forEach((product) => 
    product.price_discount = calculatePriceOfProduct(product.price, product.percent_discount)
  );
  sortProducts = sortProducts.sort((a,b) => a.price_discount - b.price_discount);
  createProducts(sortProducts);
})

btnSortHigh.addEventListener('click', function() {
  let sortProducts = filterProducts;
  sortProducts.forEach((product) => 
    product.price_discount = calculatePriceOfProduct(product.price, product.percent_discount)
  );
  sortProducts = sortProducts.sort((a,b) => b.price_discount - a.price_discount);
  createProducts(sortProducts);
})

function calculatePriceOfProduct(fullPrice, percentDiscount) {
  if (!percentDiscount) {
    return fullPrice.toFixed(2);
  }

  const discountPrice = fullPrice - (fullPrice * percentDiscount / 100);
  return discountPrice.toFixed(2);
}