import { css as generalCSS } from './assets/assets.js';
let backupBodyStyle = '';
const iframeSandbox =
  'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popup' +
  's allow-presentation allow-same-origin allow-scripts';
const hoverTimeBeforeCache = 500; //time before href is loaded to cache iframe
let cached = [];
const glowingBorderSize = 8; //pixels

const previewStyles = document.createElement('style');
previewStyles.innerHTML = generalCSS;

const previewOvrly = document.createElement('div');
previewOvrly.id = 'peekr_overlay';

previewOvrly.addEventListener('click', function() {
  closeModal();
});

//frame
const previewIfrm = document.createElement('iframe');
previewIfrm.setAttribute('id', 'peekr_iframe');
previewIfrm.setAttribute('sandbox', iframeSandbox);
previewIfrm.setAttribute('referrerpolicy', 'same-origin');

//spinner
const previewGlowingBorderContainer = document.createElement('div');

//hidden caching iframe
const cachingIfrm = document.createElement('iframe');
cachingIfrm.style.display = 'none';

previewGlowingBorderContainer.id = 'peekr_loading_border_container';
const previewGlowingBorder = document.createElement('div');
previewGlowingBorder.id = 'peekr_loading_border';
previewGlowingBorderContainer.appendChild(previewGlowingBorder);
//previewGlowingBorderContainer. = '<div id="peekr_loading_border"></div>';

const closeModal = _ => {
  const html = document.querySelector('html');
  html.style.overflow = backupBodyStyle;
  setTimeout(() => {
    previewOvrly.classList.add('pkr_anim', 'overlayOut');
  }, 200);

  previewIfrm.classList.add('iframeOut', 'pkr_anim');
  window.focus();
  return true;
};

const loadModal = url => {
  //previewIfrm.style.visibility = 'none';
  previewIfrm.src = url;
  previewIfrm.addEventListener('load', handlePreviewLoaded);
  document
    .querySelectorAll('a[href]')
    .forEach(el => el.addEventListener('mouseenter', cacheThis));
};

const cacheThis = ev => {
  const el = ev.target;
  if (el.hasAttribute('href') && !cached.includes(el.href))
    try {
      const urlToCache = new URL(el.href).href;
      const clearTo = ev => {
        clearTimeout(timeout);
      };
      const timeout = setTimeout(() => {
        cachingIfrm.src = urlToCache;
        el.removeEventListener('mouseleave', clearTo);
        console.log('caching ' + cachingIfrm.src);
      }, hoverTimeBeforeCache);
      el.addEventListener('mouseleave', clearTo);
    } catch (e) {
      console.error(e);
      return;
    }
};

const handlePreviewLoaded = ev => {
  previewIfrm.removeEventListener('load', handlePreviewLoaded);
  previewGlowingBorderContainer.classList.add('fadeOut', 'pkr_anim');
  const html = document.querySelector('html');
  previewOvrly.classList.add('pkr_anim', 'overlayIn');
  backupBodyStyle = html.style.overflow;
  html.style.overflow = 'hidden';
  setTimeout(() => {
    previewIfrm.classList.add('pkr_anim', 'iframeIn');
  }, 200);
};

const modalOnScreen = _ => {
  return previewIfrm.style.display == 'block' &&
    previewIfrm.src &&
    previewIfrm.src.trim() != '' &&
    previewIfrm.src != 'about:blank'
    ? true
    : false;
};
//shift state
const modUpHandler = e => {
  if (e.keyCode == 16) {
    window.addEventListener('keydown', modDownHandler);
    // user presses SHIFT key - handle window shenanigans
    if (modalOnScreen())
      chrome.runtime.sendMessage({ openInWindow: previewIfrm.src });
    else {
      chrome.runtime.sendMessage({ modState: 'keyup' });
      modState = 'up';
    }
  }
};

const modDownHandler = e => {
  if (e.keyCode == 16) {
    chrome.runtime.sendMessage({ modState: 'keydown' });
    window.removeEventListener('keydown', modDownHandler);
    modState = 'down';
  }
};
// window.addEventListener('keydown', modDownHandler);
// window.addEventListener('keyup', modUpHandler); escape
window.addEventListener('keydown', function(e) {
  if (e.keyCode == 27) {
    return modalOnScreen() ? closeModal() : false;
  }
});

window.addEventListener('click', ev => {
  ev.stopPropagation();
  if (ev.shiftKey) {
    if (typeof ev.path === 'object')
      var links = ev.path.filter(
        el => (el.tagName === 'A' && el.href ? el : null)
      );
    if (links.length > 0) {
      ev.stopPropagation();
      ev.preventDefault();

      loadModal(links[0].href);
      showGlowingBorder(links[0]);
    }
  }
});

const showGlowingBorder = linkElement => {
  // rect.top, rect.left, rect.width
  const linkRect = linkElement.getBoundingClientRect();
  const mrgn = glowingBorderSize;
  console.log(
    `
    top: ${Math.floor(linkRect.top) - mrgn}px;
  left: ${Math.floor(linkRect.left) - mrgn}px;
  width: ${Math.floor(linkRect.width) + mrgn * 2}px; 
  height: ${Math.floor(linkRect.height) + mrgn * 2}px; `
  );

  previewGlowingBorderContainer.style.opacity = 0;
  previewGlowingBorderContainer.style = `
  top: ${Math.floor(linkRect.top) - mrgn + pageYOffset}px;
  left: ${Math.floor(linkRect.left) - mrgn}px;
  width: ${Math.floor(linkRect.width) + mrgn * 2}px; 
  height: ${Math.floor(linkRect.height) + mrgn * 2}px; 
  display: block;`;
  previewGlowingBorderContainer.classList.add('fadeIn', 'pkr_anim');
};
// add popup to body
document.head.appendChild(previewStyles);
document.body.appendChild(previewOvrly);
document.body.appendChild(previewIfrm);

previewGlowingBorderContainer.addEventListener('animationend', ev => {
  previewGlowingBorderContainer.classList.remove('pkr_anim', ev.animationName);
  previewGlowingBorderContainer.style.display = ev.animationName.match(/Out/)
    ? 'none'
    : 'block';
});

previewOvrly.addEventListener('animationend', ev => {
  previewOvrly.classList.remove('pkr_anim', ev.animationName);
  previewOvrly.style.display = ev.animationName.match(/Out/) ? 'none' : 'block';
});
previewIfrm.addEventListener('animationend', ev => {
  previewIfrm.classList.remove('pkr_anim', ev.animationName);
  if (ev.animationName.match(/Out/)) {
    previewIfrm.src = 'about:blank';
    previewIfrm.style.display = 'none';
  } else previewIfrm.style.display = 'block';
});

if (['about:blank', '', undefined].includes(cachingIfrm.src)) {
  document.body.appendChild(previewGlowingBorderContainer);
  document.body.appendChild(cachingIfrm);
  cachingIfrm.addEventListener('load', ev => {
    if (cachingIfrm.src != ('about:blank' || '' || undefined)) {
      cached.push(cachingIfrm.src);
      console.log('cached: ' + cachingIfrm.src);
      console.log(cached);

      cachingIfrm.src = 'about:blank';
    }
    return;
  });
}
