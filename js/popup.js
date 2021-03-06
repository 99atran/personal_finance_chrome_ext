'use strict';

/* This function generates the html components for the budget cards in the popup */
function printBudgetPanels(key) {
  chrome.storage.sync.get([key], function (value) {
    
    var limit = parseFloat(value[key][1]);
    var balance = parseFloat(value[key][0]);
    
    //Panel Text
    var panelTitle = document.createElement("p");
    var titleTextNode = document.createTextNode(key);
    panelTitle.appendChild(titleTextNode);
    panelTitle.setAttribute("class", "panelTitle");

    var panelStatus = document.createElement("p");
    var statusTextNode = document.createTextNode("Broke Status: $" +balance.toFixed(2) +" / $" +limit.toFixed(2));
    panelStatus.appendChild(statusTextNode);

    var textDiv = document.createElement("div");
    textDiv.appendChild(panelTitle);
    textDiv.appendChild(panelStatus);

    //Progress Bar
    var progressBar = document.createElement("div");
    progressBar.setAttribute("class", "progressBar");

    if (balance >= limit) {
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "darkred";
    } else {
      if ((balance/limit)*100 >= 75) {
        progressBar.style.backgroundColor = "orange";
      } else if ((balance/limit)*100 >= 50) {
        progressBar.style.backgroundColor = "gold";
      }

      progressBar.style.width = (balance/limit)*100+"%";
    }
    
    
    var progressBase = document.createElement("div");
    progressBase.setAttribute("class", "progressBase");
    progressBase.style.width = 100-(balance/limit)*100+"%";

    var progressBarDiv = document.createElement("div");
    progressBarDiv.setAttribute("class", "flex-container");
    progressBarDiv.appendChild(progressBar);
    progressBarDiv.appendChild(progressBase);

    var panel = document.createElement("div");
    panel.setAttribute("class", "budgetPanel");
    panel.setAttribute("id", key);
    panel.appendChild(textDiv);
    panel.appendChild(progressBarDiv);

    var ul = document.getElementById("popupPanelList");
    ul.appendChild(panel);
  });
}

/* Gets the users budget data to generate popup cards */
chrome.storage.sync.get(null, function(items) {
  var allKeys = Object.keys(items);
  allKeys.forEach(printBudgetPanels);
});

/* Create a new tab for the homepage from the "Advanced Reports Button" */
let newTab = document.getElementById('newTab');
newTab.onclick = function(element) {
  chrome.tabs.create({url: "../html/homepage.html"});
};

