

// @ts-nocheck

function initProductPopups(scope = document) {
    scope.querySelectorAll("[data-product-popup]").forEach(popup => {
        const blockId = popup.dataset.blockId;
        const variantsEl = document.getElementById(`variants-json-${blockId}`);
        if (!variantsEl) return;

        const variants = JSON.parse(variantsEl.textContent || "[]");

        // Elements scoped to this popup
        const btnGroup = popup.querySelector(".btns");
        const colorBtns = popup.querySelectorAll(".btns button[data-color]");

        const customSelect = popup.querySelector(".custom-select");
        const trigger = popup.querySelector(".custom-select-trigger");
        const triggerText = popup.querySelector(".trigger-text");
        const optionsWrap = popup.querySelector(".custom-options");
        const optionEls = popup.querySelectorAll(".custom-option");
        const sizeSelect = popup.querySelector(".size-select-hidden"); // hidden native select

        const form = popup.querySelector(".add-to-cart-form");
        if (!form) return;
        const variantInput = form.querySelector(".variant-id");
        const addBtn = form.querySelector("button[type=submit]");

        // State
        let selectedColor = null;
        let selectedSize = null;


        // ---------- Color selection + slider highlight ----------
        if (btnGroup && colorBtns.length) {
            let firstSelection = true; // track first click

            colorBtns.forEach((btn, idx) => {
                btn.addEventListener("click", () => {
                    selectedColor = btn.dataset.color;

                    // highlight active button text
                    colorBtns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    // reset slider
                    btnGroup.classList.remove("right-active");

                    // always show background after first click
                    btnGroup.classList.add("active");

                    if (firstSelection) {
                        // disable transition only on first click
                        btnGroup.classList.add("no-transition");
                    }

                    // put slider under correct button
                    if (idx === 1) {
                        btnGroup.classList.add("right-active");
                    }

                    if (firstSelection) {
                        // force reflow and re-enable transition
                        void btnGroup.offsetWidth;
                        btnGroup.classList.remove("no-transition");
                        firstSelection = false; // only once
                    }

                    updateVariant();
                });
            });
        }





        // ---------- Custom dropdown open/close ----------
        if (customSelect && trigger) {
            const arrow = customSelect.querySelector(".select-arrow");

            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                customSelect.classList.toggle("open");
                arrow && arrow.classList.toggle("active");
            });

            // close when clicking outside
            document.addEventListener("click", (e) => {
                if (!customSelect.contains(e.target)) {
                    customSelect.classList.remove("open");
                    arrow && arrow.classList.remove("active");
                }
            });
        }

        // ---------- Custom option click ----------
        optionEls.forEach(opt => {
            opt.addEventListener("click", () => {
                const value = opt.dataset.value;
                selectedSize = value;

                // update UI text
                if (triggerText) triggerText.textContent = value;

                // sync hidden select (so add-to-cart logic sees it)
                if (sizeSelect) {
                    sizeSelect.value = value;
                    sizeSelect.dispatchEvent(new Event("change", { bubbles: true }));
                }

                // close dropdown
                customSelect && customSelect.classList.remove("open");
                customSelect?.querySelector(".select-arrow")?.classList.remove("active");

                updateVariant();
            });
        });

        // ---------- Native hidden select change (kept for safety) ----------
        if (sizeSelect) {
            sizeSelect.addEventListener("change", () => {
                selectedSize = sizeSelect.value || null;
                if (triggerText && selectedSize) triggerText.textContent = selectedSize;
                updateVariant();
            });
        }

        // ---------- Variant resolver ----------
        function updateVariant() {
            if (!selectedColor || !selectedSize) {
                variantInput.value = "";
                if (addBtn) addBtn.disabled = true;
                return;
            }

            // Find variant whose options contain both selected color & size
            const match = variants.find(v =>
                v.options.includes(selectedColor) && v.options.includes(selectedSize)
            );

            if (match) {
                variantInput.value = match.id;
                if (addBtn) addBtn.disabled = false;
            } else {
                variantInput.value = "";
                if (addBtn) addBtn.disabled = true;
            }
        }

        // ---------- Guard against submitting without selections ----------
        if (addBtn) {
            addBtn.disabled = true;
            addBtn.addEventListener("click", (e) => {
                if (!selectedColor || !selectedSize || !variantInput.value) {
                    e.preventDefault();
                    alert("Please select both Color and Size.");
                }
            });
        }

        // ---------- Ajax add to cart ----------
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const variantId = variantInput.value;
            if (!variantId) return;

            try {
                const res = await fetch(window.Shopify.routes.root + "cart/add.js", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: variantId, quantity: 1 }),
                });

                if (!res.ok) throw new Error("Failed to add to cart");

                alert("Your product has been added to the cart! 🎉");
                window.location.href = "/cart";
            } catch (err) {
                console.error(err);
                alert("Error adding to cart");
            }
        });

        // ---------- Initial state ----------
        // (no defaults selected; keep button disabled until user picks)
        variantInput.value = "";
        addBtn && (addBtn.disabled = true);
    });
}

        // Run on first load
        document.addEventListener("DOMContentLoaded", () => {
            initProductPopups(document);
        });

        // Re-init when Shopify reloads sections
        document.addEventListener("shopify:section:load", (e) => {
            initProductPopups(e.target);
        });
