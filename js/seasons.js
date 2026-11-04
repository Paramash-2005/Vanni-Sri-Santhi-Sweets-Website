// seasons.js — decides which festival theme is active TODAY and tags <html data-season="...">.
// Runs synchronously in <head> so the right colours paint on first frame (no flash).
// Outside every festival window the site shows the calm "classic" look automatically.
//
// To add or fix a festival: edit SEASONS below. Moving dates (Deepavali) are listed per year in `dates`;
// fixed-calendar ones use `md` ("MM-DD"). Preview any theme without waiting: add ?season=pongal to the URL
// (ids: deepavali, christmas, pongal, puthandu, classic).
(function () {
  var DAY = 864e5;
  function at(ymd) { return new Date(ymd + 'T00:00:00+05:30').getTime(); }

  var SEASONS = [
    {
      id: 'deepavali', dates: { 2026: '2026-11-08', 2027: '2027-10-29' }, before: 21, after: 2,
      effect: 'crackers', lanterns: true,
      badge: 'Deepavali Special · தீபாவளி சிறப்பு', heroWords: 'Light Up Your Deepavali|with Heritage Sweets',
      ta: 'இனிய தீபாவளி நல்வாழ்த்துக்கள்',
      heroP: "Hand-made Tirunelveli halwa, balcova, mysorepak and crisp savouries, packed for the festival. Shipping across Tamil Nadu and all of India.",
      cta: 'Deepavali Gift Boxes',
      eyebrow: 'Deepavali Collection', title: 'Sweets That Make the Festival Shine', fta: 'தீபாவளி இனிப்புப் பெட்டிகள்',
      copy: 'Fresh-made halwa, balcova, mysorepak and crisp savouries, packed into festive boxes for your family and the ones far away. Order early — festival days book up fast.',
      count: 'Deepavali begins in', done: 'Happy Deepavali! · இனிய தீபாவளி நல்வாழ்த்துக்கள்',
      hampers: [
        ['The Sweet Box', 'இனிப்புப் பெட்டி', 'Tirunelveli Halwa, Balcova and Mysorepak — the festival classics.', 'Deepavali Sweet Box (Halwa, Balcova, Mysorepak)'],
        ['The Grand Combo', 'சிறப்புக் கலவைப் பெட்டி', 'Sweets and savouries together — our favourite way to gift a whole family.', 'Deepavali Grand Combo (sweets + savouries)'],
        ['The Savoury Box', 'காரப் பெட்டி', 'Mixture, Muruku and Thattai, crisp and fresh for the festival table.', 'Deepavali Savoury Box (Mixture, Muruku, Thattai)']
      ],
      marquee: ['Happy Deepavali · இனிய தீபாவளி', 'Deepavali Gift Boxes', 'Tirunelveli Halwa', 'Mixture & Balcova', 'Ships Across Tamil Nadu & India', 'Bulk & Festival Orders Welcome']
    },
    {
      id: 'christmas', md: '12-25', before: 14, after: 8,
      effect: 'snow', lanterns: true,
      badge: 'Christmas & New Year · கிறிஸ்துமஸ்', heroWords: 'Sweet Moments|for Christmas & the New Year',
      ta: 'கிறிஸ்துமஸ் மற்றும் புத்தாண்டு வாழ்த்துக்கள்',
      heroP: 'Cakes, sweets and savouries from our Tirunelveli kitchen — ready to share at the table or send to family far away.',
      cta: 'Festive Gift Boxes',
      eyebrow: 'Season of Sharing', title: 'Gift Boxes for Christmas & the New Year', fta: 'பண்டிகை பரிசுப் பெட்டிகள்',
      copy: 'Pack a box for neighbours, colleagues or loved ones. Tell us the quantity and we will prepare and wrap it fresh.',
      count: 'Christmas begins in', done: 'Merry Christmas & Happy New Year! · இனிய நல்வாழ்த்துக்கள்',
      hampers: [
        ['The Sweet Box', 'இனிப்புப் பெட்டி', 'Halwa, Mysorepak and Milk Sweet — gentle, festive and easy to share.', 'Christmas Sweet Box (Halwa, Mysorepak, Milk Sweet)'],
        ['The Celebration Box', 'கொண்டாட்டப் பெட்டி', 'A generous mix of sweets and savouries for the whole household.', 'Christmas Celebration Box (sweets + savouries)'],
        ['The Savoury Box', 'காரப் பெட்டி', 'Mixture, Muruku and Thattai for the New Year table.', 'New Year Savoury Box (Mixture, Muruku, Thattai)']
      ],
      marquee: ['Merry Christmas & Happy New Year', 'Festive Gift Boxes', 'Tirunelveli Halwa', 'Mixture & Balcova', 'Ships Across Tamil Nadu & India', 'Bulk & Corporate Gifting Welcome']
    },
    {
      id: 'pongal', md: '01-14', before: 12, after: 3,
      effect: 'petals', lanterns: false,
      badge: 'Pongal Special · பொங்கல் சிறப்பு', heroWords: 'Pongal O Pongal!|Sweets for the Harvest',
      ta: 'இனிய பொங்கல் நல்வாழ்த்துக்கள்',
      heroP: 'Celebrate the harvest with traditional Tamil sweets and savouries, made fresh in Tirunelveli and shipped across India.',
      cta: 'Pongal Gift Boxes',
      eyebrow: 'Thai Pongal', title: 'A Harvest Table, Sweetened', fta: 'பொங்கல் இனிப்புப் பெட்டிகள்',
      copy: 'Boxes for the Pongal feast and for sharing with neighbours and relatives. Order a few days early so it reaches in time.',
      count: 'Pongal begins in', done: 'Happy Pongal! · இனிய பொங்கல் நல்வாழ்த்துக்கள்',
      hampers: [
        ['The Pongal Sweet Box', 'பொங்கல் இனிப்புப் பெட்டி', 'Halwa, Jilebi and Laddoo — the sweet side of the feast.', 'Pongal Sweet Box (Halwa, Jilebi, Laddoo)'],
        ['The Family Hamper', 'குடும்பப் பெட்டி', 'Sweets and savouries together, sized for the whole family.', 'Pongal Family Hamper (sweets + savouries)'],
        ['The Savoury Box', 'காரப் பெட்டி', 'Mixture, Muruku and Thattai for visitors and the festival day.', 'Pongal Savoury Box (Mixture, Muruku, Thattai)']
      ],
      marquee: ['Happy Pongal · இனிய பொங்கல்', 'Pongal Gift Boxes', 'Tirunelveli Halwa', 'Mixture & Balcova', 'Ships Across Tamil Nadu & India', 'Bulk & Festival Orders Welcome']
    },
    {
      id: 'puthandu', md: '04-14', before: 14, after: 2,
      effect: 'petals', lanterns: true,
      badge: 'Tamil New Year · தமிழ்ப் புத்தாண்டு', heroWords: 'A Sweet Start|to the Tamil New Year',
      ta: 'இனிய தமிழ்ப் புத்தாண்டு நல்வாழ்த்துக்கள்',
      heroP: 'Begin the year the traditional way — with sweets from Tirunelveli, made fresh and sent to the people you love.',
      cta: 'New Year Gift Boxes',
      eyebrow: 'Puthandu', title: 'Begin the Year with Something Sweet', fta: 'புத்தாண்டு இனிப்புப் பெட்டிகள்',
      copy: 'Mango-season sweetness for the Tamil New Year table. Tell us the quantity and we will pack it fresh.',
      count: 'Tamil New Year begins in', done: 'Happy Tamil New Year! · இனிய தமிழ்ப் புத்தாண்டு',
      hampers: [
        ['The Sweet Box', 'இனிப்புப் பெட்டி', 'Halwa, Mysorepak and Badhusha for the first meal of the year.', 'Tamil New Year Sweet Box (Halwa, Mysorepak, Badhusha)'],
        ['The Family Hamper', 'குடும்பப் பெட்டி', 'Sweets and savouries together for relatives and visitors.', 'Tamil New Year Family Hamper (sweets + savouries)'],
        ['The Savoury Box', 'காரப் பெட்டி', 'Mixture, Muruku and Sev, crisp and fresh.', 'Tamil New Year Savoury Box (Mixture, Muruku, Sev)']
      ],
      marquee: ['Happy Tamil New Year · தமிழ்ப் புத்தாண்டு வாழ்த்துக்கள்', 'New Year Gift Boxes', 'Tirunelveli Halwa', 'Mixture & Balcova', 'Ships Across Tamil Nadu & India', 'Bulk & Festival Orders Welcome']
    }
  ];

  var CLASSIC = {
    id: 'classic', effect: 'none', lanterns: false, festival: false,
    heroWords: "Tirunelveli's Heritage|Sweets & Savouries",
    ta: 'திருநெல்வேலியின் பாரம்பரிய இனிப்புகள்',
    heroP: "Vannai Sri Santhi Sweets & Bakery has been hand-making Tirunelveli's favourite halwa, mixture and balcova since 2004. Now shipping across Tamil Nadu and all of India.",
    cta: 'Shop Sweets', ctaHref: '#categories',
    marquee: ['Tirunelveli Halwa', 'Mixture & Balcova', 'Fresh Sweets & Savouries', 'Ships Across Tamil Nadu & India', 'Bulk & Wedding Orders Welcome', 'Since 2004']
  };

  function targetFor(s, now) {
    var y = new Date(now).getFullYear(), best = null;
    [y - 1, y, y + 1].forEach(function (yr) {
      var ymd = s.dates ? s.dates[yr] : (yr + '-' + s.md);
      if (!ymd) return;
      var t = at(ymd);
      if (now >= t - s.before * DAY && now < t + (s.after + 1) * DAY) best = t;
    });
    return best;
  }

  var now = Date.now(), chosen = null, forced = null;
  try { forced = new URLSearchParams(location.search).get('season'); } catch (e) {}

  if (forced === 'classic') chosen = null;
  else {
    for (var i = 0; i < SEASONS.length; i++) {
      var s = SEASONS[i], t = forced ? at('2000-01-01') : targetFor(s, now);
      if (forced && s.id === forced) {
        // preview: pretend the festival is 9 days away (or its real next date if known)
        chosen = Object.assign({}, s, { target: now + 9 * DAY + 3600e3 * 5 });
        break;
      }
      if (!forced && t) { chosen = Object.assign({}, s, { target: t }); break; }
    }
  }

  var season = chosen || CLASSIC;
  if (chosen) season.festival = true;
  window.VANNAI_SEASON = season;
  document.documentElement.setAttribute('data-season', season.id);
})();
