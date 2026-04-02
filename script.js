(function () {


  /* ── CV DROPDOWN ────────────────────────────
     Click "CV / Resume" to show View or Download.
     Click anywhere outside to close it.
  ─────────────────────────────────────────── */

  var cvBtn      = document.getElementById('cvBtn');
  var cvDropdown = document.getElementById('cvDropdown');

  cvBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    cvDropdown.classList.toggle('open');
  });

  document.addEventListener('click', function () {
    cvDropdown.classList.remove('open');
  });

  cvDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });


  /* ── FLIP CARD ──────────────────────────────
     Tap or click the photo card to flip to video.
     Tap again to flip back to photo.
  ─────────────────────────────────────────── */

  var wrap = document.getElementById('phoneWrap');
  var vid  = document.getElementById('flipVideo');

  if (wrap && vid) {
    wrap.addEventListener('click', function () {
      wrap.classList.toggle('flipped');
      if (wrap.classList.contains('flipped')) {
        vid.play();
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }


  /* ── CUSTOM CURSOR ───────────────────────── */

  var co = document.getElementById('cur-o');
  var ci = document.getElementById('cur-i');
  var mx = 0, my = 0, ox = 0, oy = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    ci.style.left = mx + 'px';
    ci.style.top  = my + 'px';
  });

  (function loop() {
    ox += (mx - ox) * 0.15;
    oy += (my - oy) * 0.15;
    co.style.left = ox + 'px';
    co.style.top  = oy + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll(
    'a, button, .sk-tag, .cert-card, .uiux-card, .tab-btn, .s-btn, .cert-view-btn, .phone-wrap'
  ).forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      co.style.width      = '52px';
      co.style.height     = '52px';
      co.style.background = 'var(--glow)';
    });
    el.addEventListener('mouseleave', function () {
      co.style.width      = '36px';
      co.style.height     = '36px';
      co.style.background = 'transparent';
    });
  });


  /* ── BACK TO TOP ─────────────────────────── */

  var bt = document.getElementById('back-top');

  window.addEventListener('scroll', function () {
    bt.classList.toggle('visible', window.scrollY > 400);
  });

  bt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── THEME TOGGLE ────────────────────────── */

  var togBtn = document.getElementById('togBtn');
  var togIco = document.getElementById('togIco');
  var root   = document.documentElement;

  togBtn.addEventListener('click', function () {
    var isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    togIco.className = isDark ? 'fa-solid fa-sun tog-ico' : 'fa-solid fa-moon tog-ico';
  });


  /* ── ACTIVE NAV HIGHLIGHT ON SCROLL ─────── */

  var sections = document.querySelectorAll('section[id]');
  var topLinks = document.querySelectorAll('.tnav a');
  var ftrLinks = document.querySelectorAll('.f-link');

  function setActive(id) {
    topLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
    ftrLinks.forEach(function (a) {
      a.classList.toggle('active', a.dataset.s === id);
    });
  }

  sections.forEach(function (s) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { threshold: 0.3 }).observe(s);
  });

  document.getElementById('logo-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── SCROLL REVEAL ───────────────────────── */

  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('on');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rev, .revs').forEach(function (el) {
    ro.observe(el);
  });


  /* ── WORK TABS ───────────────────────────── */

  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });


  /* ── PER-SLIDE MEDIA GALLERY ─────────────────
     Each project slide can have multiple images
     or videos. Arrows and dots navigate between
     them without affecting the outer slider.
  ─────────────────────────────────────────── */

  function initGalleries() {
    document.querySelectorAll('.s-gallery').forEach(function (gallery) {
      var items    = Array.from(gallery.querySelectorAll('.s-gallery-item'));
      var total    = items.length;
      var cur      = 0;
      var countEl  = gallery.querySelector('.sg-count');
      var dotsWrap = gallery.querySelector('.sg-dots');
      var prevBtn  = gallery.querySelector('.sg-prev');
      var nextBtn  = gallery.querySelector('.sg-next');

      /* Hide controls when only one attachment */
      if (total <= 1) {
        if (prevBtn)  prevBtn.style.display  = 'none';
        if (nextBtn)  nextBtn.style.display  = 'none';
        if (countEl)  countEl.style.display  = 'none';
        if (dotsWrap) dotsWrap.style.display = 'none';
        if (items[0]) items[0].classList.add('active');
        return;
      }

      /* Build dot indicators */
      if (dotsWrap) {
        items.forEach(function (_, i) {
          var d = document.createElement('div');
          d.className = 'sg-dot' + (i === 0 ? ' active' : '');
          d.addEventListener('click', function (e) {
            e.stopPropagation();
            go(i);
          });
          dotsWrap.appendChild(d);
        });
      }

      /* Move to frame n */
      function go(n) {
        cur = ((n % total) + total) % total;

        items.forEach(function (item, i) {
          var isActive = (i === cur);
          item.classList.toggle('active', isActive);

          /* Play/pause video items automatically */
          var v = item.querySelector('video');
          if (v) {
            if (isActive) { v.play(); }
            else          { v.pause(); v.currentTime = 0; }
          }
        });

        /* Update counter text */
        if (countEl) countEl.textContent = (cur + 1) + ' / ' + total;

        /* Update dots */
        if (dotsWrap) {
          dotsWrap.querySelectorAll('.sg-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === cur);
          });
        }
      }

      /* Arrow button clicks — stopPropagation so outer slider ignores them */
      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          go(cur - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          go(cur + 1);
        });
      }

      /* Swipe support inside the gallery */
      var touchStartX = 0;
      gallery.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      gallery.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) go(diff > 0 ? cur + 1 : cur - 1);
      });

      /* Kick off at frame 0 */
      go(0);
    });
  }

  initGalleries();


  /* ── PROJECT SLIDER (outer) ──────────────────
     Navigates between project cards.
     Inner gallery handles per-card media.
  ─────────────────────────────────────────── */

  var track  = document.getElementById('sTrack');
  var slides = track ? Array.from(track.children) : [];
  var dotsEl = document.getElementById('sDots');
  var cur    = 0;
  var timer;

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    slides.forEach(function (_, i) {
      var d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', function () { go(i); });
      dotsEl.appendChild(d);
    });
  }

  function go(n) {
    cur = ((n % slides.length) + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + cur * 100 + '%)';
    document.querySelectorAll('.dot').forEach(function (d, i) {
      d.classList.toggle('active', i === cur);
    });
  }

  function startAuto() {
    timer = setInterval(function () { go(cur + 1); }, 4500);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  if (slides.length > 0) {
    buildDots();
    startAuto();

    document.getElementById('sPrev').addEventListener('click', function () {
      stopAuto(); go(cur - 1); startAuto();
    });

    document.getElementById('sNext').addEventListener('click', function () {
      stopAuto(); go(cur + 1); startAuto();
    });

    var touchStartX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) go(diff > 0 ? cur + 1 : cur - 1);
      startAuto();
    });
  }


  /* ── CERTIFICATE MODAL ───────────────────── */

  var modal    = document.getElementById('cert-modal');
  var mTitle   = document.getElementById('modalTitle');
  var mIssuer  = document.getElementById('modalIssuer');
  var mDesc    = document.getElementById('modalDesc');
  var mImgArea = document.getElementById('modalImgArea');

  document.querySelectorAll('.cert-card').forEach(function (card) {
    card.addEventListener('click', function () {

      mTitle.textContent = card.dataset.title  || 'Certificate';
      mIssuer.innerHTML  = card.dataset.issuer || '';
      mDesc.textContent  = card.dataset.desc   || 'No description provided.';

      var imgSrc  = card.dataset.img;
      var cardImg = card.querySelector('.cert-img');

      if (imgSrc) {
        mImgArea.innerHTML =
          '<img src="' + imgSrc + '" style="width:100%;height:100%;object-fit:cover;display:block;" alt="">';
      } else if (cardImg) {
        mImgArea.innerHTML =
          '<img src="' + cardImg.src + '" style="width:100%;height:100%;object-fit:cover;display:block;" alt="">';
      } else {
        mImgArea.innerHTML =
          '<div class="modal-img-ph"><i class="fa-solid fa-certificate" style="font-size:3rem;color:var(--steel)"></i></div>';
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modalClose').addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });


})();
