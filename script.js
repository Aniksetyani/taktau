const kosakata = [
  { emoji: "🍎", arab: "تفاح", indo: "Apel" },
  { emoji: "🍌", arab: "موز", indo: "Pisang" },
  { emoji: "🥕", arab: "جزر", indo: "Wortel" },
  { emoji: "🍊", arab: "برتقال", indo: "Jeruk" },
  { emoji: "🥒", arab: "خيار", indo: "Mentimun" },
  { emoji: "🍇", arab: "عنب", indo: "Anggur" },
  { emoji: "🍉", arab: "بطيخ", indo: "Semangka" },
  { emoji: "🥛", arab: "حليب", indo: "Susu" },
  { emoji: "☕", arab: "قهوة", indo: "Kopi" },
  { emoji: "🍞", arab: "خبز", indo: "Roti" }
];

// Render cards
const cardsContainer = document.getElementById("cards-container");
cardsContainer.innerHTML = kosakata.map((item, idx) => `
  <div class="card">
    <span>${item.emoji}</span>
    <p><b>${item.arab}</b></p>
    <p>${item.indo}</p>
    <button onclick="playAudio('${item.arab}')">🔊</button>
    <button onclick="addNote(${idx})">✏️</button>
  </div>
`).join("");

// Audio pakai Google Translate
function playAudio(text) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob`;
  const audio = new Audio(url);
  audio.play();
}

// Catatan (ikon pensil)
function addNote(idx) {
  let note = prompt(`Tulis catatan untuk kata "${kosakata[idx].arab}"`);
  if (note) {
    alert(`Catatan tersimpan: ${note}`);
  }
}

// Quiz
let currentQ = 0;
let score = 0;
const quizContainer = document.getElementById("quiz-container");

function startQuiz() {
  currentQ = 0;
  score = 0;
  loadQuiz();
}

function loadQuiz() {
  if (currentQ >= kosakata.length) {
    quizContainer.innerHTML = `
      <p><b>Selesai!</b> 🎉<br>Skor kamu: ${score}/${kosakata.length}</p>
      <button class="btn" onclick="startQuiz()">Ulangi Quiz</button>
    `;
    return;
  }
  
  const q = kosakata[currentQ];
  const options = [q.indo];
  
  while (options.length < 4) {
    let random = kosakata[Math.floor(Math.random()*kosakata.length)].indo;
    if (!options.includes(random)) options.push(random);
  }
  options.sort(() => Math.random()-0.5);
  
  quizContainer.innerHTML = `
    <p>Arti dari kata <b>${q.emoji} ${q.arab}</b> adalah...</p>
    ${options.map((opt,i) => 
      `<button class="quiz-option quiz-color-${i}" onclick="checkAnswer(this,'${opt}','${q.indo}')">${opt}</button>`
    ).join("")}
  `;
}

function checkAnswer(btn, answer, correct) {
  if (answer === correct) {
    btn.classList.add("correct");
    score++;
    setTimeout(() => {
      currentQ++;
      loadQuiz();
    }, 1000);
  } else {
    btn.classList.add("wrong");
    setTimeout(() => {
      btn.classList.remove("wrong");
    }, 800);
  }
}

// Latihan Bicara
function startSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Browser tidak mendukung speech recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.start();

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    document.getElementById("speech-result").textContent = `Kamu bilang: ${result}`;
    const kataArab = kosakata.map(k => k.arab);
    if (kataArab.includes(result)) {
      document.getElementById("speech-result").textContent += " ✅ Benar!";
    } else {
      document.getElementById("speech-result").textContent += " ❌ Coba lagi!";
    }
  };
}
