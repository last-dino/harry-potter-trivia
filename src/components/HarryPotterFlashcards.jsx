import React, { useState, useEffect } from 'react';
import './HarryPotterFlashcards.css';
import cardData from '../data/cardData';

const HarryPotterFlashcards = () => {
  const [allCards, setAllCards] = useState(cardData);
  const [activeCards, setActiveCards] = useState(cardData);
  const [masteredCards, setMasteredCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showMasteredCards, setShowMasteredCards] = useState(false);

  useEffect(() => {
    // Reset the current card index if we've removed the current card
    if (currentCardIndex >= activeCards.length && activeCards.length > 0) {
      setCurrentCardIndex(activeCards.length - 1);
    }
  }, [activeCards, currentCardIndex]);

  // NEW: Check that we're using the correct array based on current view
  useEffect(() => {
    // Reset index when switching between active and mastered views
    setCurrentCardIndex(0);
    resetCard();
  }, [showMasteredCards]);

  const shuffleCards = () => {
    const shuffled = [...activeCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setActiveCards(shuffled);
    setCurrentCardIndex(0);
    resetCard();
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const goToNextCard = () => {
    // FIX: Check which card set we're viewing and handle accordingly
    const currentCards = showMasteredCards ? masteredCards : activeCards;
    if (currentCards.length === 0) return;
    
    const nextIndex = (currentCardIndex + 1) % currentCards.length;
    setCurrentCardIndex(nextIndex);
    resetCard();
  };

  const goToPreviousCard = () => {
    // FIX: Check which card set we're viewing and handle accordingly
    const currentCards = showMasteredCards ? masteredCards : activeCards;
    if (currentCards.length === 0) return;
    
    const previousIndex = (currentCardIndex - 1 + currentCards.length) % currentCards.length;
    setCurrentCardIndex(previousIndex);
    resetCard();
  };

  const resetCard = () => {
    setIsFlipped(false);
    setUserAnswer('');
    setIsCorrect(null);
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  // Function to check if strings are similar
  const stringSimilarity = (str1, str2) => {
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    
    // Exact match
    if (str1 === str2) return true;
    
    // Remove punctuation and check again
    const normalize = s => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
    if (normalize(str1) === normalize(str2)) return true;
    
    // Simple fuzzy matching - if one is contained in the other
    if (str1.includes(str2) || str2.includes(str1)) return true;
    
    // Check for small typos (if strings are similar length and only have a few different characters)
    if (Math.abs(str1.length - str2.length) <= 2) {
      let differences = 0;
      for (let i = 0, j = 0; i < str1.length && j < str2.length; i++, j++) {
        if (str1[i] !== str2[j]) {
          differences++;
          if (str1[i+1] === str2[j]) i++;
          else if (str1[i] === str2[j+1]) j++;
        }
        if (differences > 2) return false;
      }
      return true;
    }
    
    return false;
  };

  const checkAnswer = () => {
    if (activeCards.length === 0) return;
    
    const correctAnswer = activeCards[currentCardIndex].answer;
    const isAnswerCorrect = stringSimilarity(userAnswer, correctAnswer);
    
    setIsCorrect(isAnswerCorrect);
    setIsFlipped(true);
    
    // Update streak
    if (isAnswerCorrect) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
    } else {
      setCurrentStreak(0);
    }
  };

  const markAsMastered = () => {
    if (activeCards.length === 0) return;
    
    const currentCard = activeCards[currentCardIndex];
    const newMasteredCards = [...masteredCards, currentCard];
    const newActiveCards = activeCards.filter((_, index) => index !== currentCardIndex);
    
    setMasteredCards(newMasteredCards);
    setActiveCards(newActiveCards);
    
    if (newActiveCards.length === 0) {
      setIsFlipped(false);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      const newIndex = currentCardIndex >= newActiveCards.length ? 0 : currentCardIndex;
      setCurrentCardIndex(newIndex);
      resetCard();
    }
  };

  const toggleMasteredCardsView = () => {
    setShowMasteredCards(!showMasteredCards);
    resetCard();
    setCurrentCardIndex(0);
  };

  const restoreAllCards = () => {
    setActiveCards(allCards);
    setMasteredCards([]);
    setCurrentCardIndex(0);
    resetCard();
    setShowMasteredCards(false);
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

  const getResultClass = () => {
    if (isCorrect === null) return '';
    return isCorrect ? 'correct-answer' : 'wrong-answer';
  };

  const displayCards = showMasteredCards ? masteredCards : activeCards;
  const currentCard = displayCards.length > 0 ? displayCards[currentCardIndex] : null;

  return (
    <div className="flashcard-app">
      <div className="flashcard-container">
        <h1 className="app-title">Harry Potter Trivia</h1>
        <p className="app-description">Test your knowledge of the wizarding world!</p>
        
        <div className="stats-container">
          <div className="card-stats">
            <span>Active Cards: {activeCards.length}</span>
            <span>Mastered Cards: {masteredCards.length}</span>
          </div>
          <div className="streak-stats">
            <span>Current Streak: {currentStreak}</span>
            <span>Longest Streak: {longestStreak}</span>
          </div>
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-button ${!showMasteredCards ? 'active' : ''}`} 
            onClick={() => !showMasteredCards ? null : toggleMasteredCardsView()}
          >
            Study Cards
          </button>
          <button 
            className={`toggle-button ${showMasteredCards ? 'active' : ''}`}
            onClick={() => showMasteredCards ? null : toggleMasteredCardsView()}
            disabled={masteredCards.length === 0}
          >
            Mastered Cards ({masteredCards.length})
          </button>
        </div>
        
        {displayCards.length > 0 ? (
          <>
            <p className="card-count">Card {currentCardIndex + 1} of {displayCards.length}</p>
            
            <div className={`flashcard ${getResultClass()}`}>
              <div 
                className={`card-face card-front ${isFlipped ? 'hidden' : ''}`}
                onClick={handleCardFlip}
              >
                <div className="card-content">
                  <h2 className="card-question">{currentCard.question}</h2>
                </div>
              </div>
              
              <div 
                className={`card-face card-back ${getCategoryClass(currentCard.category)} ${isFlipped ? '' : 'hidden'}`} 
                style={{ backgroundImage: `url(${currentCard.answerImage})` }}
                onClick={handleCardFlip}
              >
                <div className="card-content">
                  <h2 className="card-answer">{currentCard.answer}</h2>
                  {isCorrect !== null && (
                    <p className="feedback-text">
                      {isCorrect ? "Correct! Well done!" : "Incorrect. Try again!"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!showMasteredCards && (
              <div className="answer-input-container">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={handleInputChange}
                  placeholder="Enter your answer"
                  disabled={isFlipped}
                  className="answer-input"
                />
                <button 
                  className="submit-button"
                  onClick={checkAnswer}
                  disabled={isFlipped || !userAnswer.trim()}
                >
                  Submit
                </button>
              </div>
            )}
            
            <div className="button-container">
              <button 
                className="nav-button prev-button"
                onClick={goToPreviousCard}
              >
                &larr; Prev
              </button>
              
              <button 
                className="nav-button shuffle-button"
                onClick={shuffleCards}
                disabled={displayCards.length < 2 || showMasteredCards}
              >
                Shuffle
              </button>
              
              {isFlipped && !showMasteredCards && (
                <button 
                  className="nav-button mastered-button"
                  onClick={markAsMastered}
                >
                  Mark Mastered
                </button>
              )}
              
              <button 
                className="nav-button next-button"
                onClick={goToNextCard}
              >
                Next &rarr;
              </button>
            </div>
            
            {masteredCards.length > 0 && (
              <button 
                className="restore-button"
                onClick={restoreAllCards}
              >
                Restore All Cards
              </button>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>You've mastered all the cards!</p>
            <button 
              className="restore-button"
              onClick={restoreAllCards}
            >
              Restore All Cards
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarryPotterFlashcards;