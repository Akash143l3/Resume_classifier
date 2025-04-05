import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <div className="h-16 flex justify-between items-center w-full dark:bg-blue-700 p-4 shadow">
      <Link href="/" className="text-2xl font-bold text-white">
        Smart Match
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          href="/category"
          className="text-white border  px-4 py-1 rounded hover:bg-blue-400"
        >
          Category
        </Link>
      </div>
    </div>
  );
}
