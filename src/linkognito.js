var browser = chrome || browser;
var links = document.querySelectorAll('a[target="linkognito"]');

const callback = function(url) {
  return function(resp) {
    if (resp) {
        console.log('Opened URL: ', url, ' in a new incognito window.');
    } else {
        console.error('Failed to open the URL: ', url);
    }
  }
}

for (var i = 0; i < links.length; i++) {
  links.item(i).addEventListener('click', function(evt) {
    evt.preventDefault();
    var targetElement = evt.target;

    if (targetElement !== null) {
      console.log(browser);
      browser.runtime.sendMessage({ url: evt.currentTarget.href }, callback(targetElement.href));
    }
  }, false)
}