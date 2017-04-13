var browser = chrome || browser;

// define matches methode according to browser
var elementProto = Element.prototype;
var matchesFn = ['webkit', 'ms', 'moz', 'o'].reduce((func, prefix) => {
  var prefixedFuncName = `${prefix}MatchesSelector`;
  if (elementProto.hasOwnProperty(prefixedFuncName)) {
    return elementProto[prefixedFuncName];
  }

  return func;
}, elementProto.matches);

// find node in terms of selector
function passedThrough(evt, selector) {
  var currentNode = evt.target;
  var stopAt = evt.currentTarget;

  while (true) {
    if (matchesFn.call(currentNode, selector)) {
      return currentNode;
    } else if (currentNode !== stopAt && currentNode !== document.body) {
      currentNode = currentNode.parentNode;
    } else {
      return false;
    }
  }
}

function isRightButton(e) {
  var e = e || window.event;
  if (e.which == null) {
    return e.button >= 2 && e.button !== 4; // 4 is the middle button
  }

  return e.which > 2;
}

// sendMessage callback
var callback = function(url) {
  return function(resp) {
    if (resp) {
      console.log('Opened URL: ', url, ' in a new incognito window.');
    } else {
      console.error('Failed to open the URL: ', url);
    }
  }
}

document.addEventListener('click', (evt) => {
  if (!isRightButton(evt)) {
    var found = passedThrough(evt, 'a[target="linkognito"]');

    if (found) {
      evt.preventDefault();
      let url = found.getAttribute('href')
      if (!url.startsWith('http')) {
        if (url.startsWith('/')){
          url = `${window.location.origin}${url}`
        } else {
          url = `${window.location.href}/${url}`
        }
      }

      browser.runtime.sendMessage({ url: url }, callback(url));
    }
  }
});