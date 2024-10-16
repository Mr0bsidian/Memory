document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const attemptsElement = document.getElementById('attempts');
    const matchesElement = document.getElementById('matches');
    const restartButton = document.getElementById('restart-button');
    let attempts = 0;
    let matches = 0;

    const imageSources = [
        'p01.jpg', 'p02.jpg', 'p03.jpg', 'p04.jpg', 'p05.jpg', 
        'p06.jpg', 'p07.jpg', 'p08.jpg', 'p09.jpg', 'p10.jpg',
        'p11.jpg', 'p12.jpg', 'p13.jpg', 'p14.jpg', 'p15.jpg',
        'p16.jpg', 'p17.jpg', 'p18.jpg'
    ];

    let cardDeck = [...imageSources, ...imageSources]; 
    cardDeck = shuffle(cardDeck);

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    let pairsData = [];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        board.innerHTML = ''; 
        cardDeck.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;
            card.dataset.index = index; 

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.style.backgroundImage = `url('images/${image}')`;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
            matches++;
            matchesElement.textContent = matches;
            
            if (matches === imageSources.length) {
                setTimeout(() => alert('Glückwunsch! Du hast das Spiel beendet!'), 1000);
            }
        } else {
            unflipCards();
        }
    }

    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
        attempts++;
        attemptsElement.textContent = attempts;
    }

    function restartGame() {
        cardDeck = shuffle([...imageSources, ...imageSources]);
        attempts = 0;
        matches = 0;
        pairsData = [];
        attemptsElement.textContent = attempts;
        matchesElement.textContent = matches;
        createBoard();
    }
    
    
    restartButton.addEventListener('click', restartGame);

    createBoard();
});
