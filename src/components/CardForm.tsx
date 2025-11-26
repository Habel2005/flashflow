"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Card } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  front: z.string().min(1, { message: "Front content is required." }),
  back: z.string().min(1, { message: "Back content is required." }),
});

type CardFormProps = {
  card?: Card;
  deckId: string;
  setOpen: (open: boolean) => void;
};

export function CardForm({ card, deckId, setOpen }: CardFormProps) {
  const { createCard, updateCard } = useFlashcards();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: card?.front || "",
      back: card?.back || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (card) {
      updateCard({ ...card, ...values });
      toast({ title: "Card updated!", description: "Your changes have been saved."});
    } else {
      createCard({ ...values, deckId });
      toast({ title: "Card created!", description: "A new card has been added to your deck."});
    }
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The question or prompt"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The answer"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{card ? "Save Changes" : "Create Card"}</Button>
      </form>
    </Form>
  );
}
