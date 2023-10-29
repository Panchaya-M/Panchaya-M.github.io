import { products, creatCardProduct } from "./script.js";

const urlParams = new URLSearchParams(window.location.search);
const categoryFilter = urlParams.get("category");
const itemPerPage = urlParams.get("limit") || 10;
let page = urlParams.get("page") || 1;
let search = urlParams.get("search");

let filterProducts = [];

displayTitle();
if (!categoryFilter) {
  filterProducts = products;
  createProducts(filterProducts);
} else {
  filterProducts = products.filter((product) => product.category.some((category) => categoryFilter === category));
  createProducts(filterProducts);
}

if (search) {
  searchProducts(search);
}

if (page && itemPerPage) {
  createPagination();
  paginationProducts();
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

function searchProducts(input) {
  search = input;
  const searchProducts = filterProducts.filter(product => {
    const isNameMatch = product.name.toLowerCase().includes(input.toLowerCase());
    const isCategoryMatch = product.category.includes(input.toLowerCase());
    return isNameMatch || isCategoryMatch;
  });
  createProducts(searchProducts);
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', function(event) {
  const input = event.target.value
  searchProducts(input);
})

function paginationProducts() {
  const startIndex = (page - 1) * itemPerPage;
  const endIndex = page * itemPerPage;

  const paginationProducts = filterProducts.slice(startIndex,endIndex);
  createProducts(paginationProducts);
}

function createPagination() {
  if (filterProducts.length > itemPerPage) {
    let pageAmount =  Math.floor(filterProducts.length / itemPerPage);
    if (filterProducts.length % itemPerPage !== 0) {
      pageAmount++;
    }
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = null;
    let prevPagination = document.createElement('li');
    let nextPagination = document.createElement('li');
  
    prevPagination.classList.add('page-item');
    nextPagination.classList.add('page-item');
  
    const prevPageLink = document.createElement('a');
    prevPageLink.classList.add('page-link');
    prevPageLink.classList.add('text-muted');
    prevPageLink.setAttribute("aria-label", 'Previous');
    prevPageLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
  
    const nextPageLink = document.createElement('a');
    nextPageLink.classList.add('page-link');
    nextPageLink.classList.add('text-muted');
    nextPageLink.setAttribute("aria-label", 'Next');
    nextPageLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
  
    prevPageLink.addEventListener('click', function() {
      if (page > 1) {
        page--;
        prevPageLink.href = `/products.html?limit=${itemPerPage}&page=${page}`;
        if (categoryFilter) {
          prevPageLink.href = prevPageLink.href + `&category=${categoryFilter}`;
        } 
        if (search){
          prevPageLink.href = prevPageLink.href + `&search=${search}`;
        }
      }
    });
  
    nextPageLink.addEventListener('click', function() {
      if (page < pageAmount) {
        page++;
        nextPageLink.href = `/products.html?limit=${itemPerPage}&page=${page}`;
        if (categoryFilter) {
          nextPageLink.href = nextPageLink.href + `&category=${categoryFilter}`;
        } 
        if (search){
          nextPageLink.href = nextPageLink.href + `&search=${search}`;
        }
      }
    })
  
    prevPagination.appendChild(prevPageLink);
    nextPagination.appendChild(nextPageLink);
  
    pagination.appendChild(prevPagination);
    for (let i = 1; i <= pageAmount; i++) {
      let pageItem = document.createElement('li');
      pageItem.classList.add('page-item');
  
      let pageLink = document.createElement('a');
      pageLink.classList.add('page-link');
      pageLink.classList.add('text-muted');
      if (page == i) {
        pageLink.classList.add('active');
      }
      if (categoryFilter) {
        pageLink.href = `/products.html?category=${categoryFilter}&limit=${itemPerPage}&page=${i}`;
      } else {
        pageLink.href = `/products.html?limit=${itemPerPage}&page=${i}`;
      }
      pageLink.textContent = i.toString();
      pagination.appendChild(pageLink);
    }
    pagination.appendChild(nextPagination);
    paginationProducts();
  }
}
