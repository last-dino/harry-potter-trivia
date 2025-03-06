import React, { useState } from 'react';
import './HarryPotterFlashcards.css';
import cardData from '../data/cardData';

const HarryPotterFlashcards = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cards = cardData; 

  
  const getRandomCard = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * cards.length);
    } while (newIndex === currentCardIndex && cards.length > 1);
    
    setCurrentCardIndex(newIndex);
    setIsFlipped(false);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'easy':
        return 'easy-card';
      case 'medium':
        return 'medium-card';
      case 'hard':
        return 'hard-card';
      default:
        return '';
    }
  };

  return (
    <div className="flashcard-app">
      <div className="flashcard-container">
        <h1 className="app-title">Harry Potter Trivia</h1>
        <p className="app-description">Test your knowledge of the wizarding world!</p>
        <p className="card-count">Total cards: {cards.length}</p>
        
        <div 
          className="flashcard"
          onClick={handleCardFlip}
        >
          <div className={`card-face card-front ${isFlipped ? 'hidden' : ''}`}>
            <div className="card-content">
              <h2 className="card-question">{cards[currentCardIndex].question}</h2>
            </div>
          </div>
          
          <div className={`card-face card-back ${getCategoryClass(cards[currentCardIndex].category)} ${isFlipped ? '' : 'hidden'}`} style={{ backgroundImage: `url(${cards[currentCardIndex].answerImage})` }}>
            <div className="card-content">
              <h2 className="card-answer">{cards[currentCardIndex].answer}</h2>
            </div>
          </div>
        </div>
        
        <div className="button-container">
          <button 
            className="next-button"
            onClick={getRandomCard}
          >
            &rarr;
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default HarryPotterFlashcards;