let currentQuestion = 0;
const questions = [
  {
    question: "Hyy, how are you?",
    options: ["Fine", "Not Good"],
    emoticons: ["😍", "😒"]
  },
  {
    question: "When will we meet?",
    options: ["Monday", "Tuesday", "Never"],
    emoticons: ["🥰", "😍", "😢"]
  },
  {
    question: "How much do you like me?",
    options: ["below 50%", "between 50%-80%", "above 80%"],
    emoticons: ["😐", "😍", "🥰"]
  }
];

const results = [];
let userEmail = "";

function startQuestionnaire() {
  const emailInput = document.getElementById("email");
  userEmail = emailInput.value;

  if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
    alert("Please enter a valid email address!");
    return;
  }

  document.getElementById("email-section").style.display = "none";
  document.getElementById("question-container").style.display = "block";

  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestion];
  const questionText = document.getElementById("question-text");
  questionText.textContent = question.question;

  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach((btn, index) => {
    if (index < question.options.length) {
      btn.textContent = question.options[index];
      btn.style.display = 'inline-block';
    } else {
      btn.style.display = 'none';
    }
  });
}

function nextQuestion(optionIndex) {
  const selectedOption = questions[currentQuestion].options[optionIndex - 1];
  const selectedEmoticon = questions[currentQuestion].emoticons[optionIndex - 1];

  results.push({ answer: selectedOption, emoticon: selectedEmoticon });

  const emoticonDiv = document.getElementById("results");
  const emoticonElem = document.createElement("span");
  emoticonElem.classList.add("emoticon");
  emoticonElem.textContent = selectedEmoticon;

  emoticonDiv.appendChild(emoticonElem);

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
      emoticonDiv.innerHTML = '';
    } else {
      document.getElementById("question-container").style.display = 'none';
      document.getElementById("results").style.display = 'none';
      document.getElementById("thank-you-message").style.display = 'block';
      sendResultsToBackend();
    }
  }, 1000);
}

function sendResultsToBackend() {
  const data = {
    email: userEmail,
    answers: results,
  };

  fetch('https://backend-g2ri.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Success:', data);
      alert('Thank you for your responses!');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Failed to save your responses.');
    });
}
