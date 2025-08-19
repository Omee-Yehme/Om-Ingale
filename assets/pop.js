document.addEventListener("click", function (event) {
    // Open Popup when click on Marker Button
    // @ts-ignore
    if (event.target.matches(".btn[data-popup]")) {
        event.preventDefault();
        // @ts-ignore
        const targetId = event.target.getAttribute("data-popup");
        const popup = document.getElementById(targetId);
        if (popup) {
        popup.style.display = "flex"; // show popup overlay
        }
    }

    // Close Popup when click on Close Button
    // @ts-ignore
    if (event.target.matches(".custom-popup-close")) {
        // @ts-ignore
        const popup = event.target.closest(".custom-popup-overlay");
        if (popup) {
        popup.style.display = "none";
        }
    }

    // Close when clicking outside the content
    // @ts-ignore
    if (event.target.classList.contains("custom-popup-overlay")) {
        // @ts-ignore
        event.target.style.display = "none";
    }
    });

