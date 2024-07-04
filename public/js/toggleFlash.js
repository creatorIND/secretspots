const flash = document.querySelector(".flash");
const closeButton = document.querySelector(".flash__close");

if (closeButton) {
	closeButton.onclick = function () {
		flash.style.opacity = 0;
	};
}
