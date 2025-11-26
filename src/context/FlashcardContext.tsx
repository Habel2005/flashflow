"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { Deck, Card } from '@/lib/types';
import { initialDecks, initialCards } from '@/lib/data';

interface FlashcardContextType {
  decks: Deck[];
  cards: Card[];
  getDeckById: (id: string) => Deck | undefined;
  getCardsByDeckId: (deckId: string) => Card[];
  createDeck: (deck: Omit<Deck, 'id'>) => void;
  updateDeck: (deck: Deck) => void;
  deleteDeck: (deckId: string) => void;
  createCard: (card: Omit<Card, 'id' | 'known'>) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  updateCardStatus: (cardId: string, known: boolean) => void;
}

export const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedDecks = localStorage.getItem('flashflow-decks');
      const storedCards = localStorage.getItem('flashflow-cards');
      if (storedDecks && storedCards) {
        setDecks(JSON.parse(storedDecks));
        setCards(JSON.parse(storedCards));
      } else {
        setDecks(initialDecks);
        setCards(initialCards);
      }
    } catch (error) {
      console.error("Failed to load from local storage", error);
      setDecks(initialDecks);
      setCards(initialCards);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('flashflow-decks', JSON.stringify(decks));
        localStorage.setItem('flashflow-cards', JSON.stringify(cards));
      } catch (error) {
        console.error("Failed to save to local storage", error);
      }
    }
  }, [decks, cards, isLoaded]);

  const getDeckById = (id: string) => decks.find(d => d.id === id);
  const getCardsByDeckId = (deckId: string) => cards.filter(c => c.deckId === deckId);

  const createDeck = (deckData: Omit<Deck, 'id'>) => {
    const newDeck = { ...deckData, id: crypto.randomUUID() };
    setDecks(prev => [...prev, newDeck]);
  };

  const updateDeck = (updatedDeck: Deck) => {
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const deleteDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
    setCards(prev => prev.filter(c => c.deckId !== deckId));
  };

  const createCard = (cardData: Omit<Card, 'id' | 'known'>) => {
    const newCard = { ...cardData, id: crypto.randomUUID(), known: false };
    setCards(prev => [...prev, newCard]);
  };

  const updateCard = (updatedCard: Card) => {
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };
  
  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
  };

  const updateCardStatus = (cardId: string, known: boolean) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, known } : c));
  };

  const value = {
    decks,
    cards,
    getDeckById,
    getCardsByDeckId,
    createDeck,
    updateDeck,
    deleteDeck,
    createCard,
    updateCard,
    deleteCard,
    updateCardStatus,
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};