const questions = [
    {
        'sentence': 'She is eating an apple and they are eating bread',
        'answer': 'sie isst einen apfel und sie essen brot',
        'choices': [
            'esse', 'esst', 'brot', 'essen', 'apfel', 'sie', 'und', 'sie', 'isst', 'einen', 'sie'
        ]
    }
];

const currentQuestion = questions[0];
let choicesContainer = document.querySelector('.choices');
let answerContainer = document.querySelector('.answer-container');
let sentence = document.getElementById('sentence')
let checkBtn = document.getElementById('check');
let msg = document.getElementById('msg');
let choices;
let choicesSlots = [];
let mouseInAnswers = false;

sentence.innerText = currentQuestion['sentence'];

for (let i = 0; i < currentQuestion['choices'].length + 1; i++) {
    let slot = createElement('div', {
        'class': 'slot',
        'data-id': i
    });

    choicesContainer.appendChild(slot);
    choicesSlots.push(slot);
}

for (let i = 0; i < currentQuestion['choices'].length; i++) {
    const slot = choicesSlots[i];

    let choice = createElement('span', {
        'class': 'choice',
        'data-id': slot.dataset.id,
        'data-x': 0,
        'data-y': 0,
        'data-sticked': false
    });

    choice.innerText = currentQuestion['choices'][i];
    slot.appendChild(choice);

    choice.addEventListener('mousedown', () => {
        choice.dataset.sticked = false;
    });
}
// 
choices = choicesContainer.querySelectorAll('.choice');

let draggability = interact('.choice').draggable({
    listeners: {
        move: dragMoveListener,
        end: drageEndListener,
    }
});

function dragMoveListener(event) {
    let target = event.target

    if (target.dataset.sticked == "false") {
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
    }
}

function drageEndListener(event) {
    if (event.target.dataset.sticked == "false") {
        if (!mouseInAnswers) {
            _moveTo(event.target);
        }
    }
}

interact('.slot').dropzone({
    accept: '.choice',
    overlap: 0.5,

    ondrop: (event) => {
        let slot = event.target;
        let choice = event.relatedTarget;

        if (!slot.hasChildNodes()) {
            reset(choice)
            slot.appendChild(choice);
            choice.dataset.sticked = true;
        }

        answerContainer.querySelectorAll('.slot:empty').forEach(e => e.remove());
    }
});

interact('.answer-container').dropzone({
    ondrop: (event) => {
        mouseInAnswers = true;

        let slots = answerContainer.querySelectorAll('.slot:empty');
        let slot;

        if (event.relatedTarget.parentElement.parentElement != answerContainer) {
            if (slots.length == 0) {
                slot = createElement('div', {'class':'slot'});
                event.target.appendChild(slot);
            }
    
            else {
                slot = slots[0]
            }
        }

        _moveTo(event.relatedTarget, slot);
    },
    ondragleave: () => mouseInAnswers = false,
});

answerContainer.onmouseleave = () => mouseInAnswers = false;

checkBtn.addEventListener('click', () => {
    let answers = answerContainer.querySelectorAll('.choice');
    let answer = [];

    answers.forEach((e) => answer.push(e.innerText));

    if (answer.join(" ") == currentQuestion['answer']) {
        msg.innerText = "Good work!";
        msg.classList.add('success');

    } else {
        msg.innerText = "Something wrong!";
        msg.classList.remove('success');
    }

    msg.style.opacity = "1";
});

function _moveTo(element, dest=null) {
    let id = element.dataset.id;

    if (dest == null) {
        dest = document.querySelector(`.slot[data-id="${id}"]`);
        if (dest.hasChildNodes()) {
            dest = element.parentElement;
        }
    }

    let x = dest.offsetLeft - element.offsetLeft;
    let y = dest.offsetTop - element.offsetTop;

    console.log(x, y);

    element.style.transition = '0.5s';
    element.style.transform = `translate(${x}px, ${y}px)`;

    element.ontransitionend = () => {
        element.dataset.sticked = true;
        dest.appendChild(element);
        reset(element);
    }
}

function reset(element) {
    element.dataset.x = 0;
    element.dataset.y = 0;
    element.style.transform = "none";
    element.style.transition = "none";
}

function createElement(tag, attributes={}) {
    let element = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    return element;
}