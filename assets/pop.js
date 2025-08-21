// @ts-nocheck

document.addEventListener("click", function (event) {
    // Open Popup when click on Marker Button
    if (event.target.matches(".btn[data-popup]")) {
        event.preventDefault();
        const targetId = event.target.getAttribute("data-popup");
        const popup = document.getElementById(targetId);
        if (popup) {
        popup.style.display = "flex"; // show popup overlay
        }
    }

    // Close Popup when click on Close Button
    if (event.target.matches(".custom-popup-close")) {
        const popup = event.target.closest(".custom-popup-overlay");
        if (popup) {
        popup.style.display = "none";
        }
    }

    // Close when clicking outside the content
    if (event.target.classList.contains("custom-popup-overlay")) {
        event.target.style.display = "none";
    }
    });

    // For Button Slider






