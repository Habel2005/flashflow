import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type FlashcardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
};

export function Flashcard({ front, back, isFlipped }: FlashcardProps) {
  return (
    <div className="w-full h-80 perspective-[1000px]">
      <div
        className={cn(
          "relative w-full h-full card-flip",
          isFlipped && "is-flipped"
        )}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full card-flip-front">
          <Card className="w-full h-full flex items-center justify-center">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-semibold">{front}</p>
            </CardContent>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full card-flip-back">
          <Card className="w-full h-full flex items-center justify-center bg-secondary">
            <CardContent className="p-6 text-center">
              <p className="text-xl">{back}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
