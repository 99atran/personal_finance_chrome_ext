function saveChanges() {
  // Get a value saved in a form.
  var textarea = document.getElementById('itemName');
  var theValue = textarea.value;
  console.log('now' + theValue);
  // Check that there's some code there.
  if (!theValue) {
    message('Error: No value specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'key': theValue}, function() {
    // Notify that we saved.
    message('Settings saved');
  });

  window.alert('the value now' + theValue);
}

function getReport() {
  var textarea = document.getElementById('itemName');
  var theValue = textarea.value;
  chrome.storage.sync.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
    window.alert('the value is' + theValue);
  });
}

var addItem = document.getElementById('addItem');
var newTab = document.getElementById('newTab');

addItem.onclick = function(element) {
  preventDefault();
  saveChanges();
};

newTab.onclick = function(element) {
  getReport();
}
