// function saveChanges() {
//   // Get a value saved in a form.
//   var textarea = document.getElementById('itemName');
//   var theValue = textarea.value;
//   console.log('now' + theValue);
//   // Check that there's some code there.
//   if (!theValue) {
//     message('Error: No value specified');
//     return;
//   }
//   // Save it using the Chrome extension storage API.
//   chrome.storage.sync.set({'budgets_list': theValue}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });

//   window.alert('the value now' + theValue);
// }

// function getReport() {
//   var textarea = document.getElementById('itemName');
//   var theValue = textarea.value;
//   chrome.storage.sync.get(['key'], function(result) {
//     console.log('Value currently is ' + result.key);
//     window.alert('the value is' + theValue);
//   });
// }

function addBudget() {
  return;
}

/* listeners here */

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

