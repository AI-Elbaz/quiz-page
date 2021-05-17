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

var sentence = document.getElementById('sentence')
var choicesContainer = document.querySelector('.choices');
var answerContainer = document.querySelector('.answer-container');
var choicesSlots;
var choices;

var mouseInAnswers = false;

function init() {
    sentence.innerText = currentQuestion['sentence'];

    for (let i = 0; i < currentQuestion['choices'].length + 1; i++) {
        let slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.id = i;
        choicesContainer.appendChild(slot);
    }

    choicesSlots = document.querySelectorAll('.choices .slot');

    for (let i = 0; i < currentQuestion['choices'].length; i++) {
        const slot = choicesSlots[i];

        let choice = document.createElement('span');
        choice.classList.add('choice');
        choice.dataset.id = slot.dataset.id;
        choice.dataset.y = 0;
        choice.dataset.x = 0;
        choice.dataset.sticked = false;
        choice.innerText = currentQuestion['choices'][i];
        slot.appendChild(choice);

        choice.addEventListener('mousedown', () => {
            choice.dataset.sticked = false;
        });
    }

    choices = document.querySelectorAll('.choices-container .choice');
}

init();

var draggability = interact('.choice').draggable({
    listeners: {
        move: dragMoveListener,
        end: drageEndListener,
    }
});

function dragMoveListener(event) {
    var target = event.target

    if (target.dataset.sticked == "false") {
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
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
            choice.dataset.x = 0;
            choice.dataset.y = 0;
            choice.style.transform = "";
            choice.dataset.sticked = true;
            slot.appendChild(choice);
        }
    }
});

interact('.answer-container').dropzone({
    ondrop: (event) => {
        mouseInAnswers = true;
        event.target.appendChild(event.relatedTarget);
    },
    ondragleave: () => mouseInAnswers = false,
});

answerContainer.onmouseleave = () => mouseInAnswers = false;

function _moveTo(element, dest=null) {
    let id = element.dataset.id;
    if (dest == null) {
        dest = document.querySelector(`.slot[data-id="${id}"]`);
        if (dest.hasChildNodes()) {
            dest = element.parentElement;
        }
    }

    let x = dest.offsetLeft - element.offsetLeft ;
    let y = dest.offsetTop - element.offsetTop;

    element.style.transition = "0.5s";
    element.style.transform = `translate(${x}px, ${y}px)`;

    element.ontransitionend = (e) => {
        dest.appendChild(element);
        element.dataset.x = 0;
        element.dataset.y = 0;
        element.style.transition = "none";
        element.style.transform = "";
    }
}

function createSlot() {
    let slot = document.createElement('div');
    slot.className = 'slot';
    return slot;
}