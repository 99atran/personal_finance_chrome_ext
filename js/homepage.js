/* Adds budgets in extension storage to the select */
function populateBudgets() {
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    allKeys.forEach(addToSelect);
    console.log('done import');
  });
}

/* Adds new budget to the select menu */
function addToSelect(key) {
  var select = document.getElementById('BudgetsMenu');

  var option_to_add = document.createElement('option');
  option_to_add.appendChild( document.createTextNode(key) );
  option_to_add.value = key; 
  
  select.appendChild(option_to_add);
}

/* Removes selected budget to the select menu */
function removeFromSelect(index) {
  var select = document.getElementById('BudgetsMenu');

  select.remove(index);
}

/* Validates budget name input */
function validateName() {
  var inpObj = document.getElementById("budgetNameInput");
  
  console.log("Name Input:"+document.getElementById("budgetNameInput").value + " " +inpObj.checkValidity());
  return inpObj.checkValidity();
} 

/* Validates budget limit input */
function validateNumber(element) {
  var inpObj = document.getElementById(element);
  
  console.log("Number Input:"+document.getElementById(element).value);

  if (parseFloat(inpObj.value) == 0) {
    return false;
  }

  return inpObj.checkValidity();
}

/* updates the diagnostic section of the page to the current budget selected */
function displayBudgetData(budgetName) {
  if (budgetName === 'select an option...' ) {
    document.getElementById('spend').innerHTML = "N/A";
        document.getElementById('limit').innerHTML = "N/A";
        document.getElementById('percent').innerHTML = "N/A";
        document.getElementById('data').innerHTML = "N/A";
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
        var percent = (balance / limit) * 100;

        makeGraph(budgetName, balance, limit);
        
        // if (balance / limit < 0.5) {
        //   document.getElementById('data').style.color = 'black';
        //   displayStatus += "<br>This budget is very healthy, no need to worry for now."
        // } else if (balance / limit < 0.75) {
        //   document.getElementById('data').style.color = 'black';
        //   displayStatus += "<br>This budget is healthy, keep an eye out on purchases charging to this budget."
        // } else if (balance / limit < 1.0) {
        //   document.getElementById('data').style.color = 'black';
        //   displayStatus += "<br>This budget is near maximum capacity, spend wisely or sparingly to avoid overcharging."
        // } else {
        //   document.getElementById('data').style.color = 'red';
        //   displayStatus += "<br>This budget is BUSTED! Try to spend more wisely when you are budgeting :("
        // }
        document.getElementById('spend').innerHTML = '$' + balance.toFixed(2);
        document.getElementById('limit').innerHTML = '$'+ limit.toFixed(2);
        document.getElementById('percent').innerHTML = percent.toFixed(2) + '%';
        document.getElementById('data').innerHTML = "Some Filler: "+budgetName;
      });
  }
}

/* edits the graph to reflect the data of the budget selected */
function makeGraph(budgetName, balance, limit) {
  var newLabels = ['Spent', 'Remaining'];
  
  if (limit - balance < 0) {
    newLabels = ['Spent', 'Remaining', 'Overspend'];
    var newData = {
      data: [limit,,parseFloat((balance - limit).toFixed(2))],
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

/************************************************************************************************************/

/* Add expense to selected budget */
let addExpense = document.getElementById("addExpense");
addExpense.onclick = function() {
  var err = "";
  var budgetName = selector.options[selector.selectedIndex].value;
  
  if (!validateNumber("expenseInput")) {
    console.log("Invalid Input");
    err = "Ya dun goofed";
  } else {
    var expense = parseFloat(document.getElementById("expenseInput").value);

    chrome.storage.sync.get([budgetName], function(value) {
      var limit = parseFloat(value[budgetName][1]);
      var balance = parseFloat(value[budgetName][0]);
      var save = {};

      save[budgetName] = [balance + expense, limit];
      chrome.storage.sync.set(save);
    });
    
    //Clear inputs
    document.getElementById("expenseInput").value = "";

    console.log("Added Expense");
  }
  
  document.getElementById("errorMessage2").innerHTML = err;
}

/* listeners and global vars here */
document.addEventListener('DOMContentLoaded', populateBudgets);
var selector = document.getElementById('BudgetsMenu');

/* Add new budget to list */
let createBudget = document.getElementById("addBudget");
createBudget.onclick = function() {
  var err = "";
  
  if (!validateName() || !validateNumber("budgetLimitInput")) {
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

// Get the modal
var modal = document.getElementById("editModal");
var editBtn = document.getElementById("editBudget");
var editSpan = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
editBtn.onclick = function() {
  var budgetName = selector.options[selector.selectedIndex].value;
  
  if (budgetName != 'select an option...' ) {
    modal.style.display = "block";
  }
}

// When the user clicks on <span> (x), close the modal
editSpan.onclick = function() {
  var budgetName = selector.options[selector.selectedIndex].value;
  modal.style.display = "none";
  displayBudgetData(budgetName);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    var budgetName = selector.options[selector.selectedIndex].value;
    modal.style.display = "none";
    displayBudgetData(budgetName);
  }
}

/* INITIALIZATION OF THE CHART */
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