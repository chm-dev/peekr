(function() {
  'use strict';
  let lastOverElement = false;
  let backupBodyStyle = '';

  // popup dark mask
  const previewOvrly = document.createElement('div');
  previewOvrly.style.cssText =
    'position: fixed; width: 100%; height: 100%; left: 0%; top: 0%; background-colo' +
    'r: rgba(0,0,0,0.2); backdrop-filter: blur(3px); display: none; z-index: ' +
    Number.MAX_SAFE_INTEGER +
    ';';
  previewOvrly.addEventListener('click', function() {
    closeModal();
  });

  // popup
  const previewIfrm = document.createElement('iframe');
  previewIfrm.setAttribute(
    'sandbox',
    'allow-forms allow-modals allow-same-origin allow-scripts allow-popups allow-po' +
      'pups-to-escape-sandbox'
  );
  previewIfrm.style.cssText =
    'position: fixed; width: 90%; height: 90%; left: 5%; top: 5%; border: 0;backgro' +
    'und: white; display: none; z-index: ' +
    Number.MAX_SAFE_INTEGER +
    '; box-shado' +
    'w: 4px 4px 10px rgba(0,0,0,0.35); border-radius: 6px';

  let links = document.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('mouseover', linkOver);
    links[i].addEventListener('mouseout', linkOut);
  }
  // remember last hovered link
  function linkOver(e) {
    lastOverElement = e.currentTarget;
  }
  // mouse exit from link
  function linkOut() {
    lastOverElement = false;
  }
  const closeModal = _ => {
    document.body.style.overflow = backupBodyStyle;
    previewOvrly.style.display = 'none';
    previewIfrm.style.display = 'none';
    previewIfrm.src = 'about:blank';
    window.focus();
  };
  const modalOnScreen = _ => {
    if (
      previewIfrm.style.display == 'block' &&
      previewIfrm.src.trim() != '' &&
      previewIfrm.src != 'about:blank'
    )
      return true;
    else return false;
  };

  // handle the SHIFT key
  window.addEventListener('keyup', function(e) {
    if (e.keyCode == 16) {
      // user presses SHIFT key - handle window shenaningans
      if (modalOnScreen())
        chrome.runtime.sendMessage({ openInWindow: previewIfrm.src });
      else if (lastOverElement) {
        // if user hovers the mouse to any link
        backupBodyStyle = document.body.style.overflow;
        previewIfrm.src = lastOverElement.href;
        previewOvrly.style.display = 'block';
        previewIfrm.style.display = 'block';
      }
    }
  });
  window.addEventListener('keyup', function(e) {
    if (e.keyCode == 27) {
      //escape
      if (modalOnScreen()) closeModal();
    }
  });
  // add popup to body
  document.body.appendChild(previewOvrly);
  document.body.appendChild(previewIfrm);
})();
