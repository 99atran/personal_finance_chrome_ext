'use strict';

function printBudgetPanels(key) {
  chrome.storage.sync.get([key], function (value) {

    var panelTitle = document.createElement("p");
    var titleTextNode = document.createTextNode(key);
    panelTitle.appendChild(titleTextNode);
    panelTitle.setAttribute("class", "panelTitle");

    var panelStatus = document.createElement("p");
    var statusTextNode = document.createTextNode("Broke Status: " + value[key][1].toFixed(2));
    panelStatus.appendChild(statusTextNode);

    var textDiv = document.createElement("div");
    textDiv.appendChild(panelTitle);
    textDiv.appendChild(panelStatus);

    var progressBar = document.createElement("div");
    progressBar.setAttribute("class", "progressBar");
    progressBar.style.width = (value[key][0]/value[key][1]).toFixed(2)*100+"%";
    var progressBase = document.createElement("div");
    progressBase.setAttribute("class", "progressBase");
    progressBase.style.width = "100%";

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

chrome.storage.sync.get(null, function(items) {
  var allKeys = Object.keys(items);
  allKeys.forEach(printBudgetPanels);
});

let newTab = document.getElementById('newTab');
newTab.onclick = function(element) {
  chrome.tabs.create({url: "homepage.html"});
};

