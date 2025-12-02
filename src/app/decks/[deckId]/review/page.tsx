"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, RefreshCw, X } from "lucide-react";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = Array.isArray(params.deckId) ? params.deckId[0] : params.deckId;
  
  const { getDeckById, getCardsByDeckId, updateCardStatus, cards: allCards } = useFlashcards();
  const deck = getDeckById(deckId);
  const allCardsInDeck = useMemo(() => getCardsByDeckId(deckId), [deckId, getCardsByDeckId, allCards]);
  
  const [reviewCards, setReviewCards] = useState<typeof allCardsInDeck>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Shuffle and set cards only once when the component mounts or deck changes
    const shuffledCards = [...allCardsInDeck].sort(() => Math.random() - 0.5);
    setReviewCards(shuffledCards);
    setCurrentIndex(0);
    setShowResults(false);
    setKnownCount(0);
    setIsFlipped(false);
  }, [deckId]); // Only re-run when deckId changes.
  
  const currentCard = reviewCards.length > 0 ? reviewCards[currentIndex] : undefined;
  const progress = reviewCards.length > 0 ? ((currentIndex) / reviewCards.length) * 100 : 0;
  const displayProgress = reviewCards.length > 0 ? ((currentIndex + 1) / reviewCards.length) * 100 : 0;
  
  if (!isClient) {
      return null;
  }

  if (!deck) {
    return notFound();
  }

  const handleNext = (known: boolean) => {
    if (!currentCard) return;
    updateCardStatus(currentCard.id, known);
    if (known) {
      setKnownCount(prev => prev + 1);
    }

    if (currentIndex < reviewCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const restartReview = () => {
    const shuffledCards = [...allCardsInDeck].sort(() => Math.random() - 0.5);
    setReviewCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowResults(false);
    setKnownCount(0);
  };
  
  if (allCardsInDeck.length === 0) {
      return (
        <div className="container mx-auto p-4 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">This deck is empty!</h2>
            <p className="text-muted-foreground mb-6">Add some cards to start a review session.</p>
            <Button asChild>
                <Link href={`/decks/${deckId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Deck
                </Link>
            </Button>
        </div>
      );
  }

  if (showResults) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Review Complete!</CardTitle>
          </CardHeader>
          <CardContent>
             <Progress value={100} className="mb-4"/>
            <p className="text-lg mb-4">You reviewed {reviewCards.length} cards.</p>
            <p className="text-3xl font-bold text-green-600">You knew {knownCount}!</p>
            <p className="text-3xl font-bold text-red-600">You missed {reviewCards.length - knownCount}.</p>
            <div className="flex gap-4 justify-center mt-8">
              <Button onClick={restartReview}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Review Again
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/decks/${deckId}`}>Back to Deck</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href={`/decks/${deckId}`} className="flex items-center text-sm text-primary mb-4 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Exit Review
      </Link>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <p className="text-center text-muted-foreground mb-2">Card {currentIndex + 1} of {reviewCards.length}</p>
          <Progress value={displayProgress} />
        </div>

        {currentCard && (
            <div onClick={() => setIsFlipped(!isFlipped)} className="cursor-pointer">
            <Flashcard
                front={currentCard.front}
                back={currentCard.back}
                isFlipped={isFlipped}
            />
            </div>
        )}

        <div className="mt-6 flex justify-center gap-4">
          {isFlipped ? (
            <>
              <Button variant="destructive" size="lg" onClick={() => handleNext(false)}>
                <X className="mr-2 h-5 w-5" /> I Didn't Know
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" size="lg" onClick={() => handleNext(true)}>
                <Check className="mr-2 h-5 w-5" /> I Knew It
              </Button>
            </>
          ) : (
            <Button size="lg" onClick={() => setIsFlipped(true)}>
              Flip Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
