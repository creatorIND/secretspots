// Handle file upload input and its text
const fileInputs = document.querySelectorAll(".form__file-input");

Array.prototype.forEach.call(fileInputs, function (input) {
	const fileLabel = input
		.closest(".form__group")
		.querySelector(".form__file-text");
	if (!fileLabel) return;

	const fileLabelText = fileLabel.textContent;

	input.addEventListener("change", function (e) {
		let fileName = "";
		if (this.files && this.files.length > 1) {
			fileName = (
				this.getAttribute("data-multiple-caption") || ""
			).replace("{count}", this.files.length);
		} else {
			fileName = e.target.value.split("\\").pop();
		}

		if (fileName) {
			fileLabel.textContent = fileName;
		} else {
			fileLabel.textContent = fileLabelText;
		}
	});
});

// Invoke file upload when navigating using keyboard
document
	.querySelectorAll(".form__file-visible-input")
	.forEach(function (visibleInput) {
		visibleInput.addEventListener("keydown", function (e) {
			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				const fileInput =
					this.closest(".form__group").querySelector(
						".form__file-input"
					);
				if (fileInput) {
					fileInput.click();
				}
			}
		});
	});
