// function printBudgetData(key) {
//   chrome.storage.sync.get([key], function (value) {
    
// //debugging code
// var limit = value[key][1].toFixed(2); //toFixed returns String
// var balance = value[key][0].toFixed(2);
// if (balance == limit) {
//   console.log(key + ', with a limit of $' + limit +
//  '. Current balance is $' + balance + "equal");
// } else if (balance > limit){
//   console.log(key + ', with a limit of $' + limit +
//  '. Current balance is $' + balance + "over");
// } else {
//   console.log(key + ', with a limit of $' + limit +
//  '. Current balance is $' + balance + "good");
// }
//   });
// }


chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'budget_01': [60, 69.69]});
  chrome.storage.sync.set({'budget_02': [2.50, 13.00]});
  chrome.storage.sync.set({'budget_03': [999999.0, 123412.00]});
  chrome.storage.sync.set({'budget_04': [2000.0, 3255.01]});
  chrome.storage.sync.set({'budget_05': [0.0, 99.00]});

  // chrome.storage.sync.get(null, function(items) {
  //   var allKeys = Object.keys(items);
  //   allKeys.forEach(printBudgetData);
  // });
});

// this doesn't work
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
      // chrome.tabs.sendMessage(tabId, {
      //     message: 'hello',
      //     url: changeInfo.url
      // });
      chrome.tabs.executeScript({
        file: '../sites/amazon.js'
      });
      chrome.tabs.executeScript({
        code: 'remove_button()'
      });
      chrome.tabs.executeScript({
        code: 'locate_button()'
      });
  }    
});