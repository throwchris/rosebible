// ============================
// Strong's JSON
// ============================
let strongsJson = {};
let strongsJsonLoaded = false;

// ============================
// Load Strong's JSON
// ============================
function loadStrongsJson() {
  fetch('./strongs-greek.json')
    .then(res => {
      if (!res.ok) throw new Error("Unable to load Strong's JSON");
      return res.json();
    })
    .then(data => {
      strongsJson = data;
      strongsJsonLoaded = true;
    })
    .catch(err => {
      console.error("Error loading Strong's JSON:", err);
    });
}

// ============================
// Convert "wordG1234" to clickable <span class="word">
// (Strong's number hidden, stored in data-strongs)
// ============================
function processStrongsInContainer(root) {
  if (!root) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return /G\d{1,4}/.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    const parent = node.parentNode;
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();

    // Match "wordG1234"
    const regex = /(\S+?)(G\d{1,4})/g;
    let lastIndex = 0;
    let m;

    while ((m = regex.exec(text)) !== null) {
      const before = text.slice(lastIndex, m.index);
      if (before) {
        frag.appendChild(document.createTextNode(before));
      }

      const word = m[1];    // visible word
      const code = m[2];    // e.g. "G5119"

      const span = document.createElement('span');
      span.textContent = word;           // ONLY the word is visible
      span.className = 'word';
      span.dataset.strongs = code;
      span.addEventListener('click', () => openStrongsModal(code, word));

      frag.appendChild(span);

      lastIndex = m.index + m[0].length;
    }

    const rest = text.slice(lastIndex);
    if (rest) {
      frag.appendChild(document.createTextNode(rest));
    }

    parent.replaceChild(frag, node);
  });
}

// ============================
// Strong's Modal helpers
// ============================
function openStrongsModal(code, word) {
  if (!strongsJsonLoaded) {
    alert("Strong's data is still loading. Please try again in a moment.");
    return;
  }

  const entry = strongsJson[code];

  const headerEl   = document.getElementById('strongsHeader');
  const lemmaEl    = document.getElementById('strongsLemma');
  const translitEl = document.getElementById('strongsTranslit');
  const codeEl     = document.getElementById('strongsCode');
  const defEl      = document.getElementById('strongsDef');
  const kjvEl      = document.getElementById('strongsKJV');

  if (!headerEl || !lemmaEl || !translitEl || !codeEl || !defEl || !kjvEl) {
    console.error("Strong's modal elements not found in the DOM.");
    return;
  }

  // Show the clicked word and Strong's number in the header (like Jude)
  headerEl.textContent = `${word} — ${code}`;

  if (!entry) {
    lemmaEl.textContent    = '';
    translitEl.textContent = '';
    codeEl.textContent     = code;
    defEl.textContent      = "No Strong's entry found for this number.";
    kjvEl.textContent      = '';
  } else {
    lemmaEl.textContent    = entry.lemma || '';
    translitEl.textContent = entry.translit || '';
    codeEl.textContent     = code;
    defEl.textContent      = entry.strongs_def || '';
    kjvEl.textContent =
      entry.kjv_def ||
      (entry.kjv_usage ? entry.kjv_usage.join(', ') : '');
  }

  const modal = document.getElementById('strongsModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeStrongsModal(event) {
  const modal = document.getElementById('strongsModal');
  if (!modal) return;

  if (!event || event.target.id === 'strongsModal') {
    modal.style.display = 'none';
  }
}

// ============================
// UI helpers: font size & light mode
// ============================
function myFunction4() {
  const element = document.getElementById("font");
  if (element) {
    element.classList.toggle("w3-xlarge");
  }
}

function myFunction2() {
  document.body.classList.toggle("light-mode");
}

function toggleParagraphMode() {
  const container = document.getElementById('font');
  if (!container) return;

  // If turning OFF paragraph mode → restore original
  if (container.classList.contains('paragraph-mode')) {
      restoreVerseMode(container);
      return;
  }

  // Else turn ON paragraph mode
  applyParagraphMode(container);
}

function restoreVerseMode(container) {
  container.classList.remove('paragraph-mode');

  // unwrap paragraphs back to individual verses
  const paragraphs = container.querySelectorAll('.paragraph-chunk');
  paragraphs.forEach(chunk => {
      while (chunk.firstChild) {
          container.insertBefore(chunk.firstChild, chunk);
      }
      chunk.remove();
  });
}

function applyParagraphMode(container) {
  const verses = Array.from(container.querySelectorAll('.w3-justify'));
  if (verses.length === 0) return;

  container.classList.add('paragraph-mode');

  let chunk = null;
  verses.forEach((verse, index) => {
      if (index % 4 === 0) {
          chunk = document.createElement('div');
          chunk.className = 'paragraph-chunk';
          container.insertBefore(chunk, verse);
      }
      chunk.appendChild(verse);
  });
}





// ============================
// Audio controls (safe if not present)
// ============================
function initAudioControls() {
  const audio           = document.querySelector('audio');
  const playBtn         = document.getElementById('playBtn');
  const pauseBtn        = document.getElementById('pauseBtn');
  const rewindBtn       = document.getElementById('rewindBtn');
  const fastForwardBtn  = document.getElementById('fastForwardBtn');
  const currentTimeSpan = document.getElementById('currentTime');
  const durationSpan    = document.getElementById('duration');

  // If the page doesn't have these elements, skip audio setup
  if (!audio || !playBtn || !pauseBtn || !rewindBtn || !fastForwardBtn || !currentTimeSpan || !durationSpan) {
    return;
  }

  let isPlaying = false;

  function playAudio() {
    audio.play();
    isPlaying = true;
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
  }

  function rewindAudio() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  }

  function fastForwardAudio() {
    if (isFinite(audio.duration)) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    } else {
      audio.currentTime += 10;
    }
  }

  function updateTime() {
    const currentTime = Math.floor(audio.currentTime || 0);
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime - minutes * 60;
    currentTimeSpan.textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateDuration() {
    if (!isFinite(audio.duration)) return;
    const duration = Math.floor(audio.duration || 0);
    const minutes = Math.floor(duration / 60);
    const seconds = duration - minutes * 60;
    durationSpan.textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  pauseBtn.style.display = 'none';

  playBtn.addEventListener('click', playAudio);
  pauseBtn.addEventListener('click', pauseAudio);
  rewindBtn.addEventListener('click', rewindAudio);
  fastForwardBtn.addEventListener('click', fastForwardAudio);
  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('loadedmetadata', updateDuration);
}

// ============================
// Boot
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.getElementById('font');
  if (mainContainer) {
    processStrongsInContainer(mainContainer);
  }

  loadStrongsJson();
  initAudioControls();
});
