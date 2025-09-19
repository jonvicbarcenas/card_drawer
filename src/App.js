import { useState, useEffect } from 'react';
import './App.css';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const CARD_VALUES = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
};

const createDeck = () => {
  const deck = [];
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value, numValue: CARD_VALUES[value] });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Card = ({ card }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  return (
    <div className={`card ${isRed ? 'red' : 'black'}`}>
      <div className="card-top">
        <span className="card-value">{card.value}</span>
        <span className="card-suit">{card.suit}</span>
      </div>
      <div className="card-center">
        <span className="card-suit-large">{card.suit}</span>
      </div>
      <div className="card-bottom">
        <span className="card-value">{card.value}</span>
        <span className="card-suit">{card.suit}</span>
      </div>
    </div>
  );
};

const Player = ({ playerNumber, cards, score }) => {
  return (
    <div className="player">
      <div className="player-cards">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <div className="player-info">
        <h3>Player {playerNumber}: {score}</h3>
      </div>
    </div>
  );
};

function App() {
  const [deck, setDeck] = useState([]);
  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
  }, []);

  const calculateScore = (cards) => {
    if (cards.length === 0) return 0;

    const valueCounts = {};
    cards.forEach(card => {
      valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });

    let pairBonus = 0;
    Object.values(valueCounts).forEach(count => {
      if (count === 2) pairBonus += 2;
      if (count === 3) pairBonus += 5;
    });

    const highestCard = Math.max(...cards.map(card => card.numValue));

    return highestCard + pairBonus;
  };

  const drawCards = () => {
    if (deck.length < 6) {
      alert('Not enough cards left in deck!');
      return;
    }

    const newDeck = [...deck];
    
    const p1Cards = newDeck.splice(0, 3);
    const p2Cards = newDeck.splice(0, 3);

    setPlayer1Cards(p1Cards);
    setPlayer2Cards(p2Cards);
    setDeck(newDeck);

    const p1Score = calculateScore(p1Cards);
    const p2Score = calculateScore(p2Cards);

    if (p1Score > p2Score) {
      setPlayer1Score(prev => prev + 1);
    } else if (p2Score > p1Score) {
      setPlayer2Score(prev => prev + 1);
    }

    setGameStarted(true);
  };

  const resetGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayer1Cards([]);
    setPlayer2Cards([]);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setGameStarted(false);
  };

  return (
    <div className="App">
      <div className="game-container">
        <h1>Three Cards</h1>
        
        <div className="players-container">
          <Player 
            playerNumber={1} 
            cards={player1Cards} 
            score={player1Score} 
          />
          <Player 
            playerNumber={2} 
            cards={player2Cards} 
            score={player2Score} 
          />
        </div>

        <div className="game-controls">
          <button 
            className="draw-button" 
            onClick={drawCards}
            disabled={deck.length < 6}
          >
            DRAW CARDS
          </button>
          <button 
            className="reset-button" 
            onClick={resetGame}
          >
            RESET GAME
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
