"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CardForm } from "@/components/CardForm";
import type { Card } from "@/lib/types";
import { ArrowLeft, BookOpen, PlusCircle, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = Array.isArray(params.deckId) ? params.deckId[0] : params.deckId;
  const { getDeckById, getCardsByDeckId, deleteCard, deleteDeck } = useFlashcards();
  const { toast } = useToast();

  const [cardToEdit, setCardToEdit] = React.useState<Card | undefined>(undefined);
  const [isCardFormOpen, setIsCardFormOpen] = React.useState(false);
  
  const deck = getDeckById(deckId);
  const cards = getCardsByDeckId(deckId);

  React.useEffect(() => {
    if (!isCardFormOpen) {
      setCardToEdit(undefined);
    }
  }, [isCardFormOpen]);

  if (!deck) {
    return notFound();
  }

  const handleEditClick = (card: Card) => {
    setCardToEdit(card);
    setIsCardFormOpen(true);
  };
  
  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    toast({ title: "Card deleted", description: "The card has been removed from your deck."});
  };

  const handleDeleteDeck = () => {
    deleteDeck(deckId);
    toast({ title: "Deck deleted", description: "The deck and all its cards have been removed."});
    router.push('/');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/" className="flex items-center text-sm text-primary mb-4 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all decks
      </Link>

      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{deck.name}</h1>
          <p className="text-muted-foreground mt-1">{deck.description}</p>
        </div>
        <div className="flex gap-2">
           <Dialog open={isCardFormOpen} onOpenChange={setIsCardFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{cardToEdit ? 'Edit Card' : 'Add a new card'}</DialogTitle>
              </DialogHeader>
              <CardForm setOpen={setIsCardFormOpen} deckId={deckId} card={cardToEdit} />
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link href={`/decks/${deckId}/review`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Start Review
            </Link>
          </Button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the deck "{deck.name}" and all of its cards. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDeck}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        {cards.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Front</TableHead>
                <TableHead>Back</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">{card.front}</TableCell>
                  <TableCell>{card.back}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(card)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the card. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-12">
            <h3 className="text-lg font-semibold text-muted-foreground">This deck is empty.</h3>
            <p className="text-muted-foreground mt-2 mb-4">Add your first card to get started.</p>
             <Dialog open={isCardFormOpen} onOpenChange={setIsCardFormOpen}>
                <DialogTrigger asChild>
                <Button variant="default">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Card
                </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new card</DialogTitle>
                </DialogHeader>
                <CardForm setOpen={setIsCardFormOpen} deckId={deckId} />
                </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
