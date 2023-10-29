import { products, creatCardProduct } from "./script.js";

const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get("category");

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