"use client";

import { useEffect, useState } from "react";
import { TypewriterEffect } from "./ui/TypewriterEffect";

interface HeroTypewriterProps {
  descriptions: string[];
  defaultDescription: string;
}

export function HeroTypewriter({ descriptions, defaultDescription }: HeroTypewriterProps) {
  const [index, setIndex] = useState(0);

  // If no descriptions array, just use defaultDescription as a single item
  const validDescriptions = descriptions && descriptions.length > 0 ? descriptions : [defaultDescription];

  const currentText = validDescriptions[index];

  const words = currentText.split(" ").map((word) => ({
    text: word,
  }));

  const handleComplete = () => {
    // Wait a bit before switching to the next description
    setTimeout(() => {
        setIndex((prev) => (prev + 1) % validDescriptions.length);
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="flex justify-start items-center">
       <TypewriterEffect
          key={index} // Remount to restart animation
          words={words}
          className="text-lg leading-7 text-gray-500 dark:text-gray-400 font-normal text-left"
          cursorClassName="bg-gray-500 dark:bg-gray-400 h-5 md:h-6 w-[2px]"
          onComplete={validDescriptions.length > 1 ? handleComplete : undefined}
       />
    </div>
  );
}
