const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const rankValues = { 'A': 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

let deck = [];
let tableCards = [];
let selectedCards = [];
let score = 0;
let round = 1;
let hasValidated = false;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawTableCards() {
    createDeck();
    shuffle(deck);
    tableCards = deck.splice(0, 5);
    selectedCards = [];
    hasValidated = false;
    renderTableCards();
    renderAllCards();
    document.getElementById('answerSection').style.display = 'none';
}

function renderTableCards() {
    const container = document.getElementById('tableCards');
    container.innerHTML = '';
    tableCards.forEach(card => {
        const cardEl = createCardElement(card, false);
        container.appendChild(cardEl);
    });
}

function createCardElement(card, small = false, clickable = false) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${small ? 'small' : ''} ${['♥', '♦'].includes(card.suit) ? 'red' : 'black'}`;

    const isOnTable = tableCards.some(tc => tc.rank === card.rank && tc.suit === card.suit);
    if (isOnTable && clickable) {
        cardEl.classList.add('disabled');
    }

    cardEl.innerHTML = `
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${card.suit}</div>
            `;

    if (clickable && !isOnTable) {
        cardEl.addEventListener('click', () => selectCard(card, cardEl));
    }

    return cardEl;
}

function renderAllCards() {
    const container = document.getElementById('allCards');
    container.innerHTML = '';
    createDeck();
    deck.forEach(card => {
        const cardEl = createCardElement(card, true, true);
        container.appendChild(cardEl);
    });
}

function selectCard(card, cardEl) {
    const cardIndex = selectedCards.findIndex(c => c.rank === card.rank && c.suit === card.suit);

    if (cardIndex > -1) {
        selectedCards.splice(cardIndex, 1);
        cardEl.classList.remove('selected');
    } else if (selectedCards.length < 2) {
        selectedCards.push(card);
        cardEl.classList.add('selected');
    }

    document.getElementById('validateBtn').disabled = selectedCards.length !== 2;
}

function evaluateHand(cards) {
    // On cherche la meilleure combinaison de 5 cartes parmi les 7
    const combinations = getCombinations(cards, 5);
    let best = { score: 0, name: "Carte Haute", rankOrder: [] };

    for (const combo of combinations) {
        const result = evaluate5Cards(combo);
        if (
            result.score > best.score ||
            (result.score === best.score && compareRankOrder(result.rankOrder, best.rankOrder) > 0)
        ) {
            best = result;
        }
    }

    return best;
}

// Évalue une main de 5 cartes précisément
function evaluate5Cards(cards) {
    const ranks = cards.map(c => c.rank);
    const suits = cards.map(c => c.suit);
    const values = cards.map(c => rankValues[c.rank]).sort((a, b) => b - a);

    const rankCounts = {};
    for (let r of ranks) rankCounts[r] = (rankCounts[r] || 0) + 1;
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const uniqueVals = [...new Set(values)];

    const suitCounts = {};
    for (let s of suits) suitCounts[s] = (suitCounts[s] || 0) + 1;
    const isFlush = Object.values(suitCounts).some(c => c === 5);
    const flushSuit = Object.keys(suitCounts).find(s => suitCounts[s] === 5);
    const flushVals = flushSuit ? cards.filter(c => c.suit === flushSuit).map(c => rankValues[c.rank]).sort((a, b) => b - a) : [];

    // Suite (straight)
    let straightHigh = getStraightHigh(uniqueVals);
    const isStraight = !!straightHigh;

    // Quinte flush ?
    let isStraightFlush = false;
    let straightFlushHigh = null;
    if (isFlush) {
        const flushUnique = [...new Set(flushVals)];
        straightFlushHigh = getStraightHigh(flushUnique);
        if (straightFlushHigh) isStraightFlush = true;
    }

    // Hiérarchie
    if (isStraightFlush) return { score: 9, name: 'Quinte Flush', rankOrder: [straightFlushHigh] };
    if (counts[0] === 4) return { score: 8, name: 'Carré', rankOrder: getRankOrder(rankCounts) };
    if (counts[0] === 3 && counts[1] === 2) return { score: 7, name: 'Full', rankOrder: getRankOrder(rankCounts) };
    if (isFlush) return { score: 6, name: 'Couleur', rankOrder: flushVals };
    if (isStraight) return { score: 5, name: 'Suite', rankOrder: [straightHigh] };
    if (counts[0] === 3) return { score: 4, name: 'Brelan', rankOrder: getRankOrder(rankCounts) };
    if (counts[0] === 2 && counts[1] === 2) return { score: 3, name: 'Double Paire', rankOrder: getRankOrder(rankCounts) };
    if (counts[0] === 2) return { score: 2, name: 'Paire', rankOrder: getRankOrder(rankCounts) };
    return { score: 1, name: 'Carte Haute', rankOrder: values };
}

// Trouve la carte la plus haute d’une suite (ou null)
function getStraightHigh(vals) {
    if (vals.length < 5) return null;
    for (let i = 0; i <= vals.length - 5; i++) {
        if (vals[i] - vals[i + 4] === 4) return vals[i];
    }
    // Cas A-2-3-4-5
    if (vals.includes(14) && vals.includes(5) && vals.includes(4) && vals.includes(3) && vals.includes(2))
        return 5;
    return null;
}

// Génère les combinaisons de n cartes parmi un set
function getCombinations(arr, n) {
    if (n === 0) return [[]];
    if (arr.length < n) return [];
    if (arr.length === n) return [arr];
    const [first, ...rest] = arr;
    const withFirst = getCombinations(rest, n - 1).map(c => [first, ...c]);
    const withoutFirst = getCombinations(rest, n);
    return withFirst.concat(withoutFirst);
}

// Génère un ordre de tri basé sur le comptage des cartes
function getRankOrder(rankCounts) {
    return Object.entries(rankCounts)
        .sort((a, b) => b[1] - a[1] || rankValues[b[0]] - rankValues[a[0]])
        .map(([r]) => rankValues[r]);
}

// Compare deux listes de valeurs décroissantes
function compareRankOrder(a, b) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0);
    }
    return 0;
}

function getAllPossibleHands() {
    const remainingDeck = [];
    createDeck();
    deck.forEach(card => {
        const isOnTable = tableCards.some(tc => tc.rank === card.rank && tc.suit === card.suit);
        if (!isOnTable) remainingDeck.push(card);
    });

    const hands = [];
    for (let i = 0; i < remainingDeck.length; i++) {
        for (let j = i + 1; j < remainingDeck.length; j++) {
            const hand = [...tableCards, remainingDeck[i], remainingDeck[j]];
            const evaluation = evaluateHand(hand);
            hands.push({
                cards: [remainingDeck[i], remainingDeck[j]],
                evaluation
            });
        }
    }

    // Tri par force réelle, sans distinction de couleur
    hands.sort((a, b) => {
        if (b.evaluation.score !== a.evaluation.score) {
            return b.evaluation.score - a.evaluation.score;
        }
        return compareRankOrder(b.evaluation.rankOrder, a.evaluation.rankOrder);
    });

    // Supprimer les mains identiques en force (ex: 6♥7♥ et 6♣7♣)
    const uniqueHands = [];
    const seen = new Set();
    for (const h of hands) {
        const key = `${h.evaluation.score}-${h.evaluation.rankOrder.join('-')}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueHands.push(h);
        }
    }

    return uniqueHands;
}

