const routers = document.querySelectorAll('[data-router]');
const content = document.querySelector('section');
const pages = Array.from(document.querySelectorAll('[data-page]')); // Must convert to array to preserve elements
const origin = location.origin + '/Client-Side-Routing';
// Display the appropriate page based on the URL path (does NOT modify browser history)
function showPage(path) {
	if (path === '' || path === 'index.html') {
		path = 'home';
	}

	let match = false;
	for (const page of pages) {
		if (page.dataset.route === path) {
			content.appendChild(page);
			match = true;
		}
		else {
			page.remove();
		}
	}
	if (!match) {
		// MUST redirect to a page where the web server serves an actual 404 error (i.e. not just 
		// index.html again) otherwise this triggers an infinite loop
		location.href = origin + '/errors/NotFound';
	}
}

// Update the browser history, then show page
function route(path) {
	// If the new page is equal to the current page, don't do anything
	if (location.pathname.substring(1) === path) {
		return;
	}
	window.history.pushState({}, '', new URL(path, origin));

	showPage(path);
}

// Set event handlers
for (const router of routers) {
	router.addEventListener('click', e => {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
			return; // Use default behavior if any keyboard modifier is applied to the click
		}

		e.preventDefault();
		route(e.target.dataset.route);
	});
}
window.addEventListener('popstate', _ => showPage(location.pathname.substring(1)));

// Show the current URL (to support direct linking aka deep links)
showPage(location.pathname.substring(1));
