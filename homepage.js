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
  if (budgetName === 'select an option...' ) {
    document.getElementById('data').innerHTML = 'ADVANCED DIAGNOSTIC INFO HERE?';
  } else {
      chrome.storage.sync.get([budgetName], function (value) {
        var limit = parseFloat(value[budgetName][1]);
        var balance = parseFloat(value[budgetName][0]);

        document.getElementById('data').innerHTML = '$' + balance.toFixed(2) + ' of $' + limit.toFixed(2);
      });
  }
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
  selector.onchange = function() {
    displayBudgetData(selector.options[selector.selectedIndex].value);

  }
}
