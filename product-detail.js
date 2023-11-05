import { createRatingStar, findMeanOfRating } from "./script.js";
import { addProductToCart } from './cart.js';

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

let product;

await fetch('/src/datas/products.json').then((res) => res.json())
.then((json) => product = json.find((res) => id == res.id));

//Product image
let productImage = document.getElementById('product-img');
productImage.innerHTML = `
<div id="img-${id}" 
  class="product-detail-img" 
  style="background-image: url(src/images/products/product_${id}.webp);">
</div>`

//Product name
let productName = document.getElementById('title');
productName.textContent = product.name;

//Product categories
let productCetegories = document.getElementById('categories');
let categories = '';
for (let i = 0; i < product.category.length; i++) {
  categories += `${product.category[i].toUpperCase()}`;
  if (i != product.category.length-1) {
    categories += ' | '
  }
}
productCetegories.textContent = categories;

//Product description
let productDescription = document.getElementById('description');
productDescription.textContent = product.description;


//Product price
let productPrice = document.getElementById('price');
productPrice.innerHTML = calculatePriceOfProduct(product.price, product.percent_discount);

//Calculate price after discount
function calculatePriceOfProduct(fullPrice, percentDiscount) {
  if (!percentDiscount) {
    return `<h5 class="m-0">$${fullPrice.toFixed(2)}</h5>`
  }

  const discountPrice = fullPrice - (fullPrice * percentDiscount / 100);
  return `<h5 class="text-red m-0">$${discountPrice.toFixed(2)} <span class="text-gray f-12 strikethrough">$${fullPrice.toFixed(2)}</span></h5>`
}


//Button add to cart event
const buttonAdd = document.getElementById('btn-add');
buttonAdd.addEventListener('click', function() {
  addProductToCart(product);
});


//reviews
const meanRating = document.getElementById('mean-rating');
meanRating.innerHTML = `
  ${createRatingStar(findMeanOfRating(product.reviews))} 
  <div class="text-gray f-12 pt-2">(${findMeanOfRating(product.reviews).toFixed(1)})</div>
  `

let reviewers = document.getElementById('reviewers');
for (let review of product.reviews) {
  let reviewer = document.createElement('div');
  reviewer.classList.add('reviewer');

  const profile = document.createElement('div');
  profile.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
    </svg>
    `
  reviewer.appendChild(profile);

  const user = document.createElement('div');
  user.innerHTML = `
    <h6 class="mb-0">${review.author}</h6>
    <div class="d-flex align-items-center gap-1">
      ${createRatingStar(review.rating)}
      <div class="text-gray f-12 pt-2">(${review.rating})</div>
    </div>
    <p class="text-muted pt-3">${review.detail}</p>
  `
  reviewer.appendChild(user);
  reviewers.appendChild(reviewer);

  const underline = document.createElement('hr');
  reviewers.appendChild(underline);
}