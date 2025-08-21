// @ts-nocheck
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ addcart.js loaded");

  document.querySelectorAll("[data-product-popup]").forEach((popup) => {
    const productData = JSON.parse(popup.getAttribute("data-product-json"));
    const blockId = popup.getAttribute("data-block-id");

    const sizeSelect = popup.querySelector(`#product-size-${blockId}`);
    const variantInput = popup.querySelector(`#variant-id-${blockId}`);
    const form = popup.querySelector("form");

    if (!form) return;

    // 🔹 Function to update hidden variant input
    function updateVariant() {
      const selectedSize = sizeSelect?.value;
      const activeColorBtn = popup.querySelector(".btns button.active");
      const selectedColor = activeColorBtn ? activeColorBtn.textContent.trim() : null;

      if (!selectedColor || !selectedSize) {
        variantInput.value = "";
        return;
      }

      const selectedOptions = [selectedColor, selectedSize];

      const matchedVariant = productData.variants.find((v) => {
        return JSON.stringify(v.options) === JSON.stringify(selectedOptions);
      });

      if (matchedVariant) {
        variantInput.value = matchedVariant.id;
        console.log("✅ Variant updated:", matchedVariant);
      } else {
        variantInput.value = "";
        console.warn("⚠️ No variant found for:", selectedOptions);
      }
    }

    // 🔹 Handle color button clicks
    popup.querySelectorAll(".btns button").forEach((btn) => {
      btn.addEventListener("click", () => {
        popup.querySelectorAll(".btns button").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        updateVariant();
      });
    });

    // 🔹 Handle size change
    sizeSelect?.addEventListener("change", updateVariant);

    // 🔹 Handle Add to Cart
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!variantInput.value) {
        alert("Please select both color and size before adding to cart.");
        return;
      }

      const formData = new FormData(form);

      try {
        const res = await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });

        if (!res.ok) throw new Error("Failed to add to cart");

        const cartData = await res.json();
        console.log("🛒 Added to cart:", cartData);

        // Redirect to cart
        window.location.href = "/cart";
      } catch (err) {
        console.error("❌ Error adding to cart:", err);
      }
    });
  });
});
