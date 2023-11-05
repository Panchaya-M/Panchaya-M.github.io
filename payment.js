import { clearCarts } from './cart.js'


const btnSubmit = document.getElementById('submit-payment');

if (btnSubmit) {
  btnSubmit.addEventListener('click', function() {
    alert('Success !');
    window.location.href = "/";
    clearCarts();
  })
}