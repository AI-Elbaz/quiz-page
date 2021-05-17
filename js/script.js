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

function init() {
    sentence.innerText = currentQuestion['sentence'];

    for (let i = 0; i < currentQuestion['choices'].length + 1; i++) {
        let slot = document.createElement('div');
        slot.className = 'slot';
        answerContainer.appendChild(slot);

        slot = slot.cloneNode(true);
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

interact('.choice').draggable({
    listeners: {
        move: dragMoveListener,
    }
});

function dragMoveListener (event) {
    var target = event.target

    if (target.dataset.sticked == "false") {
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    
        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    
        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
    }
}

interact('.slot').dropzone({
    accept: '.choice',
    overlap: 0.5,

    ondrop: (event) => {
        console.log('dragged');
        
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