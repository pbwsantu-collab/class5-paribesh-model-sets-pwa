// ===== App State =====
let currentSet = 1;
let examMode = false;
let timerInterval = null;
let remainingSeconds = 90 * 60; // 1h 30m

// ===== DOM Elements =====
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const setList = document.getElementById('setList');
const examModeBtn = document.getElementById('examModeBtn');
const welcome = document.getElementById('welcome');
const setContainer = document.getElementById('setContainer');
const setTitle = document.getElementById('setTitle');
const questionsArea = document.getElementById('questionsArea');
const timerEl = document.getElementById('timer');
const prevSetBtn = document.getElementById('prevSet');
const nextSetBtn = document.getElementById('nextSet');
const startBtn = document.getElementById('startBtn');

// ===== Initialize Menu =====
function buildMenu() {
  setList.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const li = document.createElement('li');
    li.textContent = `Model Set ${i}`;
    li.dataset.set = i;
    if (i === currentSet) li.classList.add('active');
    li.addEventListener('click', () => {
      loadSet(i);
      closeSidebar();
    });
    setList.appendChild(li);
  }
}

// ===== Sidebar =====
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}
menuBtn.addEventListener('click', openSidebar);
closeMenu.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// ===== Exam Mode =====
examModeBtn.addEventListener('click', () => {
  examMode = !examMode;
  examModeBtn.textContent = examMode ? 'Exam Mode: ON' : 'Exam Mode: OFF';
  examModeBtn.classList.toggle('active', examMode);
  document.body.classList.toggle('exam-mode', examMode);

  if (examMode) {
    remainingSeconds = 90 * 60;
    timerEl.classList.add('show');
    startTimer();
  } else {
    timerEl.classList.remove('show');
    clearInterval(timerInterval);
  }
});

function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      alert('Time is up! Exam Mode ended.');
      examMode = false;
      examModeBtn.textContent = 'Exam Mode: OFF';
      examModeBtn.classList.remove('active');
      document.body.classList.remove('exam-mode');
      timerEl.classList.remove('show');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = remainingSeconds % 60;
  timerEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ===== Load a Set =====
function loadSet(num) {
  currentSet = num;
  welcome.classList.add('hidden');
  setContainer.classList.remove('hidden');
  setTitle.textContent = `MODEL SET-${num}`;

  // Update menu active state
  document.querySelectorAll('.set-list li').forEach(li => {
    li.classList.toggle('active', parseInt(li.dataset.set) === num);
  });

  // Render questions from data
  const setData = window.SETS_DATA[num] || window.SETS_DATA[1];
  renderQuestions(setData);

  prevSetBtn.disabled = num === 1;
  nextSetBtn.disabled = num === 30;
}

function renderQuestions(data) {
  questionsArea.innerHTML = '';
  data.sections.forEach(section => {
    const secTitle = document.createElement('div');
    secTitle.className = 'section-title';
    secTitle.textContent = section.title;
    questionsArea.appendChild(secTitle);

    section.questions.forEach(q => {
      const qDiv = document.createElement('div');
      qDiv.className = 'question';

      const qText = document.createElement('div');
      qText.className = 'q-text';
      qText.textContent = q.text;
      qText.addEventListener('click', () => toggleAnswer(qDiv));
      qDiv.appendChild(qText);

      if (q.options && q.options.length) {
        const ul = document.createElement('ul');
        ul.className = 'options';
        q.options.forEach(opt => {
          const li = document.createElement('li');
          li.textContent = opt;
          li.addEventListener('click', () => toggleAnswer(qDiv));
          ul.appendChild(li);
        });
        qDiv.appendChild(ul);
      }

      const ans = document.createElement('div');
      ans.className = 'answer';
      ans.innerHTML = `<strong>Answer:</strong> ${q.answer || 'See textbook / discuss with teacher'}`;
      qDiv.appendChild(ans);

      questionsArea.appendChild(qDiv);
    });
  });
}

function toggleAnswer(qDiv) {
  if (examMode) return;
  const ans = qDiv.querySelector('.answer');
  ans.classList.toggle('show');
}

// ===== Navigation =====
prevSetBtn.addEventListener('click', () => {
  if (currentSet > 1) loadSet(currentSet - 1);
});
nextSetBtn.addEventListener('click', () => {
  if (currentSet < 30) loadSet(currentSet + 1);
});
startBtn.addEventListener('click', () => loadSet(1));

// ===== Init =====
buildMenu();
