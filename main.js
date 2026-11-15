// Argus website: scroll-linked stages, reveals, and copy buttons. No dependencies.
(() => {
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stages = Array.from(document.querySelectorAll('[data-stage]'));

  // ---- Pinned stages: write progress (0..1) to --p and the active step to data-active ----
  function setActive(stage, index) {
    if (stage.dataset.active === String(index)) return;
    stage.dataset.active = String(index);
    stage.querySelectorAll('[data-step]').forEach(li => {
      li.classList.toggle('active', Number(li.dataset.step) === index);
    });
  }

  function update() {
    const vh = window.innerHeight;
    for (const stage of stages) {
      const rect = stage.getBoundingClientRect();
      const travel = rect.height - vh;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      stage.style.setProperty('--p', p.toFixed(4));
      const steps = Number(stage.dataset.steps || 0);
      if (steps) setActive(stage, Math.min(steps - 1, Math.floor(p * steps)));
    }
  }

  if (reduceMotion) {
    // Everything in its final state; show all steps.
    for (const stage of stages) {
      stage.style.setProperty('--p', '1');
      const steps = Number(stage.dataset.steps || 0);
      if (steps) {
        stage.dataset.active = String(steps - 1);
        stage.querySelectorAll('[data-step]').forEach(li => li.classList.add('active'));
      }
    }
  } else {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // ---- Reveal on enter ----
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  }

  // ---- Copy buttons ----
  document.querySelectorAll('.copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = document.getElementById(btn.dataset.copy)?.innerText ?? '';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Select and copy';
      }
      setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
    });
  });
})();
