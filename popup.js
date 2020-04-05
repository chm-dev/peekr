var links = document.getElementsByTagName("a");

for ( var i = 0; i < links.length; i++ ) {
	links[i].onclick = loadLink;
}

function loadLink(e) {
	chrome.tabs.create({url: e.currentTarget.href});
	e.preventDefault();
};
