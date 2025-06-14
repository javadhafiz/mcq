let correctAnswers = [];

async function generateQuiz() {
  //const topic = document.getElementById("topic").value;
  const quizForm = document.getElementById("quizForm");
  const resultBox = document.getElementById("resultBox");
  resultBox.textContent = '';
  quizForm.innerHTML = "⏳ Generating questions...";

  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `Generate 12 multiple choice questions (MCQs) in JSON array format based only on authentic Shia sources (like Bihar al-Anwar, Al-Kafi, etc.) about the event of Ghadir Khumm in JSON array format like:
[
  {
    "question": "Your question here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option (exact match from options)"
  },
  ...
]

Ensure all questions and answers are historically accurate and traceable to Shia references. Do not include fabricated or weak narrations or Sunni views. Fact check with shia prespective and then generate.`
    })
  });
//${topic}
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

  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Give one tradition from book biharul-anwar or Al-kafi, mentioning who said it, in the format:

📜 "Hadith here..."
– Imam Name (a)

Provide tradition reference and keep line break in between. Ensure tradition is historically accurate and traceable to Shia references. Do not include fabricated or weak narrations or Sunni views. Fact check with shia prespective and then write.`,
    }),
  });

  const data = await res.json();
  if (data.error) {
    box.innerHTML = `<p style="color:red;">❌ ${data.error.message || "Error"}</p>`;
    return;
  }

  box.innerHTML = `<blockquote>${data.response}</blockquote>`;
  //copyToClipboard1();
}

async function generateAnswer() {
  const box = document.getElementById("answerBox");
  box.innerHTML = "⏳ Fetching answer...";
//const question = document.getElementById("question").value;
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Generate an islamic question and its answer based on Shia version from website www.al-islam.org in format like:
 
    Question here...

    📋Answer here...

    Website name in italic...
  
 Never negate shia beliefs while answering. Fact check with shia prespective and then write.`,
    }),
  });

  const data = await res.json();
  if (data.error) {
    box.innerHTML = `<p style="color:red;">❌ ${data.error.message || "Error"}</p>`;
    return;
  }

  box.innerHTML = `<blockquote>${data.response}</blockquote>`;
  copyToClipboard2();
}
