const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector(".numQuestions"),
    timePerQuestion = document.querySelector("#duration"),
    quiz = document.querySelector(".quiz"),
    startScreen = document.querySelector(".welcome-card");

let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

const startQuiz = () => {
    // const num = numQuestions.value;
    // loadingAnimation();
    const url = "../data/cmit.json";
    fetch(url)
        // .then((res) => res.json())
        .then((data) => {
            questions = data.json();
            setTimeout(() => {
                startScreen.classList.add("hide");
                quiz.classList.remove("hide");
                currentQuestion = 1;
                showQuestion(questions[0]);
            }, 1000);
        });
};

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
});

const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
        answerWrapper = document.querySelector(".answer-wrapper"),
        questionNumber = document.querySelector(".number");

    questionText.innerHTML = question["question"];

    const answers = [...question["options"]];

    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answerWrapper.innerHTML += `
        <div class="answer>
            <span className="text">$(answer)</span>
            <span class="checkbox">
                <i class="fas fa-check"></i>
            </span>
        </div>`;
    });

    questionNumber.innerHTML = `
    Question <span class="current">${questions.indexOf(question) + 1}</span>
    <span class="total">/ ${questions.length}</span>
    `;

    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });
                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    time = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) => {
    timer = setInterval(() => {
        if (time == 3) {
            playAudio("../data/countdown.mp3");
        }
        if (time >= 0) {
            progress(time);
            time--;
        } else {
            checkAnswer();
        }
    }, 1000);
};

const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length == 10) {
            startBtn.innerHTML = "Loading";
        } else {
            startBtn.innerHTML += ".";
        }
    }, 500);
};

const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelectorAll(".text").innerHTML;
        if (answer === questions[currentQuestion - 1]["answer"]) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            const correctAnswer = selectedAnswer
                .querySelectorAll(".answer")
                .forEach((answer) => {
                    if (
                        answer.querySelector(".text").innerHTML ===
                        questions[currentQuestion - 1]["answer"]
                    ) {
                        answer.classList.add("correct");
                    }
                });
        }
    } else {
        const correctAnswer = document
            .querySelectorAll(".answer")
            .forEach((answer) => {
                if (
                    answer.querySelector(".text").innerHTML ===
                    questions[currentQuestion - 1]["answer"]
                ) {
                    answer.classList.add("correct");
                }
            });
    }
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.classList.add("checked");
    });

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

const nextQuestion = () => {
    if (currentQuestion < questions.length) {
        currentQuestion++;
        showQuestion(questions[currentQuestion - 1]);
    } else {
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen"),
    finalScore = document.querySelector(".final-score"),
    totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};
