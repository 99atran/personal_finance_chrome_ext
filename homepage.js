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

function displayBudgetData(budgetName) {
  var data = document.getElementById('data');
  chrome.storage.sync.get([budgetName], function (value) {
    var limit = parseFloat(value[key][1].toFixed(2));
    var balance = parseFloat(value[key][0].toFixed(2));

    data.innerHTML = "hi";
  });
}

/* listeners here */
document.addEventListener('DOMContentLoaded', populateBudgets);

var addItem = document.getElementById('addItem');
var newTab = document.getElementById('newTab');
var selector = document.getElementById('BudgetsMenu');


if (addItem) {
  addItem.addEventListener("click", addBudget);
}

if (newTab) {
  newTab.onclick = function() {
    getReport();
  }
}

if (selector) {
  selector.change(function(s) {
    alert(selector.options[selector.selected].value);
    displayBudgetData(selector.options[selector.selected].value);
  });
}

