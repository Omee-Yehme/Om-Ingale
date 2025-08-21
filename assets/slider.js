// @ts-nocheck
console.log("Slider.js loaded");

// Handle color button clicks
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btns button");
  if (!btn) return;
  e.preventDefault();

  const group = btn.closest(".btns");
  const buttons = [...group.querySelectorAll("button")];

  // highlight animation
  group.classList.add("active");
  buttons.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  group.classList.add("touched");

  // 🔹 Update hidden variant input
  const popup = btn.closest("[data-product-popup]");
  if (!popup) return;

  const productData = JSON.parse(popup.getAttribute("data-product-json"));
  const blockId = popup.getAttribute("data-block-id");
  const variantInput = popup.querySelector(`#variant-id-${blockId}`);
  const sizeSelect = popup.querySelector(`#product-size-${blockId}`);

  let selectedSize = sizeSelect ? sizeSelect.value : null;
  let selectedColor = btn.innerText.trim();

  const selectedOptions = [];
  if (selectedColor) selectedOptions.push(selectedColor);
  if (selectedSize) selectedOptions.push(selectedSize);

  const matchedVariant = productData.variants.find(
    (v) => JSON.stringify(v.options) === JSON.stringify(selectedOptions)
  );

  if (matchedVariant) {
    variantInput.value = matchedVariant.id;
    console.log("Variant updated from color click:", matchedVariant);
  } else {
    console.warn("No variant found for:", selectedOptions);
  }
});

// Handle size dropdown changes
document.addEventListener("change", (e) => {
  if (!e.target.matches(".size-select")) return;

  const popup = e.target.closest("[data-product-popup]");
  if (!popup) return;

  const productData = JSON.parse(popup.getAttribute("data-product-json"));
  const blockId = popup.getAttribute("data-block-id");
  const variantInput = popup.querySelector(`#variant-id-${blockId}`);

  const size = e.target.value;
  const colorBtn = popup.querySelector(".btns button.active");
  const color = colorBtn ? colorBtn.innerText.trim() : null;

  const selectedOptions = [];
  if (color) selectedOptions.push(color);
  if (size) selectedOptions.push(size);

  const matchedVariant = productData.variants.find(
    (v) => JSON.stringify(v.options) === JSON.stringify(selectedOptions)
  );

  if (matchedVariant) {
    variantInput.value = matchedVariant.id;
    console.log("Variant updated from size change:", matchedVariant);
  } else {
    console.warn("No variant found for:", selectedOptions);
  }
});
