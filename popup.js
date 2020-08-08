// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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

    var panel = document.createElement("div");
    panel.appendChild(panelTitle);
    panel.appendChild(panelStatus);
    panel.setAttribute("class", "budgetPanel");
    panel.setAttribute("id", key);

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

