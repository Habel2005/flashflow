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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Deck } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  name: z.string().min(1, { message: "Deck name is required." }).max(50),
  description: z.string().max(100).optional(),
});

type DeckFormProps = {
  deck?: Deck;
  setOpen: (open: boolean) => void;
};

export function DeckForm({ deck, setOpen }: DeckFormProps) {
  const { createDeck, updateDeck } = useFlashcards();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: deck?.name || "",
      description: deck?.description || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (deck) {
      updateDeck({ ...deck, ...values });
      toast({ title: "Deck updated", description: `The "${values.name}" deck has been successfully updated.` });
    } else {
      createDeck(values);
      toast({ title: "Deck created", description: `The "${values.name}" deck has been successfully created.` });
    }
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deck Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spanish Vocabulary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short description of your deck"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{deck ? "Save Changes" : "Create Deck"}</Button>
      </form>
    </Form>
  );
}
