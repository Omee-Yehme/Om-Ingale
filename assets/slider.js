
    // @ts-nocheck
    document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btns button');
    if (!btn) return;
    e.preventDefault();

    const group = btn.closest('.btns');
    const [btn1, btn2] = group.querySelectorAll('button');

    group.classList.add('active'); // make background visible

    if (btn === btn2) {
        // Right button clicked
        if (!group.classList.contains('touched')) {
        // First ever click is on right → jump instantly (no slide)
        group.classList.add('no-transition');
        group.classList.add('right-active');

        requestAnimationFrame(() => {
            group.classList.remove('no-transition');
        });
        } else {
        // Normal smooth slide
        group.classList.add('right-active');
        }

        btn2.classList.add('active');
        btn1.classList.remove('active');
    } else {
        // Left button clicked
        group.classList.remove('right-active');
        btn1.classList.add('active');
        btn2.classList.remove('active');
    }

    // Mark group as interacted
    group.classList.add('touched');
    });



        


