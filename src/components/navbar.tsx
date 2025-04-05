import { ThemeProvider } from "next-themes";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <div className="h-16 flex justify-between w-full bg-primary p-4">
      <div className="h-full flex items-center">
        <Link
          href={`/`}
          className="text-2xl font-bold text-secondary-foreground"
        >
          Smart Match
        </Link>
      </div>
      <div>
        <Link
          href={`/category`}
          className="text-secondary-foreground mr-4 mt-4 "
        >
          Category
        </Link>
      </div>
    </div>
  );
}
