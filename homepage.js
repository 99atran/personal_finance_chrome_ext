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

/* Validates budget name input */
function validateName() {
  var inpObj = document.getElementById("budgetNameInput");
  
  console.log("Input:"+document.getElementById("budgetNameInput").value + " " +inpObj.checkValidity());
  return inpObj.checkValidity();
} 

/* Validates budget limit input */
function validateLimit() {
  var inpObj = document.getElementById("budgetLimitInput");
  
  console.log("Input:"+document.getElementById("budgetLimitInput").value);
  return inpObj.checkValidity();
}

/* Add new budget to list */
let createBudget = document.getElementById("addBudget");
createBudget.onclick = function(element) {
  var err = "";
  
  if (!validateName() || !validateLimit()) {
    console.log("Invalid Input");
    err = "Ya dun goofed";
  } else {
    var item = document.getElementById("budgetNameInput").value;
    var save = {};
    
    //Add to storage
    save[item] = [0, document.getElementById("budgetLimitInput").value];
    chrome.storage.sync.set(save);
    addToSelect(item);//Update select menu

    //Clear inputs
    document.getElementById("budgetNameInput").value = "";
    document.getElementById("budgetLimitInput").value = "";

    console.log("Added Input");
  }
  
  document.getElementById("errorMessage").innerHTML = err;
};

/* Updates data in main panel after a new budget is selected */
function displayBudgetData(budgetName) {
  if (budgetName === 'select an option...' ) {
    document.getElementById('data').innerHTML = 'ADVANCED DIAGNOSTIC INFO HERE?';
  } else {
      chrome.storage.sync.get([budgetName], function (value) {
        var limit = parseFloat(value[budgetName][1]);
        var balance = parseFloat(value[budgetName][0]);
        makeGraph(budgetName, balance, limit);
        document.getElementById('data').innerHTML = '$' + balance.toFixed(2) + ' of $' + limit.toFixed(2);
      });
  }
}

function makeGraph(budgetName, balance, limit) {  
  var newData = {
    data: [balance, parseFloat((limit - balance).toFixed(2))],
    label: budgetName,
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(84, 235, 185)'
    ],
    borderColor: 'rgb(42, 112, 89)',
  };
  config.data.datasets.pop();
  config.data.datasets.push(newData);
  window.pieChart.update();
}

/* listeners and global vars here */
document.addEventListener('DOMContentLoaded', populateBudgets);
var selector = document.getElementById('BudgetsMenu');

var config = {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ['Spent','Remaining'],
        datasets: [{
            label: '',
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(84, 235, 185)'
            ],
            borderColor: 'rgb(42, 112, 89)',
            data: [0, 0]
        }]
    },

    // Configuration options go here
    options: {
      title: {
        text: '',
        display: false
      }
    }
};

/* call budget data display function upon change in selector value */
if (selector) {
  selector.onchange = function() {
    displayBudgetData(selector.options[selector.selectedIndex].value);
  }
}

/* initialize the chart item */
window.onload = function() {
  console.log('hi');
  var ctx = document.getElementById('myChart').getContext('2d');
  window.pieChart = new Chart(ctx, config);
}