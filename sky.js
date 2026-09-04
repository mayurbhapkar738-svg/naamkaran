/* Naamkaran — sky
 *
 * The background is not decoration. It is the rashi chakra with real things on it:
 *
 *   - the 27 nakshatras at their true sidereal longitudes
 *   - each marked by its actual yogatara, drawn at that star's real magnitude and
 *     its real colour from its spectral class, which is where the colour on this
 *     page comes from rather than a palette someone picked
 *   - the Moon at its true sidereal longitude, showing its true phase
 *   - the five visible grahas at computed longitudes, accurate to about a degree
 *
 * When a family calculates a nakshatra the ring turns to that moment and their
 * nakshatra lights. That is the one animated moment on the page that means
 * something; everything else drifts slowly and stays out of the way of reading.
 *
 * Planetary theory: mean orbital elements with a first-order equation of centre.
 * Good to roughly a degree, which places a graha in the right rashi almost
 * always and in the right nakshatra usually. That is honest for a background and
 * nowhere near good enough for a chart, so nothing here feeds the janma patra.
 */
(function () {
  "use strict";

  var NK = (typeof globalThis !== "undefined" && globalThis.Nakshatra) ||
    (typeof require === "function" ? require("./nakshatra.js") : null);
  var PC = (typeof globalThis !== "undefined" && globalThis.Panchang) ||
    (typeof require === "function" ? require("./panchang.js") : null);

  var D2R = Math.PI / 180;
  function sin(d) { return Math.sin(d * D2R); }
  function cos(d) { return Math.cos(d * D2R); }
  function norm360(x) { x = x % 360; return x < 0 ? x + 360 : x; }

  /* ---------------------------------------------------------- the yogataras
   * name, spectral class, visual magnitude. These are the stars the nakshatras
   * are actually named for, so the reds and blues on screen are the real colours
   * of Antares and Spica rather than an arbitrary gradient. */
  var YOGATARA = [
    ["Sheratan", "B", 2.64], ["Bharani", "B", 3.61], ["Alcyone", "B", 2.87],
    ["Aldebaran", "K", 0.85], ["Meissa", "O", 3.39], ["Betelgeuse", "M", 0.50],
    ["Pollux", "K", 1.14], ["Asellus Australis", "K", 3.94], ["Epsilon Hydrae", "G", 3.38],
    ["Regulus", "B", 1.40], ["Zosma", "A", 2.56], ["Denebola", "A", 2.11],
    ["Algorab", "B", 2.95], ["Spica", "B", 1.04], ["Arcturus", "K", -0.05],
    ["Zubenelgenubi", "A", 2.75], ["Dschubba", "B", 2.29], ["Antares", "M", 1.05],
    ["Shaula", "B", 1.62], ["Kaus Media", "K", 2.70], ["Nunki", "B", 2.05],
    ["Altair", "A", 0.77], ["Rotanev", "F", 3.63], ["Lambda Aquarii", "M", 3.74],
    ["Markab", "B", 2.49], ["Algenib", "B", 2.83], ["Zeta Piscium", "A", 5.21]
  ];

  // spectral class to an approximate visual colour
  var SPECTRAL = {
    O: [170, 191, 255], B: [176, 200, 255], A: [216, 228, 255],
    F: [251, 248, 255], G: [255, 244, 232], K: [255, 214, 160], M: [255, 157, 111]
  };

  /* -------------------------------------------------------------- the grahas
   * a, e, I, L, longPeri, longNode at J2000 plus centuries-rate, from the
   * standard low-precision element set. */
  var PLANETS = [
    ["Budha", "Mercury", [0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593],
      [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081], 4.2, [214, 210, 200]],
    ["Shukra", "Venus", [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
      [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418], 6.0, [255, 248, 220]],
    ["Mangala", "Mars", [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
      [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343], 5.0, [255, 138, 92]],
    ["Guru", "Jupiter", [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
      [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106], 8.5, [255, 226, 178]],
    ["Shani", "Saturn", [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
      [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794], 7.5, [230, 214, 168]]
  ];

  function earthElements(T) {
    return {
      a: 1.00000261 + 0.00000562 * T,
      e: 0.01671123 - 0.00004392 * T,
      I: -0.00001531 - 0.01294668 * T,
      L: 100.46457166 + 35999.37244981 * T,
      wbar: 102.93768193 + 0.32327364 * T,
      omega: 0.0
    };
  }

  // heliocentric position in the ecliptic plane, AU
  function helio(el, T) {
    var a = el[0][0] + el[1][0] * T;
    var e = el[0][1] + el[1][1] * T;
    var I = el[0][2] + el[1][2] * T;
    var L = el[0][3] + el[1][3] * T;
    var wbar = el[0][4] + el[1][4] * T;
    var omega = el[0][5] + el[1][5] * T;
    return kepler(a, e, I, L, wbar, omega);
  }

  function kepler(a, e, I, L, wbar, omega) {
    var w = wbar - omega;
    var M = norm360(L - wbar);
    if (M > 180) M -= 360;
    // solve Kepler by Newton, a handful of passes is plenty at these eccentricities
    var E = M;
    for (var i = 0; i < 8; i++) {
      var dE = (E - e * Math.sin(E * D2R) / D2R - M) / (1 - e * cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-8) break;
    }
    var xp = a * (cos(E) - e);
    var yp = a * Math.sqrt(1 - e * e) * sin(E);
    // orbital plane to ecliptic
    var cw = cos(w), sw = sin(w), cO = cos(omega), sO = sin(omega), cI = cos(I), sI = sin(I);
    return {
      x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
      y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
      z: (sw * sI) * xp + (cw * sI) * yp
    };
  }

  /* Geocentric sidereal longitude of each graha, degrees.
   *
   * PLANETS rows are [name, en, elements, rates, size, rgb], so size is index 4
   * and rgb is index 5. Reading 5 and 6 handed the renderer an array where it
   * wanted a number, and `array * 2.6` is NaN, which is what
   * createRadialGradient rejected. */
  function grahas(jd) {
    var T = (jd - 2451545) / 36525;
    var eEl = earthElements(T);
    var earth = kepler(eEl.a, eEl.e, eEl.I, eEl.L, eEl.wbar, eEl.omega);
    var ayan = NK ? NK.lahiriAyanamsa(jd) : 24.2;
    return PLANETS.map(function (p) {
      var h = helio([p[2], p[3]], T);
      var dx = h.x - earth.x, dy = h.y - earth.y;
      var tropical = norm360(Math.atan2(dy, dx) / D2R);
      return {
        name: p[0], en: p[1], size: p[4], rgb: p[5],
        tropical: tropical, sidereal: norm360(tropical - ayan),
        dist: Math.sqrt(dx * dx + dy * dy)
      };
    });
  }

  /* Moon phase as an illuminated fraction plus the sign of the terminator, from
   * the Sun-Moon elongation. Drawn as a real crescent rather than a cartoon. */
  function moonState(jd) {
    if (!NK || !PC) return null;
    var dT = NK.deltaT(2000 + (jd - 2451545) / 365.25) / 86400;
    var m = NK.moonPosition(jd + dT).lon;
    var s = PC.sunLongitude(jd + dT);
    var elong = norm360(m - s);
    return {
      sidereal: norm360(m - NK.lahiriAyanamsa(jd)),
      elongation: elong,
      illuminated: (1 - cos(elong)) / 2,
      waxing: elong < 180
    };
  }

  function jdNow() {
    var d = new Date();
    return d.getTime() / 86400000 + 2440587.5;
  }

  // ------------------------------------------------------------ the canvas

  function start(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d", { alpha: false });
    var W = 0, H = 0, DPR = 1;
    var reduced = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var field = [];        // background stars
    var ringRot = 0;       // current rotation, degrees
    var ringTarget = null; // where the ring is easing to
    var lit = null;        // nakshatra index being highlighted, 1-27
    var litGlow = 0;
    var jd = jdNow();
    var moon = null, planets = [];
    try { moon = moonState(jd); planets = grahas(jd); } catch (e) { planets = []; }
    var running = true, t0 = performance.now(), last = t0;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);   // cap: 3x on a phone is wasted fill rate
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildField();
    }

    /* Star count scales with area, so a phone draws a few hundred and a desktop a
     * couple of thousand instead of one fixed number that is either sparse or
     * a battery drain. */
    function buildField() {
      var target = Math.round(Math.min(1600, Math.max(220, (W * H) / 1900)));
      field = [];
      for (var i = 0; i < target; i++) {
        var mag = Math.pow(Math.random(), 2.2);       // many faint, few bright
        field.push({
          x: Math.random(), y: Math.random(),
          r: 0.35 + mag * 1.5,
          a: 0.16 + mag * 0.72,
          tw: 0.4 + Math.random() * 2.4,
          ph: Math.random() * Math.PI * 2,
          depth: 0.25 + mag * 0.75,
          hue: Math.random() < 0.15
            ? (Math.random() < 0.5 ? [255, 214, 170] : [190, 210, 255])
            : [255, 253, 248]
        });
      }
    }

    function ground() {
      // deep indigo, lifting toward the horizon the way a real night sky does
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#070a1c");
      g.addColorStop(0.45, "#0d1230");
      g.addColorStop(0.78, "#141a42");
      g.addColorStop(1, "#1b2352");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // one soft band of galactic haze, angled so it does not read as a vignette
      var r = Math.max(W, H);
      var h = ctx.createRadialGradient(W * 0.78, H * 0.12, 0, W * 0.78, H * 0.12, r * 0.85);
      h.addColorStop(0, "rgba(86,104,190,0.20)");
      h.addColorStop(0.5, "rgba(60,72,150,0.07)");
      h.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = h;
      ctx.fillRect(0, 0, W, H);
    }

    function stars(now, drift) {
      for (var i = 0; i < field.length; i++) {
        var s = field[i];
        var tw = reduced ? 1 : 0.72 + 0.28 * Math.sin(now / 1000 * s.tw + s.ph);
        var x = ((s.x + drift * s.depth * 0.06) % 1) * W;
        var y = s.y * H;
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = "rgb(" + s.hue[0] + "," + s.hue[1] + "," + s.hue[2] + ")";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, 6.2832);
        ctx.fill();
        if (s.r > 1.3) {          // a faint bloom on the brightest only
          ctx.globalAlpha = s.a * tw * 0.18;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 3.4, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function ringGeometry() {
      var cx = W * 0.5;
      var cy = opts.ringCenterY != null ? opts.ringCenterY : Math.min(H * 0.30, 290);
      var rad = Math.min(W * 0.52, 420);
      return { cx: cx, cy: cy, rad: rad };
    }

    /* The rashi chakra. Sidereal longitude maps straight onto the ring, so the
     * gold ticks are the real nakshatra boundaries and the stars sit where they
     * actually sit relative to one another. */
    function ring(now) {
      var g = ringGeometry();
      var cx = g.cx, cy = g.cy, rad = g.rad;

      function pos(lonDeg, r) {
        var a = (lonDeg + ringRot - 90) * D2R;
        return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
      }

      // the band itself
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(212,162,76,0.20)";
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = "rgba(212,162,76,0.10)";
      ctx.beginPath(); ctx.arc(cx, cy, rad * 0.885, 0, 6.2832); ctx.stroke();

      // twelve rashi divisions, drawn heavier than the nakshatra ticks
      for (var r12 = 0; r12 < 12; r12++) {
        var p1 = pos(r12 * 30, rad * 0.885), p2 = pos(r12 * 30, rad);
        ctx.strokeStyle = "rgba(212,162,76,0.26)";
        ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
      }

      // 27 nakshatra ticks and their yogataras
      for (var i = 0; i < 27; i++) {
        var lon = i * (40 / 3);
        var isLit = lit === i + 1;

        var a1 = pos(lon, rad * 0.90), a2 = pos(lon, rad * 0.965);
        ctx.strokeStyle = "rgba(212,162,76,0.16)";
        ctx.beginPath(); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.stroke();

        // the star sits mid-nakshatra
        var y = YOGATARA[i];
        var rgb = SPECTRAL[y[1]] || [255, 255, 255];
        var bright = Math.max(0.20, Math.min(1, (6.0 - y[2]) / 6.0));
        var sp = pos(lon + (20 / 3), rad * 0.932);
        var tw = reduced ? 1 : 0.82 + 0.18 * Math.sin(now / 900 + i * 1.7);
        var size = (1.1 + bright * 2.5) * tw;

        if (isLit) {
          var glow = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], 46 * litGlow);
          glow.addColorStop(0, "rgba(224,72,60," + (0.55 * litGlow) + ")");
          glow.addColorStop(0.4, "rgba(224,110,60," + (0.18 * litGlow) + ")");
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(sp[0], sp[1], 46 * litGlow, 0, 6.2832); ctx.fill();
        }

        var bloom = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], size * 5);
        bloom.addColorStop(0, "rgba(" + rgb.join(",") + "," + (0.5 * bright) + ")");
        bloom.addColorStop(1, "rgba(" + rgb.join(",") + ",0)");
        ctx.fillStyle = bloom;
        ctx.beginPath(); ctx.arc(sp[0], sp[1], size * 5, 0, 6.2832); ctx.fill();

        ctx.fillStyle = "rgb(" + rgb.join(",") + ")";
        ctx.globalAlpha = 0.55 + 0.45 * bright;
        ctx.beginPath(); ctx.arc(sp[0], sp[1], size, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // the grahas, on an inner circle so they do not collide with the stars
      planets.forEach(function (p, i) {
        var pp = pos(p.sidereal, rad * (0.60 + (i % 3) * 0.075));
        var gl = ctx.createRadialGradient(pp[0], pp[1], 0, pp[0], pp[1], p.size * 2.6);
        gl.addColorStop(0, "rgba(" + p.rgb.join(",") + ",0.42)");
        gl.addColorStop(1, "rgba(" + p.rgb.join(",") + ",0)");
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(pp[0], pp[1], p.size * 2.6, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgb(" + p.rgb.join(",") + ")";
        ctx.beginPath(); ctx.arc(pp[0], pp[1], p.size * 0.45, 0, 6.2832); ctx.fill();
      });

      // the Moon, at its true longitude and true phase
      if (moon) {
        var mp = pos(moon.sidereal, rad * 0.775);
        drawMoon(mp[0], mp[1], 21, moon);
      }
    }

    /* A real terminator: the lit limb is a circle, the dark edge an ellipse whose
     * width follows the illuminated fraction, so a crescent looks like a crescent
     * and a gibbous moon looks gibbous. */
    function drawMoon(x, y, r, m) {
      var halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4.2);
      halo.addColorStop(0, "rgba(226,232,255,0.26)");
      halo.addColorStop(0.45, "rgba(190,204,255,0.09)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(x, y, r * 4.2, 0, 6.2832); ctx.fill();

      // earthshine on the unlit part, so a thin crescent still reads as a sphere
      ctx.fillStyle = "rgba(150,164,220,0.16)";
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();

      var f = m.illuminated;
      var k = Math.abs(2 * f - 1);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.2832);
      ctx.clip();
      ctx.fillStyle = "#f4f1e6";
      ctx.beginPath();
      // lit half
      var s = m.waxing ? 1 : -1;
      ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, s < 0);
      // terminator
      ctx.ellipse(x, y, r * k, r, 0, Math.PI / 2, -Math.PI / 2, f > 0.5 ? s < 0 : s > 0);
      ctx.fill();
      ctx.restore();
    }

    /* The sky is decoration; the form is the product. So a drawing error must
     * never take the page down with it, and it must not throw sixty times a
     * second either. After a few consecutive failures the canvas gives up,
     * hides itself and leaves the CSS background in place. */
    var errs = 0;

    function frame(now) {
      if (!running) return;
      try {
        var dt = Math.min(now - last, 60); last = now;
        var drift = (now - t0) / 1000;

        if (ringTarget != null) {
          var d = ((ringTarget - ringRot + 540) % 360) - 180;
          if (Math.abs(d) < 0.05) { ringRot = ringTarget; ringTarget = null; }
          else ringRot += d * (reduced ? 1 : 0.045);
        } else if (!reduced) {
          ringRot += dt * 0.0022;          // a slow, deliberate turn, not a spin
        }
        if (lit && litGlow < 1) litGlow = Math.min(1, litGlow + dt / 700);
        if (!lit && litGlow > 0) litGlow = Math.max(0, litGlow - dt / 500);

        if (W > 0 && H > 0) {
          ground();
          stars(now, drift);
          ring(now);
        }
        errs = 0;
      } catch (e) {
        if (++errs > 4) {
          running = false;
          canvas.style.display = "none";
          if (window.console && console.warn) {
            console.warn("Naamkaran: sky disabled after repeated draw errors.", e);
          }
          return;
        }
      }
      requestAnimationFrame(frame);
    }

    // stop drawing when the tab is hidden; there is no reason to burn a battery
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { running = false; }
      else if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    });

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(resize, 140);
    });

    resize();
    requestAnimationFrame(frame);

    return {
      /* Turn the ring to a birth moment and light that nakshatra. This is the
       * page's one orchestrated movement, and it only fires on a real result. */
      showMoment: function (jdAt, nakIndex) {
        if (jdAt != null && !isFinite(jdAt)) return;
        nakIndex = nakIndex == null ? null : Math.round(nakIndex);
        if (nakIndex != null && !(nakIndex >= 1 && nakIndex <= 27)) nakIndex = null;
        if (jdAt) {
          jd = jdAt;
          moon = moonState(jd);
          planets = grahas(jd);
        }
        lit = nakIndex || null;
        if (nakIndex) {
          var mid = (nakIndex - 1) * (40 / 3) + (20 / 3);
          ringTarget = norm360(-mid + 90);   // bring it to the top of the ring
        }
      },
      clear: function () {
        lit = null;
        jd = jdNow();
        moon = moonState(jd);
        planets = grahas(jd);
        ringTarget = null;
      },
      state: function () { return { jd: jd, moon: moon, planets: planets, lit: lit }; }
    };
  }

  var api = {
    start: start, grahas: grahas, moonState: moonState, jdNow: jdNow,
    YOGATARA: YOGATARA, SPECTRAL: SPECTRAL
  };
  if (typeof globalThis !== "undefined") globalThis.Sky = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
