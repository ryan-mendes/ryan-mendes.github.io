(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON = (name, variant = 'original') =>
    `https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/${name}/${name}-${variant}.svg`;

  /* ---------- Split the hero name into animated letters ---------- */
  let index = 0;
  document.querySelectorAll('.split').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = ch;
      span.style.setProperty('--i', index++);
      el.appendChild(span);
    }
  });

  /* ---------- Orbiting technology stack ---------- */
  const stage = document.getElementById('stage');
  const orbitEl = document.getElementById('orbit');

  const rings = [
    {
      // inner ring: core stack
      rx: 0.42, ry: 0.12, cy: 0.56, tilt: -9, speed: 0.22, small: false,
      items: [
        ['TypeScript', ICON('typescript')],
        ['Node.js', ICON('nodejs')],
        ['React', ICON('react')],
        ['PostgreSQL', ICON('postgresql')],
        ['JavaScript', ICON('javascript')],
        ['NestJS', ICON('nestjs')],
      ],
    },
    {
      // outer ring: tools, counter-rotating
      rx: 0.55, ry: 0.17, cy: 0.42, tilt: 7, speed: -0.14, small: true,
      items: [
        ['Next.js', ICON('nextjs'), true],
        ['Docker', ICON('docker')],
        ['Git', ICON('git')],
        ['Supabase', ICON('supabase')],
        ['Express', ICON('express'), true],
        ['Python', ICON('python')],
      ],
    },
  ];

  const chips = [];
  rings.forEach((ring, r) => {
    ring.items.forEach(([label, src, invert], i) => {
      const chip = document.createElement('div');
      chip.className = `chip${ring.small ? ' chip--sm' : ''}${invert ? ' chip--invert' : ''}`;
      chip.title = label;
      const img = document.createElement('img');
      img.src = src;
      img.alt = label;
      img.width = 28;
      img.height = 28;
      img.decoding = 'async';
      chip.appendChild(img);
      orbitEl.appendChild(chip);
      chips.push({ el: chip, ring, phase: (i / ring.items.length) * Math.PI * 2 + r * 0.5 });
    });
  });

  let width = 0;
  let height = 0;
  const measure = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
  };
  measure();
  window.addEventListener('resize', measure);

  const INTRO_START = 1.9; // seconds: chips appear after the portrait is lit
  const INTRO_LENGTH = 1.4;
  const start = performance.now();

  function frame(now) {
    const t = (now - start) / 1000;
    const intro = reduceMotion ? 1 : Math.min(Math.max((t - INTRO_START) / INTRO_LENGTH, 0), 1);
    const eased = 1 - Math.pow(1 - intro, 3);
    const time = reduceMotion ? 0 : t;

    for (const { el, ring, phase } of chips) {
      const angle = phase + time * ring.speed;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const tilt = (ring.tilt * Math.PI) / 180;

      // point on the ellipse, then tilted around the ring centre
      const fit = width < 420 ? 0.86 : 1; // keep the outer ring on screen on phones
      const ex = cos * ring.rx * fit * width * (0.85 + 0.15 * eased);
      const ey = sin * ring.ry * width;
      const x = width / 2 + ex * Math.cos(tilt) - ey * Math.sin(tilt);
      const y = height * ring.cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);

      const depth = (sin + 1) / 2; // 0 = far side, 1 = nearest to the viewer
      const scale = 0.68 + 0.32 * depth;
      const front = sin > 0;

      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.opacity = String((0.35 + 0.65 * depth) * eased);
      el.style.filter = front ? 'none' : `blur(${(1 - depth) * 1.6}px)`;
      el.style.zIndex = front ? '3' : '1';
    }

    if (!reduceMotion) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Subtle parallax on the stage ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    window.addEventListener('pointermove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    const tiltLoop = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      stage.style.transform = `rotateY(${currentX * 5}deg) rotateX(${-currentY * 4}deg) translate3d(${currentX * -8}px, ${currentY * -6}px, 0)`;
      requestAnimationFrame(tiltLoop);
    };
    tiltLoop();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const siblings = [...entry.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
          entry.target.style.transitionDelay = `${Math.max(siblings.indexOf(entry.target), 0) * 90}ms`;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Card spotlight follows the cursor ---------- */
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Nav background on scroll ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
