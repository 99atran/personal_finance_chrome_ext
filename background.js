function printBudgetData(key) {
  chrome.storage.sync.get([key], function (value) {
    console.log(key + ', with a limit of $' + value[key][1].toFixed(2) +
     '. Current balance is $' + value[key][0].toFixed(2));
    // console.log(value);
  });
}


chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'budget_01': [0.0, 69.69]});
  chrome.storage.sync.set({'budget_02': [0.0, 13.00]});
  chrome.storage.sync.set({'budget_03': [0.0, 123412.00]});
  chrome.storage.sync.set({'budget_04': [0.0, 3255.01]});
  chrome.storage.sync.set({'budget_05': [0.0, 99.00]});

  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    allKeys.forEach(printBudgetData);
  });
});