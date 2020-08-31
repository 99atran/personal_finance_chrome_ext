function locate_button() {
  var our_price = document.getElementById('priceblock_ourprice');
  var deal_price = document.getElementById('priceblock_dealprice');
  var buybox = document.getElementById('price_inside_buybox');
  var newBuyBoxPrice = document.getElementById('newBuyBoxPrice');

  if (our_price) {
      our_price.insertAdjacentHTML('afterend', '<button id="snacker_price" class="snacker_button"></button>');
  }
  if (deal_price) {
    deal_price.insertAdjacentHTML('afterend', '<button id="snacker_price" class="snacker_button"></button>');
  }
  if (buybox && !(our_price || deal_price || newBuyBoxPrice)) {
    // clicking as on button will put in cart, not the best strat
    buybox.insertAdjacentHTML('afterend', '<button id="snacker_price" class="snacker_button"></button>');
  }
  if (newBuyBoxPrice && !(our_price || deal_price || buybox)) {
    newBuyBoxPrice.insertAdjacentHTML('afterend', '<button id="snacker_price" class="snacker_button"></button>');
  }
  console.log("done.");
  alert("we did it");
}

function remove_button() {
  var button = document.getElementById('snacker_price');
  if (button) {
    button.parentNode.removeChild(button);
  }
}

window.onload = function() {
  locate_button();
};
