import type { Deck, Card } from './types';

export const initialDecks: Deck[] = [
  {
    id: '1',
    name: 'Spanish Vocabulary',
    description: 'Basic Spanish words for beginners.',
  },
  {
    id: '2',
    name: 'JavaScript Fundamentals',
    description: 'Core concepts of JavaScript programming.',
  },
  {
    id: '3',
    name: 'World Capitals',
    description: 'Test your geography knowledge.',
  }
];

export const initialCards: Card[] = [
  // Spanish Deck
  { id: '1-1', deckId: '1', front: 'Hola', back: 'Hello', known: false },
  { id: '1-2', deckId: '1', front: 'Adiós', back: 'Goodbye', known: false },
  { id: '1-3', deckId: '1', front: 'Gracias', back: 'Thank you', known: false },
  { id: '1-4', deckId: '1', front: 'Por favor', back: 'Please', known: false },
  { id: '1-5', deckId: '1', front: 'Sí', back: 'Yes', known: false },
  { id: '1-6', deckId: '1', front: 'No', back: 'No', known: false },

  // JavaScript Deck
  { id: '2-1', deckId: '2', front: 'What is a closure?', back: 'A function that remembers its outer variables and can access them.', known: false },
  { id: '2-2', deckId: '2', front: 'What does `const` do?', back: 'Declares a block-scoped variable whose value cannot be reassigned.', known: false },
  { id: '2-3', deckId: '2', front: '`==` vs `===`?', back: '`==` performs type coercion, `===` checks for value and type equality.', known: false },
  { id: '2-4', deckId: '2', front: 'What is hoisting?', back: 'JavaScript\'s default behavior of moving declarations to the top.', known: false },

  // World Capitals
  { id: '3-1', deckId: '3', front: 'Japan', back: 'Tokyo', known: false },
  { id: '3-2', deckId: '3', front: 'Canada', back: 'Ottawa', known: false },
  { id: '3-3', deckId: '3', front: 'Australia', back: 'Canberra', known: false },
  { id: '3-4', deckId: '3', front: 'Egypt', back: 'Cairo', known: false },
];
