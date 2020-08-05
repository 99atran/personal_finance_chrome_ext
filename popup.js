// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let newTab = document.getElementById('newTab');
newTab.onclick = function(element) {
  chrome.tabs.create({url: "http://www.stackoverflow.com"});
};
