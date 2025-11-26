import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            FlashFlow
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
