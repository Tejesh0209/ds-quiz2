let quizData = {};  // Global variable to store the quiz data

// Function to fetch quiz data from the JSON file
async function loadQuizData() {
  try {
    const response = await fetch('questions.json'); // Fetch the JSON file
    quizData = await response.json(); // Parse the JSON data

    // Set the quiz title dynamically
    document.getElementById('quiz-title').textContent = quizData.quizTitle;

    // Render each question dynamically
    const quizForm = document.getElementById('quiz-form');
    quizData.questions.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');

      const questionTitle = document.createElement('p');
      questionTitle.textContent = `${index + 1}. ${q.question}`;

      questionDiv.appendChild(questionTitle);

      // Shuffle options
      const optionsArray = Object.keys(q.options).map(key => ({
        label: key,
        option: q.options[key]
      }));

      shuffle(optionsArray);  // Shuffle options

      // Add options to the question
      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add('options');
      
      optionsArray.forEach(option => {
        const optionLabel = document.createElement('label');
        const optionInput = document.createElement('input');
        
        optionInput.type = 'radio';
        optionInput.name = `question-${index}`;
        optionInput.value = option.option; // Store the option text as the value
        
        // Add event listener to show the answer immediately after selection
        optionInput.addEventListener('change', () => showAnswerFeedback(optionInput, q, questionDiv));

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(option.option));
        
        optionsDiv.appendChild(optionLabel);
      });

      questionDiv.appendChild(optionsDiv);
      quizForm.appendChild(questionDiv);
    });
  } catch (error) {
    console.error('Error loading quiz data:', error);
  }
}

// Function to shuffle the options randomly
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Function to show the feedback for the selected answer
function showAnswerFeedback(optionInput, questionData, questionDiv) {
  const feedbackDiv = document.createElement('div');
  feedbackDiv.classList.add('feedback');

  // Determine if the selected option is correct
  if (optionInput.value === questionData.options[questionData.correct_answer]) {
    feedbackDiv.textContent = 'Correct!';
    feedbackDiv.style.color = 'green';
    feedbackDiv.classList.add('correct');
  } else {
    feedbackDiv.textContent = 'Incorrect! The correct answer is: ' + questionData.options[questionData.correct_answer];
    feedbackDiv.style.color = 'red';
    feedbackDiv.classList.add('incorrect');
  }

  // Append feedback to the question div
  questionDiv.appendChild(feedbackDiv);

  // Disable the options after one selection
  const allInputs = questionDiv.querySelectorAll('input[type="radio"]');
  allInputs.forEach(input => input.disabled = true);

  // Show the next button only after the user answers all questions
  if (document.querySelectorAll('.feedback').length === quizData.questions.length) {
    document.getElementById('submit-btn').style.display = 'block';
  }
}

// Function to submit the quiz and calculate the score
function submitQuiz() {
  let score = 0;
  const resultsDiv = document.getElementById('results');

  // Loop through all the questions and check answers
  quizData.questions.forEach((q, index) => {
    const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);

    if (selectedOption && selectedOption.value === q.options[q.correct_answer]) {
      score++;
    }
  });

  resultsDiv.textContent = `You scored ${score} out of ${quizData.questions.length}`;
}

// Load the quiz data when the page loads
window.onload = loadQuizData;
