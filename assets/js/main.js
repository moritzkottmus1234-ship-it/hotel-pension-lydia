(function () {
  var nav = document.getElementById('nav');
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40 || menu.classList.contains('open')); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    onScroll();
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      onScroll();
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  var form = document.getElementById('form');
  var today = new Date().toISOString().slice(0, 10);
  form.anreise.min = today; form.abreise.min = today;
  form.anreise.addEventListener('change', function () { form.abreise.min = form.anreise.value; });

  function fmt(d) { if (!d) return ''; var p = d.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    ['anreise', 'abreise', 'name', 'email'].forEach(function (n) {
      var f = form[n]; var bad = !f.value || (n === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('err', bad); if (bad) ok = false;
    });
    if (form.abreise.value && form.anreise.value && form.abreise.value <= form.anreise.value) { form.abreise.classList.add('err'); ok = false; }
    if (!ok) return;
    var body = 'Guten Tag,\n\nich möchte gern ein Zimmer anfragen:\n\n' +
      'Anreise: ' + fmt(form.anreise.value) + '\nAbreise: ' + fmt(form.abreise.value) +
      '\nZimmer: ' + form.zimmer.value + '\nFahrzeug: ' + form.fahrzeug.value +
      (form.nachricht.value ? '\n\n' + form.nachricht.value : '') +
      '\n\nViele Grüße\n' + form.name.value + '\n' + form.email.value;
    window.location.href = 'mailto:info@hotel-lydia.de?subject=' + encodeURIComponent('Zimmeranfrage ' + fmt(form.anreise.value) + ' – ' + fmt(form.abreise.value)) + '&body=' + encodeURIComponent(body);
  });
})();
