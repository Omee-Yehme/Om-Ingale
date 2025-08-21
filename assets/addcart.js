// @ts-nocheck

function initProductPopups(scope = document) {
    scope.querySelectorAll("[data-product-popup]").forEach(popup => {
        const blockId = popup.dataset.blockId;

        // Parse variants JSON
        const variants = JSON.parse(
        document.getElementById(`variants-json-${blockId}`).textContent
        );

        // Elements
        const colorBtns = popup.querySelectorAll(".btns button[data-color]");
        const sizeSelect = popup.querySelector(".size-select");
        const form = popup.querySelector(".add-to-cart-form");
        const variantInput = form.querySelector(".variant-id");
        const addBtn = form.querySelector("button[type=submit]");
        const debugColor = popup.querySelector(".selected-color");
        const debugSize = popup.querySelector(".selected-size");
        const debugVariant = popup.querySelector(".selected-variant");

        // Track selections
        let selectedColor = null;
        let selectedSize = null;

        // Update debug info (optional)
        function updateDebug() {
        if (debugColor) debugColor.textContent = selectedColor || "-";
        if (debugSize) debugSize.textContent = selectedSize || "-";
        if (debugVariant) debugVariant.textContent = variantInput.value || "-";
        }

        // Try to find matching variant
        function updateVariant() {
        if (!selectedColor || !selectedSize) {
            variantInput.value = "";
            addBtn.disabled = true;
            updateDebug();
            return;
        }

        let match = variants.find(v =>
            v.options.includes(selectedColor) && v.options.includes(selectedSize)
        );

        if (match) {
            variantInput.value = match.id;
            addBtn.disabled = false;
        } else {
            variantInput.value = "";
            addBtn.disabled = true;
        }

        updateDebug();
        }

        // Color button click
        colorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            selectedColor = btn.dataset.color;

            // Highlight active color
            colorBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            updateVariant();
        });
        });

        // Size change
        if (sizeSelect) {
        sizeSelect.addEventListener("change", () => {
            selectedSize = sizeSelect.value || null;
            updateVariant();
        });
        }

    // Add to cart form submit
    form.addEventListener("submit", async e => {
    e.preventDefault();

    const variantId = variantInput.value;
    if (!variantId) return;

    try {
        const res = await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (!res.ok) throw new Error("Failed to add to cart");
        const data = await res.json();
        console.log("Added to cart:", data);

        // ✅ Show alert
        alert("Your product has been added to the cart!");

        // ✅ Redirect to cart page
        window.location.href = "/cart";
    } catch (err) {
        console.error(err);
        alert("Error adding to cart");
    }
    });


        // Initialize with defaults
        if (sizeSelect && sizeSelect.value) selectedSize = sizeSelect.value;
        const activeColorBtn = popup.querySelector(".btns button.active[data-color]");
        if (activeColorBtn) selectedColor = activeColorBtn.dataset.color;

        updateVariant();
    });
}

// Run on first page load
document.addEventListener("DOMContentLoaded", () => initProductPopups());

// Run when Shopify dynamically reloads sections
document.addEventListener("shopify:section:load", e => {
  initProductPopups(e.target); // re-init only inside the loaded section
});


