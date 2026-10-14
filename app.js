'use strict';

const data = window.INVITATION;
const $ = selector => document.querySelector(selector);
const set = (selector, text) => { $(selector).textContent = text; };

set('#bride', data.bride);
set('#groom', data.groom);
set('#blessing', data.blessing);
set('#intro', data.introduction);
set('#family-note', data.familyNote);
set('#family-name', data.familyName);
set('#closing', data.closing);
set('#date-month', data.month.toUpperCase());
set('#date-day', data.day);
document.querySelectorAll('[data-couple]').forEach(el => {
  const bride = document.createElement('span');
  bride.textContent = data.bride;
  const ampersand = document.createElement('span');
  ampersand.className = 'couple-ampersand';
  ampersand.textContent = '&';
  const groom = document.createElement('span');
  groom.textContent = data.groom;
  el.replaceChildren(bride, ' ', ampersand, ' ', groom);
});
document.querySelectorAll('[data-date]').forEach(el => { el.textContent = data.dateLabel; });
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = data.year; });
document.title = `${data.bride} weds ${data.groom} | ${data.hashtag}`;
if (!window.location.hash && window.location.protocol !== 'file:') {
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}${data.hashtag}`);
}

// Google Calendar uses an exclusive end date for all-day events.
// Saving the wedding day does not invent an end time for any ceremony.
const weddingDay = data.date.replaceAll('-', '');
const nextDay = new Date(`${data.date}T00:00:00Z`);
nextDay.setUTCDate(nextDay.getUTCDate() + 1);
const endDay = nextDay.toISOString().slice(0, 10).replaceAll('-', '');
const calendar = new URL('https://calendar.google.com/calendar/render');
const venueLabel = event => `${event.venue.name}, ${event.venue.address}`;
const weddingEvent = data.events.find(event => event.theme === 'wedding');
calendar.search = new URLSearchParams({
  action: 'TEMPLATE',
  text: `${data.bride} weds ${data.groom} | ${data.hashtag}`,
  dates: `${weddingDay}/${endDay}`,
  ctz: data.timezone,
  location: venueLabel(weddingEvent),
  details: [
    `${data.bride} weds ${data.groom}`,
    data.hashtag,
    '',
    'Our celebration schedule (all times in India Standard Time):',
    ...data.events.map(event => `${event.day} ${event.month} ${data.year} — ${event.name}: ${event.time}\nVenue: ${venueLabel(event)}`),
    '',
    data.closing
  ].join('\n')
}).toString();
$('#calendar').href = calendar.href;

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const audio = $('#music');
audio.volume = 0.55;
function musicState(playing) {
  $('#music-toggle').setAttribute('aria-pressed', String(playing));
  $('#music-toggle').setAttribute('aria-label', playing ? 'Pause invitation music' : 'Play invitation music');
  set('#music-state', playing ? 'Music on' : 'Music off');
}
async function playMusic() {
  try { await audio.play(); musicState(true); }
  catch { musicState(false); }
}
let opening = false;
function openInvitation() {
  if (opening) return;
  opening = true;
  $('#seal').disabled = true;
  $('#open-label').disabled = true;
  $('#cover').classList.add('opening');
  playMusic();
  setTimeout(() => {
    $('#invitation').inert = false;
    document.body.classList.remove('sealed');
    $('#music-toggle').hidden = false;
    $('#cover').classList.add('departing');
    setTimeout(() => {
      $('#cover').hidden = true;
      $('#cover').style.display = 'none';
      $('#nayankipalak').setAttribute('tabindex', '-1');
      $('#nayankipalak').focus({ preventScroll: true });
    }, reduce ? 10 : 900);
  }, reduce ? 20 : 1700);
}
$('#seal').addEventListener('click', openInvitation);
$('#open-label').addEventListener('click', openInvitation);
$('#music-toggle').addEventListener('click', () => {
  if (audio.paused) playMusic();
  else { audio.pause(); musicState(false); }
});
audio.addEventListener('pause', () => musicState(false));
audio.addEventListener('error', () => musicState(false));
$('#replay').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (window.location.protocol !== 'file:') history.replaceState(null, '', data.hashtag);
  audio.pause();
  audio.currentTime = 0;
  opening = false;
  $('#cover').hidden = false;
  $('#cover').style.display = '';
  $('#cover').classList.remove('opening', 'departing');
  document.body.classList.add('sealed');
  $('#invitation').inert = true;
  $('#seal').disabled = false;
  $('#open-label').disabled = false;
  $('#music-toggle').hidden = true;
  $('#seal').focus({ preventScroll: true });
});

// Each illustration keeps its original pixel dimensions and aspect ratio.
const eventArtwork = {
  kumkum: { src: 'assets/events/kumkum.webp', width: 512, height: 1024 },
  haldi: { src: 'assets/events/haldi.webp', width: 512, height: 1024 },
  mehendi: { src: 'assets/events/mehendi.webp', width: 1024, height: 1536 },
  baarat: { src: 'assets/events/baarat.webp', width: 512, height: 1024 },
  sangeet: { src: 'assets/events/sangeet.webp', width: 512, height: 1024 },
  wedding: { src: 'assets/events/phera.webp', width: 512, height: 1024 },
  reception: { src: 'assets/events/reception.webp', width: 512, height: 1024 }
};

data.events.forEach(event => {
  const card = document.createElement('article');
  card.className = `event ${event.theme} reveal`;
  card.innerHTML = '<div class="event-art"><img class="event-image" alt="" loading="lazy" decoding="async"><div class="event-copy"><span class="eyebrow"></span><h3></h3><div class="event-date"><strong></strong><span></span></div><p class="event-time"></p><p class="event-venue"></p></div></div>';
  const artwork = eventArtwork[event.theme];
  const image = card.querySelector('.event-image');
  image.src = artwork.src;
  image.width = artwork.width;
  image.height = artwork.height;
  card.querySelector('.eyebrow').textContent = event.eyebrow;
  card.querySelector('h3').textContent = event.name;
  card.querySelector('.event-date strong').textContent = event.day;
  card.querySelector('.event-date span').textContent = event.month;
  card.querySelector('.event-time').textContent = `Timing : ${event.time}`;
  card.querySelector('.event-venue').textContent = `Venue : ${venueLabel(event)}`;
  card.setAttribute('aria-label', `${event.name}, ${event.day} ${event.month} ${data.year}, ${event.time}, India Standard Time. Venue: ${venueLabel(event)}`);
  $('#event-list').append(card);
});

let slide = 0;
const moments = [
  { src: 'assets/couple/palak-nayan-floral.jpeg', width: 1066, height: 1600, alt: 'Palak and Nayan together beneath a floral arch', caption: 'A little sunshine, a lifetime of happiness.' },
  { src: 'assets/couple/palak-nayan-together.jpeg', width: 1066, height: 1600, alt: 'Palak and Nayan holding hands outdoors', caption: 'Hand in hand, into forever.' },
  { src: 'assets/couple/palak-nayan-portrait.jpeg', width: 1024, height: 1536, alt: 'Palak and Nayan smiling together in festive outfits', caption: 'Where our forever begins.' }
];
const captions = moments.map(moment => moment.caption);
for (let i = 0; i < captions.length; i++) {
  const card = document.createElement('button');
  card.className = 'gallery-card';
  const artwork = moments[i];
  const image = document.createElement('img');
  image.src = artwork.src;
  image.alt = artwork.alt;
  image.width = artwork.width;
  image.height = artwork.height;
  image.loading = 'lazy';
  image.decoding = 'async';
  card.append(image);
  card.setAttribute('aria-label', captions[i]);
  card.addEventListener('click', () => { slide = i; renderGallery(); });
  $('#gallery-stage').append(card);
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `View moment ${i + 1}`);
  dot.addEventListener('click', () => { slide = i; renderGallery(); });
  $('#gallery-dots').append(dot);
}
function renderGallery() {
  document.querySelectorAll('.gallery-card').forEach((card, i) => {
    card.dataset.position = String((i - slide + captions.length) % captions.length);
    card.tabIndex = i === slide ? 0 : -1;
  });
  document.querySelectorAll('#gallery-dots button').forEach((dot, i) => {
    dot.setAttribute('aria-current', String(i === slide));
  });
  set('#gallery-caption', captions[slide]);
}
function step(direction) {
  slide = (slide + direction + captions.length) % captions.length;
  renderGallery();
}
$('.previous').addEventListener('click', () => step(-1));
$('.next').addEventListener('click', () => step(1));
$('.gallery').addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
});
let startX = null;
$('.gallery').addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
$('.gallery').addEventListener('touchend', event => {
  if (startX !== null) {
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 40) step(distance < 0 ? 1 : -1);
  }
  startX = null;
}, { passive: true });
renderGallery();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
if (!reduce) {
  for (let i = 0; i < 19; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = '❧';
    petal.style.left = `${(i * 37 + 11) % 100}%`;
    petal.style.setProperty('--duration', `${12 + (i % 7)}s`);
    petal.style.setProperty('--delay', `${-(i * 0.87)}s`);
    petal.style.setProperty('--drift', `${(i % 2 ? 1 : -1) * (25 + i * 3)}px`);
    petal.style.fontSize = `${13 + i % 9}px`;
    $('#petals').append(petal);
  }
}
