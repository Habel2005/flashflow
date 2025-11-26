"use client";

import * as React from "react";
import Link from "next/link";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeckForm } from "@/components/DeckForm";
import { PlusCircle, ArrowRight } from "lucide-react";

export default function DecksPage() {
  const { decks } = useFlashcards();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Decks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Deck
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a new deck</DialogTitle>
            </DialogHeader>
            <DeckForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Card
              key={deck.id}
              className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/decks/${deck.id}`} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-primary">{deck.name}</CardTitle>
                  <CardDescription className="pt-2">{deck.description}</CardDescription>
                </CardHeader>
                <div className="flex-grow" />
                <CardFooter>
                  <div className="flex justify-end w-full items-center text-sm font-semibold text-accent">
                    View Deck <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed">
          <h2 className="text-xl font-semibold text-muted-foreground">No decks yet!</h2>
          <p className="text-muted-foreground mt-2 mb-4">
            Get started by creating your first flashcard deck.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Deck
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new deck</DialogTitle>
              </DialogHeader>
              <DeckForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