function validateHand() {
    if (selectedCards.length !== 2) return;
    if (hasValidated) return;
    hasValidated = true;

    const playerHand = [...tableCards, ...selectedCards];
    const playerEval = evaluateHand(playerHand);
    const allHands = getAllPossibleHands();

    // Recherche plus fiable du rang du joueur
    const playerKey = `${playerEval.score}-${playerEval.rankOrder.join('-')}`;
    const playerRank = allHands.findIndex(h =>
        `${h.evaluation.score}-${h.evaluation.rankOrder.join('-')}` === playerKey
    ) + 1;

    let points = 0;
    let message = '';

    if (playerRank === 1) {
        points = 3;
        message = `🏆 Parfait ! Meilleure main : ${playerEval.name} (+3 points)`;
    } else if (playerRank > 0 && playerRank <= 3) {
        points = 1;
        message = `✅ Bien ! ${playerEval.name} - Rang ${playerRank}/Top 3 (+1 point)`;
    } else if (playerRank > 0) {
        message = `❌ ${playerEval.name} - Rang ${playerRank}. Pas dans le top 3.`;
    } else {
        message = `⚠️ ${playerEval.name} - Rang inconnu (erreur de détection).`;
    }

    score += points;
    document.getElementById('score').textContent = score;
    document.getElementById('resultDisplay').textContent = message;

    document.getElementById('validateBtn').disabled = true;
    document.getElementById('answerSection').style.display = 'block';
    const topHandsContainer = document.getElementById('topHands');
    topHandsContainer.innerHTML = '';

    const topHands = allHands.slice(0, 3);
    topHands.forEach((handInfo, index) => {
        const handDiv = document.createElement('div');
        handDiv.style.marginBottom = '15px';
        const handTitle = document.createElement('h4');
        handTitle.textContent = `#${index + 1} : ${handInfo.evaluation.name}`;
        handDiv.appendChild(handTitle);
        handInfo.cards.forEach(card => {
            const cardEl = createCardElement(card, false);
            handDiv.appendChild(cardEl);
        });
        topHandsContainer.appendChild(handDiv);
        handDiv.style.display = 'flex';
        handDiv.style.gap = '10px';
    });

    document.getElementById('validateBtn').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
}

function startGame() {
    drawTableCards();
    score = 0;
    round = 1;
    document.getElementById('score').textContent = score;
    document.getElementById('round').textContent = round;
    document.getElementById('resultDisplay').textContent = 'Sélectionnez 2 cartes pour former votre main';
    document.getElementById('startGameContainer').style.display = 'none';
}

function resetGame() {
    score = 0;
    round = 1;
    document.getElementById('score').textContent = score;
    document.getElementById('round').textContent = round;
    drawTableCards();
    document.getElementById('resultDisplay').textContent = 'Sélectionnez 2 cartes pour former votre main';
}

function nextRound() {
    round++;
    document.getElementById('round').textContent = round;
    drawTableCards();
    document.getElementById('resultDisplay').textContent = 'Sélectionnez 2 cartes pour former votre main';
    document.getElementById('validateBtn').disabled = true;
    document.getElementById('validateBtn').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
}