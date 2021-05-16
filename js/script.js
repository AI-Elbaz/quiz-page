var questions = [
    {
        'sentence': 'She is eating an apple and they are eating bread',
        'answer': 'sie isst einen apfel und sie essen brot',
        'choices': [
            'esst', 'brot', 'essen', 'apfel', 'sie', 'und', 'sie', 'isst', 'einen', 'sie'
        ]
    }
]

var sentence = document.getElementById('sentence'),
    answerContainer = document.querySelector('.answer-container'),
    choicesContainer = document.querySelector('.choices-container'),
    checkBtn = document.getElementById('check'),
    msg = document.getElementById('msg'),
    currentQuestion = questions[0];

function init() {
    sentence.innerHTML = currentQuestion['sentence']
    currentQuestion['choices'].forEach((choice) => {
        element = document.createElement('span');
        element.className = 'choice';
        element.innerHTML = choice;
        choicesContainer.appendChild(element);
    });
}

init();

var choices = document.querySelectorAll('.choice');

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        choice.parentElement == choicesContainer ? _moveTo(answerContainer, choice) : _moveTo(choicesContainer, choice)
    });
});

function _moveTo(dest, element) {
    let nextPos = getNextPosition(element, dest);

    element.style.transform = `translate(${nextPos[0]}px, ${nextPos[1]}px)`;

    setTimeout(() => {
        dest.appendChild(element);
        element.style.transform =  "";
    }, 500);
}

function getNextPosition(element, parent) {
    let newElement = element.cloneNode(true)
    newElement.style.opacity = '0';
    parent.appendChild(newElement);

    let pos = [
        newElement.offsetLeft - element.offsetLeft,
        newElement.offsetTop - element.offsetTop
    ];
    parent.removeChild(newElement);

    return pos;
}

checkBtn.addEventListener('click', (e) => {
    let userAnswer = [];
    let answers = answerContainer.querySelectorAll('.choice');

    answers.forEach(element => {
        userAnswer.push(element.innerText);
    });

    msg.style.opacity = '1';

    if (userAnswer.join(' ') == currentQuestion['answer']) {
        msg.innerText = 'Good work!';
        msg.classList.add('success');
    } else {
        msg.innerText = 'Something wrong!';
        msg.classList.remove('success');
    }
});