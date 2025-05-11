"use client";

import Link from "next/link";
import { Lightbulb, Cloud } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#4f8d5e] shadow-lg p-4 flex items-center justify-between">
      {/* Title */}
      <div className="text-xl font-bold text-white">
        <Link href="/" className="hover:text-yellow-300 transition-colors duration-200">
          Rubber Duck Debugging Interface
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <Link
          href="/learn"
          className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-200"
        >
          <Lightbulb className="w-5 h-5" />
          <span>Learn</span>
        </Link>

        <Link
          href="/pond"
          className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-full shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-200"
        >
          <Cloud className="w-5 h-5" />
          <span>Pond</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
