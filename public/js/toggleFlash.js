const flash = document.querySelector(".flash");
const closeButton = document.querySelector(".flash__close");

function hideFlash() {
	flash.style.display = "none";
}

if (flash) {
	setTimeout(hideFlash, 3000);
}

if (closeButton) {
	closeButton.onclick = hideFlash;
}
