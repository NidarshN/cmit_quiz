const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#numQuestions"),
    timePerQuestion = document.querySelector("#duration"),
    quiz = document.querySelector(".quiz"),
    startScreen = document.querySelector(".welcome-card");

let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer,
    num;

const shuffler = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const shuffleData = (obj) => {
    const shuffledData = {}
    indices = Object.keys(obj)
    shuffler(indices)
    for(let i = 0; i < indices.length; i++){
        shuffledData[indices[i]] = obj[i.toString()]
    }
    return shuffledData
};

const startQuiz = () => {
    num = numQuestions.value;

    loadingAnimation();
    const url =
        "https://raw.githubusercontent.com/NidarshN/cmit_quiz/main/data/cmit.json";
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = shuffleData(data);
            console.log(questions);
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

    answerWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answerWrapper.innerHTML += `
        <div class="answer">
            <span class="text">${answer}</span>
            <span class="checkbox">
                <i class="fas fa-check"></i>
            </span>
        </div>`;
    });

    questionNumber.innerHTML = `
    Question <span class="current">${currentQuestion}</span>
    <span class="total">/ ${num}</span>
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
            playAudio(
                "https://github.com/NidarshN/cmit_quiz/raw/main/data/countdown.mp3"
            );
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
        const answer = selectedAnswer.querySelector(".text").innerText;

        if (answer == questions[currentQuestion - 1]["answer"]) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            const correctAnswer = selectedAnswer
                .querySelectorAll(".answer")
                .forEach((answer) => {
                    if (
                        answer.querySelector(".text").innerText ==
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
                    answer.querySelector(".text").innerText ==
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
    if (currentQuestion < num) {
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
    totalScore.innerHTML = `/ ${num}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};
