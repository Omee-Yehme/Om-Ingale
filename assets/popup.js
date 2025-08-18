document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup script loaded ✅"); // test

    // Open popup
    document.querySelectorAll(".btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var popupId = btn.getAttribute("data-popup");
            var popup = document.getElementsByClassName(.popup-overlay);
            if (popup) popup.style.display = "flex";
        });
    });

    // Close popup (X button)
    document.querySelectorAll(".popup-close").forEach(function (closeBtn) {
        closeBtn.addEventListener("click", function () {
            var overlay = closeBtn.closest(".popup-overlay");
            if (overlay) overlay.style.display = "none";
        });
    });

    // Close popup (click outside)
    document.querySelectorAll(".popup-overlay").forEach(function (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) overlay.style.display = "none";
        });
    });
});
