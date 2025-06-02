let correctAnswers = [];

async function generateQuiz() {
  const topic = document.getElementById("topic").value;
  const quizForm = document.getElementById("quizForm");
  const resultBox = document.getElementById("resultBox");
  resultBox.textContent = '';
  quizForm.innerHTML = "⏳ Generating questions...";

  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
       prompt: `Based on Shia version of islam negating sunnism generate 5 multiple choice questions (MCQ) on ${topic} in JSON array format like:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  },
  ...
]`
    })
  });

  const data = await res.json();
  if (data.error) {
    quizForm.innerHTML = `<p style="color:red;">❌ Error: ${data.error.message || data.error}</p>`;
    return;
  }

  let questions;
  try {
    questions = JSON.parse(data.response);
  } catch (err) {
    quizForm.innerHTML = `<p style="color:red;">⚠️ Could not parse MCQs. Try again.</p>`;
    return;
  }

  correctAnswers = questions.map(q => q.answer);

  quizForm.innerHTML = questions.map((q, index) => `
    <div class="question-block">
      <p><strong>Q${index + 1}: ${q.question}</strong></p>
      <div class="options">
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="q${index}" value="${opt}" required />
            ${opt}
          </label><br/>
        `).join("")}
      </div>
    </div>
  `).join("") + `<button type="submit">Submit Quiz</button>`;
}

function submitQuiz(e) {
  e.preventDefault();
  const quizForm = document.getElementById("quizForm");
  const resultBox = document.getElementById("resultBox");
  let score = 0;

  correctAnswers.forEach((ans, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value.trim().toLowerCase() === ans.trim().toLowerCase()) {
      score++;
    }
  });

  resultBox.innerHTML = `✅ You scored ${score} out of ${correctAnswers.length}`;

}
async function generateTradition() {
  const box = document.getElementById("traditionBox");
  box.innerHTML = "⏳ Fetching a tradition...";
const topic = document.getElementById("topic").value;
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     prompt: `Give one tradition from book biharul anwar or any shia books, mentioning who said it, in the format:

📜 "Hadith here..."
– Imam Name (a)

Provide book reference and keep line break in between.`,
    }),
  });

  const data = await res.json();
  if (data.error) {
    box.innerHTML = `<p style="color:red;">❌ ${data.error.message || "Error"}</p>`;
    return;
  }

  box.innerHTML = `<blockquote>${data.response}</blockquote>`;
}
