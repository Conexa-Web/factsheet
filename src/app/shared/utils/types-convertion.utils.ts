export function redirectToLogin() {
	let host = window.location.origin;
	let url = window.location.pathname;
	window.location.href = (url != '/') ? `${host}/?redirect=${url}` : `${host}/`;
}