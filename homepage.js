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

function removeFromSelect(index) {
  var select = document.getElementById('BudgetsMenu');

  select.remove(index);
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

  if (parseFloat(inpObj.value) == 0) {
    return false;
  }

  return inpObj.checkValidity();
}

/* Add new budget to list */
let createBudget = document.getElementById("addBudget");
createBudget.onclick = function() {
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

    //Update select menu
    addToSelect(item);

    //Clear inputs
    document.getElementById("budgetNameInput").value = "";
    document.getElementById("budgetLimitInput").value = "";

    console.log("Added Input");
  }
  
  document.getElementById("errorMessage").innerHTML = err;
};

/* Removes selected budget from list */
let deleteBudget = document.getElementById("deleteBudgets");
deleteBudget.onclick = function() {
  var selector = document.getElementById('BudgetsMenu');
  var selected = selector.options[selector.selectedIndex].value;

  if (selected != 'select an option...' ) {
    console.log(selected);  
    
    //Remove from storage
    chrome.storage.sync.remove(selected);

    //Remove from select
    removeFromSelect(selector.selectedIndex);
    displayBudgetData(selector.options[0].value)
  }
};

function displayBudgetData(budgetName) {
  if (budgetName === 'select an option...' ) {
    document.getElementById('data').innerHTML = 'ADVANCED DIAGNOSTIC INFO HERE?';
    var newData = {
      data: [0.0, 0.0],
      label: 'No Budget Selected',
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(84, 235, 185)'
      ],
      borderColor: 'rgb(42, 112, 89)',
    };
    config.data.datasets.pop();
    window.pieChart.options.title.text = 'No Budget Selected';
    config.data.datasets.push(newData);
    window.pieChart.update();
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
  var newLabels = ['Spent', 'Remaining'];
  
  if (limit - balance < 0) {
    newLabels = ['Spent', 'Remaining', 'Overspend'];
    var newData = {
      data: [limit,null,parseFloat((balance - limit).toFixed(2))],
      label: budgetName,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(84, 235, 185)',
        'rgb(20, 50, 20)'
      ],
      borderColor: 'rgb(42, 112, 89)',
    }
  } else {
    var newData = {
      data: [balance, parseFloat((limit - balance).toFixed(2))],
      label: budgetName,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(84, 235, 185)'
      ],
      borderColor: 'rgb(42, 112, 89)',
    };
  } 
  config.data.datasets.pop();
  config.data.labels = newLabels;
  config.data.datasets.push(newData);
  window.pieChart.options.title.text = budgetName;
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
        text: 'No Budget Selected',
        display: true
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