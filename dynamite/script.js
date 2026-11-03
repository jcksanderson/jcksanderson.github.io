/* DYNAMITE DAILY
 * Every YouTube slot starts as YouTube's own thumbnail (cheap) and only becomes
 * a real player when clicked. Other platforms load as real iframes, staggered,
 * once they're near the screen.
 */
(() => {
  'use strict';

  const DYNAMITE = { id: 'VUjdiDeJ0xg', title: 'Taio Cruz - Dynamite (Official Video)', author: 'TaioCruzVEVO' };

  // All IDs verified via YouTube oEmbed (embeddable).
  const VIDEOS = [
    { id: 'owGykVbfgUE', title: 'Old Spice | The Man Your Man Could Smell Like', author: 'Old Spice' },
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Official Video)', author: 'Rick Astley' },
    { id: 'OQSNhk5ICTI', title: 'Yosemitebear Mountain Double Rainbow 1-8-10', author: 'Yosemitebear62' },
    { id: 'kffacxfA7G4', title: 'Justin Bieber - Baby ft. Ludacris', author: 'JustinBieberVEVO' },
    { id: 'kfVsfOSbJY0', title: 'Rebecca Black - Friday', author: 'rebecca' },
    { id: '_OBlgSz8sSM', title: 'Charlie bit my finger - again !', author: 'HDCYT' },
    { id: 'J---aiyznGQ', title: 'Keyboard Cat! - THE ORIGINAL!', author: 'Keyboard Cat!' },
    { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE M/V', author: 'officialpsy' },
    { id: 'txqiwrbYGrs', title: 'David After Dentist', author: 'booba1234' },
    { id: 'ZZ5LpwO-An4', title: 'HEYYEYAAEYAAAEYAEYAA', author: 'ProtoOfSnagem' },
    { id: 'QJO3ROT-A4E', title: 'One Direction - What Makes You Beautiful (Official Video)', author: 'OneDirectionVEVO' },
    { id: 'y6Sxv-sUYtM', title: 'Pharrell Williams - Happy (Official Music Video)', author: 'iamOTHER' },
  ];

  const LIVE = {
    giphy: { title: 'Giphy: fireworks GIF', src: 'https://giphy.com/embed/26tOZ42Mg6pbTUPHW', h: 136 },
    maps: { title: 'Google Maps: Hyde Park', src: 'https://maps.google.com/maps?q=Hyde%20Park&z=13&output=embed', h: 260 },
    wiki: { title: 'Wikipedia: Dynamite (Taio Cruz song)', src: 'https://en.m.wikipedia.org/wiki/Dynamite_(Taio_Cruz_song)', h: 420 },
    facebook: {
      title: 'Facebook page plugin',
      // No feed tab: Facebook's logged-out timeline spins forever. Header + Follow/Share loads fine.
      src: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=&width=300&height=134&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true',
      h: 134,
    },
    instagram: { title: 'Instagram profile embed', src: 'https://www.instagram.com/instagram/embed/', h: 460 },
    spotify: { title: 'Spotify embed: Never Gonna Give You Up', src: 'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC', h: 152 },
  };

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rand = (a) => a[Math.floor(Math.random() * a.length)];
  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const kid of kids) if (kid != null) n.append(kid);
    return n;
  };

  const announcer = $('#announcer');
  const announce = (msg) => { announcer.textContent = ''; setTimeout(() => { announcer.textContent = msg; }, 50); };

  /* ---------- YouTube facade ---------- */
  const PLAY_SVG = '<svg class="yt-play" viewBox="0 0 68 48" aria-hidden="true"><path class="bg" d="M66.5 7.7c-.8-2.9-3-5.2-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4c-3 .8-5.2 3.1-6 6C.1 12.9.1 24 .1 24s0 11.1 1.4 16.3c.8 2.9 3 5.2 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4c3-.8 5.2-3.1 6-6 1.4-5.2 1.4-16.3 1.4-16.3s0-11.1-1.4-16.3z"/><path d="M45 24 27 14v20" fill="#fff"/></svg>';

  function ytIframe(v, opts = '') {
    return el('iframe', {
      class: 'yt-frame',
      src: `https://www.youtube.com/embed/${v.id}?autoplay=1&playsinline=1${opts}`,
      title: `YouTube video: ${v.title}`,
      allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
      allowfullscreen: '',
      referrerpolicy: 'strict-origin-when-cross-origin',
    });
  }

  const rotating = new Set(); // facades that cycle through videos

  function setFacadeVideo(btn, v, thumb = 'mqdefault') {
    btn._v = v;
    btn.setAttribute('aria-label', `Play on YouTube: ${v.title}`);
    $('img', btn).src = `https://i.ytimg.com/vi/${v.id}/${thumb}.jpg`;
    $('.yt-avatar', btn).textContent = v.author[0].toUpperCase();
    $('.yt-title', btn).textContent = v.title;
  }

  function ytFacade(v, { thumb = 'mqdefault', onPlay, rotate = true } = {}) {
    const btn = el('button', { class: 'yt', type: 'button' });
    btn.append(el('img', { alt: '', loading: 'lazy', decoding: 'async', width: 320, height: 180 }));
    btn.append(el('span', { class: 'yt-top', 'aria-hidden': 'true' },
      el('span', { class: 'yt-avatar' }),
      el('span', { class: 'yt-title' })));
    btn.insertAdjacentHTML('beforeend', PLAY_SVG);
    btn.append(el('span', { class: 'yt-brand', 'aria-hidden': 'true', text: '▶ YouTube' }));
    setFacadeVideo(btn, v, thumb);
    btn.addEventListener('click', () => {
      rotating.delete(btn);
      if (onPlay) return onPlay(btn);
      const frame = ytIframe(btn._v);
      btn.replaceWith(frame);
      frame.focus();
    });
    if (rotate) { btn._next = 0; rotating.add(btn); }
    return btn;
  }

  $$('.yt-slot').forEach((slot) => slot.append(ytFacade(VIDEOS[+slot.dataset.yt])));

  /* ---------- shopping widgets (Amazon has no embeds any more, so these link to real searches) ---------- */
  const PRODUCTS = [
    ['💿', 'Rokstarr (2010), Audio CD', 8.99, 4.5, 2841],
    ['🌟', 'Glow Sticks, 100 Pack, Assorted Colors', 11.99, 4.3, 48211],
    ['🩹', 'Arm Sling, Adjustable, One Size', 14.49, 4.6, 9310],
    ['🪩', 'Mirror Disco Ball, 8 inch', 19.99, 4.7, 15702],
    ['☝️', 'Foam Finger, Points Up', 6.99, 4.1, 1288],
    ['🕶️', 'Sunglasses, Unisex, Black', 9.99, 4.2, 60533],
    ['🔊', 'Portable Bluetooth Speaker, Loud', 29.99, 4.4, 103877],
    ['🎉', 'Party Poppers, 50 Count', 12.49, 4.0, 3311],
    ['💡', 'LED Strip Lights, 50 ft, Color Changing', 16.99, 4.3, 221904],
    ['🎧', 'Wireless Earbuds, Bluetooth 5.3', 24.99, 4.2, 88412],
    ['🎆', 'Sparklers, 10 inch, 48 Pack', 7.99, 4.5, 6720],
    ['🎟️', 'Event Wristbands, 500 Pack', 13.99, 4.6, 4105],
  ].map(([icon, name, price, rating, reviews]) => ({ icon, name, price, rating, reviews }));

  const stars = (r) => '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(r));
  const amazonUrl = (p) => `https://www.amazon.com/s?k=${encodeURIComponent(p.name)}`;
  const pickProducts = (n) => [...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, n);

  function productCard(p, { compact = false } = {}) {
    return el('a', { class: compact ? 'pc pc-compact' : 'pc', href: amazonUrl(p) },
      el('span', { class: 'pc-img', 'aria-hidden': 'true', text: p.icon }),
      el('span', { class: 'pc-info' },
        el('span', { class: 'pc-name', text: p.name }),
        el('span', { class: 'pc-stars', 'aria-label': `${p.rating} out of 5 stars, ${p.reviews.toLocaleString()} ratings` },
          stars(p.rating), el('small', { text: ` (${p.reviews.toLocaleString()})` })),
        el('span', { class: 'pc-price', text: `$${p.price.toFixed(2)}` }),
        compact ? null : el('span', { class: 'pc-ship', text: '✓ FREE delivery tomorrow' })));
  }

  const SHOPS = {
    together(box) {
      const items = pickProducts(3);
      const total = items.reduce((s, p) => s + p.price, 0);
      const row = el('div', { class: 'fbt-row' });
      items.forEach((p, i) => { if (i) row.append(el('span', { class: 'fbt-plus', 'aria-hidden': 'true', text: '+' })); row.append(productCard(p, { compact: true })); });
      box.replaceChildren(
        el('p', { class: 'shop-head', text: 'Frequently bought together' }), row,
        el('div', { class: 'fbt-foot' },
          el('span', {}, 'Total price: ', el('strong', { text: `$${total.toFixed(2)}` })),
          el('button', { type: 'button', class: 'cartbtn', text: 'Add all three to Cart', onclick: () => spawn('shop') })));
    },
    carousel(box) {
      box.replaceChildren(el('div', { class: 'carousel' }, ...pickProducts(6).map((p) => productCard(p))));
    },
    history(box) {
      box.replaceChildren(el('div', { class: 'shop-grid' }, ...pickProducts(4).map((p) => productCard(p))));
    },
    viewed(box) {
      box.replaceChildren(el('div', { class: 'shop-list' }, ...pickProducts(3).map((p) => productCard(p, { compact: true }))));
    },
    deal(box) {
      const p = rand(PRODUCTS);
      const claimed = 70 + Math.floor(Math.random() * 29);
      box.replaceChildren(
        el('p', { class: 'deal-badge', text: `Lightning Deal · ${claimed}% off` }),
        productCard(p),
        el('div', { class: 'deal-bar', 'aria-hidden': 'true' }, el('span', { style: `width:${claimed}%` })),
        el('p', { class: 'deal-meta' }, `${claimed}% claimed · Ends in `, el('span', { class: 'deal-timer', text: '4:59' })));
    },
  };

  const shopWidgets = $$('.shop').map((box) => {
    const render = () => SHOPS[box.dataset.shop](box);
    render();
    return { box, render, next: 0 };
  });

  // Deal timers count down and then, naturally, start over.
  let dealLeft = 299;
  setInterval(() => {
    if (stopped) return;
    dealLeft = dealLeft <= 0 ? 299 : dealLeft - 1;
    const t = `${Math.floor(dealLeft / 60)}:${String(dealLeft % 60).padStart(2, '0')}`;
    $$('.deal-timer').forEach((s) => { s.textContent = t; });
  }, 1000);

  /* ---------- ad rotation: unreasonably fast ---------- */
  // Rotation holds still while a slot is hovered or focused, so it can still be clicked.
  const rotateEvery = () => (reduceMotion ? 6000 : 700 + Math.random() * 900);
  const LEADERBOARD = [
    ['CONGRATULATIONS!!', 'You are the <b>1,000,000th</b> visitor today', 'CLAIM YOUR DYNAMITE ›'],
    ['WARNING:', 'Your hands are <b>not up</b>. Fix this now', 'PUT HANDS UP ›'],
    ['LOCAL MAN', 'discovers <b>one weird trick</b> to reach the sky', 'LEARN HOW ›'],
    ['ONLY 3 LEFT!!', 'Sticks of dynamite <b>in your area</b>', 'BUY NOW ›'],
    ['FREE!!!', 'Your computer may be <b>running too cool</b>', 'HEAT IT UP ›'],
    ['ACT NOW:', 'Ayy-oh. Gotta let go. <b>Limited time</b>', 'LET GO ›'],
  ];
  let lbIndex = 0, lbNext = 0;
  const lb = $('.lb-inner');

  function rotateTick() {
    if (stopped) return;
    const now = performance.now();
    for (const btn of rotating) {
      if (!btn.isConnected) { rotating.delete(btn); continue; }
      if (btn.matches(':hover') || btn === document.activeElement || now < btn._next) continue;
      const showing = new Set([...rotating].map((b) => b._v));
      const fresh = VIDEOS.filter((v) => !showing.has(v));
      setFacadeVideo(btn, rand(fresh.length ? fresh : VIDEOS.filter((v) => v !== btn._v)));
      btn._next = now + rotateEvery();
    }
    for (const w of shopWidgets) {
      if (now < w.next || w.box.matches(':hover') || w.box.contains(document.activeElement)) continue;
      if (w.next) w.render();
      w.next = now + (reduceMotion ? 8000 : 1500 + Math.random() * 1500);
    }
    if (now >= lbNext && !lb.matches(':hover') && lb !== document.activeElement) {
      lbIndex = (lbIndex + 1) % LEADERBOARD.length;
      const [a, b, c] = LEADERBOARD[lbIndex];
      lb.children[1].innerHTML = `<strong>${a}</strong> ${b}`;
      lb.children[2].textContent = c;
      lbNext = now + (reduceMotion ? 8000 : 1400);
    }
  }
  setInterval(rotateTick, 200);
  // Warm the thumbnail cache so rotation doesn't show blanks (12 × ~15KB).
  addEventListener('load', () => VIDEOS.forEach((v) => { new Image().src = `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`; }));

  /* ---------- live embeds: staggered, only when near the screen ---------- */
  function loadLive(slot) {
    const cfg = LIVE[slot.dataset.live];
    if (!cfg || slot.dataset.done) return;
    slot.dataset.done = '1';
    const delay = 300 + Math.random() * 1800; // "ads populating"
    setTimeout(() => {
      const f = el('iframe', { src: cfg.src, title: cfg.title, height: cfg.h, loading: 'lazy', referrerpolicy: 'strict-origin-when-cross-origin', allow: 'autoplay; encrypted-media; clipboard-write; picture-in-picture' });
      f.style.height = cfg.h + 'px';
      const done = () => slot.classList.add('loaded');
      f.addEventListener('load', done, { once: true });
      setTimeout(done, 4000); // some embeds never report "load"; drop the placeholder anyway
      slot.append(f);
    }, delay);
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { loadLive(e.target); io.unobserve(e.target); }
  }, { rootMargin: '400px 0px' });
  $$('.live').forEach((s) => io.observe(s));

  /* ---------- the player: a gauntlet of pre-roll ads ---------- */
  const player = $('#player');
  const PREROLL = [VIDEOS[0], VIDEOS[3], VIDEOS[7], VIDEOS[4]];
  const claimedTotals = [2, 2, 3, 7]; // "Ad 2 of 2" ... "Ad 3 of 3" ... "Ad 4 of 7"
  let prerollIndex = 0;
  let countdown = null;

  function showPreroll() {
    clearInterval(countdown);
    const v = PREROLL[prerollIndex];
    const total = claimedTotals[prerollIndex];
    let left = 5;

    const skip = el('button', { class: 'skipbtn', type: 'button', 'aria-disabled': 'true', text: `Skip ad in ${left}` });
    const bar = el('span');
    const box = el('div', { class: 'preroll', role: 'group', 'aria-label': `Advertisement ${prerollIndex + 1} of ${total}: ${v.title}` },
      el('img', { src: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, alt: '' }),
      el('div', { class: 'preroll-top' },
        el('span', { text: v.title }),
        el('a', { href: `https://www.youtube.com/watch?v=${v.id}`, target: '_blank', rel: 'noopener', text: 'Visit advertiser ↗' })),
      el('span', { class: 'preroll-badge', text: `Ad ${prerollIndex + 1} of ${total} · 0:0${left}` }),
      skip,
      el('div', { class: 'preroll-progress', 'aria-hidden': 'true' }, bar));
    player.replaceChildren(box);

    const badge = $('.preroll-badge', box);
    countdown = setInterval(() => {
      left -= 1;
      bar.style.width = `${((5 - left) / 5) * 100}%`;
      badge.textContent = `Ad ${prerollIndex + 1} of ${total} · 0:0${Math.max(left, 0)}`;
      if (left > 0) { skip.textContent = `Skip ad in ${left}`; return; }
      clearInterval(countdown);
      skip.textContent = 'Skip ad ▸|';
      skip.setAttribute('aria-disabled', 'false');
      if (document.activeElement === skip) announce('Skip ad is now available.');
    }, 1000);

    skip.addEventListener('click', () => {
      if (skip.getAttribute('aria-disabled') === 'true') {
        if (!reduceMotion) { skip.classList.remove('shake'); void skip.offsetWidth; skip.classList.add('shake'); }
        return;
      }
      prerollIndex += 1;
      if (prerollIndex < PREROLL.length) { showPreroll(); $('.skipbtn', player).focus(); }
      else showStillThere();
    });
  }

  function showStillThere() {
    clearInterval(countdown);
    const yes = el('button', { type: 'button', text: 'Yes' });
    player.replaceChildren(el('div', { class: 'still-there', role: 'group', 'aria-label': 'Are you still watching?' },
      el('p', { text: 'Video paused. Continue watching?' }), yes));
    yes.addEventListener('click', showDynamite);
    yes.focus();
  }

  function showDynamite() {
    clearInterval(countdown);
    const f = ytFacade(DYNAMITE, {
      thumb: 'maxresdefault',
      rotate: false,
      onPlay: (btn) => { const frame = ytIframe(DYNAMITE); btn.replaceWith(frame); frame.focus(); },
    });
    f.querySelector('img').loading = 'eager';
    player.replaceChildren(f);
    f.focus();
    announce('Dynamite is ready. Press the play button.');
  }

  showPreroll();

  /* ---------- pop-ups ---------- */
  const popups = $('#popups');
  const CAP = Infinity; // they keep coming
  let spawned = 0;
  let stopped = false;
  let spawnTimer = null;

  const POPUPS = {
    prize: () => ({
      title: 'WINNER!!! — Internet Explorer',
      body: [el('p', { class: 'popup-big', text: 'YOU HAVE WON' }), el('p', { text: 'One (1) free stick of dynamite. Shipping not included. Hands must be up to claim.' })],
      buttons: [['CLAIM NOW', 'primary', () => spawn('video')], ['No thanks, I hate free things', '', null]],
    }),
    message: () => ({
      title: 'You have (1) new message',
      body: [el('p', {}, el('strong', { text: 'From: Taio' })), el('p', { text: '“r u in the club rn? hands up?”' })],
      buttons: [['Reply', 'primary', () => spawn('survey')], ['Ignore', '', null]],
    }),
    survey: () => ({
      title: 'Quick survey (1 of 40)',
      body: [el('p', { text: 'Where are your hands right now?' })],
      buttons: [['Up', 'primary', () => spawn('survey2')], ['To the sky', 'primary', () => spawn('survey2')]],
    }),
    survey2: () => ({
      title: 'Quick survey (2 of 40)',
      body: [el('p', { text: 'Great. Now how about now?' })],
      buttons: [['Still up', 'primary', () => spawn('video')], ['Tired', '', () => spawn('video')]],
    }),
    video: () => {
      const v = rand(VIDEOS);
      return { title: `HOT VIDEO in your area`, body: [ytFacade(v)], buttons: [] };
    },
    shop: () => ({
      title: 'Added to Cart',
      body: [el('p', { text: 'Customers who added that also added:' }), productCard(rand(PRODUCTS))],
      buttons: [['Add to Cart', 'primary', () => spawn('shop')], ['Proceed to checkout', '', () => spawn('shop')]],
    }),
    adblock: () => ({
      title: 'Ad blocker detected?',
      body: [el('p', { text: 'We noticed you might be blocking ads. We are not blocking ads. Please consider not blocking ads.' })],
      buttons: [['I’ve disabled it', 'primary', () => spawn('video')], ['I don’t have one', '', () => spawn('prize')]],
    }),
    newsletter: () => ({
      title: 'Before you go…',
      body: [el('p', { class: 'popup-big', text: 'DON’T MISS AN EXPLOSION' }), el('p', { text: 'Get every explosion delivered straight to your inbox, hourly.' })],
      buttons: [['Sign me up', 'primary', () => spawn('message')], ['No, I prefer to miss explosions', '', null]],
    }),
  };
  const RANDOM_KINDS = ['video', 'video', 'video', 'shop', 'shop', 'prize', 'message', 'survey', 'adblock', 'newsletter'];

  function maxOnScreen() { return innerWidth < 760 ? 5 : 10; }

  function spawn(kind = 'any', { quiet = false } = {}) {
    if (stopped || spawned >= CAP) return null;
    const open = $$('.popup', popups);
    if (open.length >= maxOnScreen()) open[0].remove(); // oldest gets bumped
    spawned += 1;

    const spec = POPUPS[kind === 'any' ? rand(RANDOM_KINDS) : kind]();
    const id = `pop-${spawned}`;
    const close = el('button', { class: 'x', type: 'button', 'aria-label': `Close pop-up: ${spec.title}`, text: '✕' });
    const mini = el('button', { type: 'button', 'aria-label': 'Minimize (premium feature)', text: '_' });
    const box = el('section', { class: 'popup', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': id },
      el('div', { class: 'popup-bar' }, el('h2', { id, text: spec.title }), mini, close),
      el('div', { class: 'popup-body' }, ...spec.body,
        spec.buttons.length ? el('div', { class: 'popup-btns' }, ...spec.buttons.map(([label, cls, then]) =>
          el('button', { type: 'button', class: cls, text: label, onclick: () => { dismiss(box, false); if (then) then(); } }))) : null));

    // Place it somewhere annoying: biased toward the middle of the viewport.
    const w = Math.min(340, innerWidth - 32);
    const cx = innerWidth / 2 - w / 2, cy = innerHeight / 2 - 160;
    const jitter = (r) => (Math.random() - 0.5) * r;
    const x = Math.max(16, Math.min(innerWidth - w - 16, cx + jitter(innerWidth * 0.7)));
    const y = Math.max(16, Math.min(innerHeight - 280, cy + jitter(innerHeight * 0.6)));
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;

    close.addEventListener('click', () => dismiss(box, true));
    mini.addEventListener('click', () => { dismiss(box, false); spawn('any'); announce('Minimizing is a premium feature. Here is another pop-up.'); });

    popups.append(box);
    // Timed pop-ups stay silent so screen readers aren't flooded; ones caused by the visitor are announced.
    if (!quiet) announce(`Pop-up opened: ${spec.title}. Press Escape to close.`);
    return box;
  }

  function dismiss(box, hydra) {
    box.remove();
    const rest = $$('.popup', popups);
    const next = rest[rest.length - 1];
    if (next) $('.x', next).focus({ preventScroll: true });
    // The hydra: closing one usually spawns another, until the cap.
    if (hydra && !stopped) setTimeout(() => {
      const born = spawn('any');
      if (Math.random() < 0.35) spawn('any');
      if (born && !next) $('.x', born).focus({ preventScroll: true });
    }, 350);
  }

  function stopEverything() {
    stopped = true;
    clearTimeout(spawnTimer);
    popups.replaceChildren();
    ['notif', 'cookie', 'sticky'].forEach((i) => { $('#' + i).hidden = true; });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = $$('.popup', popups);
    if (open.length) { e.preventDefault(); dismiss(open[open.length - 1], true); }
  });

  $$('[data-spawn]').forEach((b) => b.addEventListener('click', () => spawn(b.dataset.spawn)));

  // Every link on the page just makes more pop-ups (except the skip link, which is the way out).
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.id === 'skip' || stopped) return;
    e.preventDefault();
    const first = spawn('any');
    spawn('any', { quiet: true });
    if (Math.random() < 0.5) spawn('any', { quiet: true });
    if (first) $('.x', first).focus({ preventScroll: true });
  });

  // Periodic spawning, forever, speeding up a little each time.
  let gap = 5000;
  function schedule() {
    if (stopped) return;
    spawnTimer = setTimeout(() => {
      spawn('any', { quiet: true });
      gap = Math.max(1800, gap * 0.92);
      schedule();
    }, gap + Math.random() * 1500);
  }

  /* ---------- notification prompt, cookie banner, sticky ad ---------- */
  const notif = $('#notif'), cookie = $('#cookie'), sticky = $('#sticky');

  $$('[data-notif]', notif).forEach((b) => b.addEventListener('click', () => {
    notif.hidden = true;
    if (b.dataset.notif === 'allow') spawn('message');
    else { const p = spawn('any'); if (p) $('h2', p).textContent = 'Notifications blocked (notification)'; }
  }));

  $$('[data-cookie]', cookie).forEach((b) => b.addEventListener('click', () => {
    cookie.hidden = true;
    if (b.dataset.cookie === 'manage') {
      const p = spawn('adblock');
      if (p) { $('h2', p).textContent = 'Preferences saved (Accept all)'; }
    }
    setTimeout(() => { if (!stopped) sticky.hidden = false; }, 2500);
  }));

  $('#stickyClose').addEventListener('click', () => {
    const body = $('.sticky-body', sticky);
    if (body.dataset.confirm) return;
    body.dataset.confirm = '1';
    const saved = [...body.childNodes];
    const yes = el('button', { type: 'button', class: 'primary', text: 'No, show me more ads' });
    const no = el('button', { type: 'button', text: 'Yes, close' });
    body.replaceChildren(el('div', { class: 'sticky-confirm' }, el('p', { text: 'Are you sure you want to close this ad?' }), el('div', { class: 'popup-btns' }, yes, no)));
    yes.addEventListener('click', () => { body.replaceChildren(...saved); delete body.dataset.confirm; spawn('video'); });
    no.addEventListener('click', () => { sticky.hidden = true; });
    yes.focus();
  });

  /* ---------- the exits (accessibility: a way to stop it all) ---------- */
  function goStraightToDynamite(e) {
    if (e) e.preventDefault();
    stopEverything();
    showDynamite();
    player.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    announce('All ads stopped. Dynamite is ready. Press the play button.');
  }
  $('#skip').addEventListener('click', goStraightToDynamite);
  $('#adfree').addEventListener('click', goStraightToDynamite);

  /* ---------- kick off ---------- */
  setTimeout(() => { if (!stopped) cookie.hidden = false; }, 900);
  setTimeout(() => { if (!stopped) notif.hidden = false; }, 1800);
  setTimeout(() => { spawn('prize'); schedule(); }, 3200);
})();
