function saveChanges() {
  // Get a value saved in a form.
  var theValue = textarea.value;
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
}

function getReport() {
  chrome.storage.sync.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
  });
}

let save_button = document.getElementById('button');
save_button.onclick = function(element) {
  saveChanges();
};