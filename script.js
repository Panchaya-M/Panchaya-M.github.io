import { addProductToCart } from './cart.js';

export let products = [];
let slideIndex = 0;

async function loadData() {
  await fetch('/src/datas/products.json').then((res) => res.json())
    .then((json) => products = json);
}

await loadData();

let pathname = window.location.pathname;
if (pathname === '/') {
  createBestSellerProducts();
  createNewItems();
  createPromotionProducts();
}

function filterBestSellerProducts() {
  return products.filter((product) => product.recommend);
}

function filterNemItems() {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newItems = products.filter((product) => {
    const createdDate = new Date(product.created_at);
    return createdDate >= thirtyDaysAgo && createdDate <= currentDate
  }
  );
  return newItems
}

function filterPromotionProducts() {
  return products.filter((product) => product.percent_discount);
}

function createBestSellerProducts() {
  let bestSellerProducts = filterBestSellerProducts();

  let element = document.getElementById('best-seller');
  for(let product of bestSellerProducts) {
    creatCardProduct(element, product, 'best-seller');
  }
  carouseButtons('bestseller');
}

function createNewItems() {
  let newItems = filterNemItems();
  let element = document.getElementById('new-items');
  for(let product of newItems) {
    creatCardProduct(element, product, 'new-item');
  }
  carouseButtons('new-items');
}

function createPromotionProducts() {
  let promotionProducts = filterPromotionProducts();
  let element = document.getElementById('promotions');
  for(let product of promotionProducts) {
    creatCardProduct(element, product, 'promotion');
  }
  carouseButtons('promotions');
}

export function creatCardProduct(element, product, type) {
  const id = product.id;
  let card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
  <a href="/product-detail.html?id=${id}">
    <div id="img-${id}" class="card-img" style="background-image: url(src/images/products/product_${id}.webp);"></div>
  </a>
  <div class="card-body px-0 d-flex flex-column justify-content-between">
    <div>
      <a href="/product-detail.html?id=${id}">
        <h4 class="m-0 cursor-pointer product-name" id="name-${id}">${product.name}</h4>
      </a>
      <div class="d-flex align-items-center gap-1">
        ${createRatingStar(findMeanOfRating(product.reviews))} 
        <div class="text-gray f-12 pt-2">(${findMeanOfRating(product.reviews).toFixed(1)})</div>
      </div>
      <p class="card-product-detail text-muted pt-2">
        ${product.description}
      </p>
    </div>
    <div class="d-flex justify-content-between align-items-end">
      <div class="col">
      ${calculatePriceOfProduct(product.price, product.percent_discount)}
      </div>
      <div class="col text-end">
        <button id="btn-${type}-${id}" type="button" class="btn button-primary">ADD TO CART</button>
      </div>
    </div>
  </div>`
  element.appendChild(card)

  const button = document.getElementById(`btn-${type}-${id}`);
  button.addEventListener('click', function() {
    addtoCart(product)
  })
}

function addtoCart(product) {
  addProductToCart(product);
}

//Carousel slide
function slideContainer(section) {
  return document.querySelector(`.carousel-slide-${section}`);
}

function showSlide(section, index) {
  slideContainer(section).style.transform = `translateX(-${index * 50}%)`;
}

function nextSlide(section) {
  slideIndex = (slideIndex + 1) % 3;
    showSlide(section, slideIndex);
}

function prevSlide(section) {
  slideIndex = (slideIndex - 1 + 3) % 3;
  showSlide(section, slideIndex);
}

function carouseButtons(section) {
  let prevBtn = document.getElementById(`prevBtn-${section}`);
  let nextBtn = document.getElementById(`nextBtn-${section}`);

  prevBtn.addEventListener('click', function() {
    prevSlide(section)
  });
  nextBtn.addEventListener('click', function() {
    nextSlide(section)
  });
}

//Rating star
export function createRatingStar(rating) {
  let stars = document.createElement('div');
  stars.classList.add('rating-star');
  if (!rating) {
    for(let i = 1; i <= 5; i++) {
      const star = document.createElement('div');
      star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#CECECE" class="bi bi-star" viewBox="0 0 16 16">
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
        </svg>`
  
      stars.appendChild(star);
    }
    return stars.outerHTML;
  }

  for(let i = 1; i <= Math.floor(rating); i++) {
    const fullStar = document.createElement('div');
    fullStar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#E09132" class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>`

    stars.appendChild(fullStar);
  }

  const decimal = rating.toString().split(".")[1];
  if (decimal >= 5) {
    const halfStar = document.createElement('div');
    halfStar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#E09132" class="bi bi-star-half" viewBox="0 0 16 16">
        <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/>
      </svg>`

    stars.appendChild(halfStar);
  }

  for (let i = Math.ceil(rating); i < 5; i++) {
    const star = document.createElement('div');
      star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#CECECE" class="bi bi-star" viewBox="0 0 16 16">
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
        </svg>`
  
      stars.appendChild(star);
  }

  return stars.outerHTML;
}

export function findMeanOfRating(reviews) {
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });

  return (sum / reviews.length) || 0;
}

//Add to cart button
function createAddToCartButton(id) {
  let button = document.createElement('button');
  button.type = 'button';
  button.id = `btn-${id}`;
  button.classList.add('btn');
  button.classList.add('button-primary')
  button.textContent = 'ADD TO CART'

  return button.outerHTML;
}

//Calculate price after discount
function calculatePriceOfProduct(fullPrice, percentDiscount) {
  if (!percentDiscount) {
    return `<h5 class="m-0">$${fullPrice.toFixed(2)}</h5>`
  }

  const discountPrice = fullPrice - (fullPrice * percentDiscount / 100);
  return `<h5 class="text-red m-0">$${discountPrice.toFixed(2)} <span class="text-gray f-12 strikethrough">$${fullPrice.toFixed(2)}</span></h5>`
}