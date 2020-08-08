function populateBudgets() {
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    allKeys.forEach(addToSelect);
    console.log('done import');
  });
}

function addToSelect(key) {
  var select = document.getElementById('BudgetsMenu');

  var option_to_add = document.createElement('option');
  option_to_add.appendChild( document.createTextNode(key) );
  option_to_add.value = key; 
  
  select.appendChild(option_to_add);
}

/* listeners here */
document.addEventListener('DOMContentLoaded', populateBudgets);

var addItem = document.getElementById('addItem');
var newTab = document.getElementById('newTab');
if (addItem) {
  addItem.addEventListener("click", addBudget);
}

if (newTab) {
  newTab.onclick = function() {
    getReport();
  }
}

