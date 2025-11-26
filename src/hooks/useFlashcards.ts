"use client";

import { useContext } from 'react';
import { FlashcardContext } from '@/context/FlashcardContext';

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};
