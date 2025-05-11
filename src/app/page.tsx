"use client";

import Link from "next/link";
import RubberDuck from "./components/RubberDuck";
import { useEffect, useState } from "react";

const Home = () => {
  const [ducks, setDucks] = useState<Array<{ id: number; x: number; size: "sm" | "md" | "lg"; delay: number }>>([]);

  useEffect(() => {
    const numberOfDucks = Math.floor(Math.random() * 5) + 1; // 5-10 ducks
    const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];
    const newDucks: Array<{ id: number; x: number; size: "sm" | "md" | "lg"; delay: number }> = [];

    for (let i = 0; i < numberOfDucks; i++) {
      newDucks.push({
        id: i,
        x: Math.random() * 85 + 5, // Random x-position
        size: sizes[Math.floor(Math.random() * sizes.length)], // Random size
        delay: Math.random() * 2,  // Random delay for floating effect
      });
    }

    setDucks(newDucks);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex flex-col items-center z-30 relative">
        <div className="text-center max-w-3xl mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Rubber Duck Debugging
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-border">
            <p className="text-xl italic mb-4">
              &quot;If you can explain it to a duck, you can explain it to anyone.&quot;
            </p>
            <p className="text-muted-foreground">
              Simplify your problems by explaining them to a virtual duck.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8 justify-center">
            <Link
              href="/learn"
              className="bg-green-600 text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 transition-colors duration-200 text-center"
            >
              Start
            </Link>

            <Link
              href="/collaborate"
              className="border border-green-600 bg-white text-green-600 px-8 py-3 rounded-md font-medium hover:bg-green-100 transition-colors duration-200 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Main Rubber Duck */}
        <div className="flex justify-center mt-6 z-50 relative">
          <RubberDuck size="lg" animated={true} />
        </div>
      </div>

      {/* Water Section */}
      <div className="relative h-[400px] mt-12 z-10 bg-[#4EC0B2] overflow-hidden">
        {/* Wave Layers */}
        <div className="absolute top-0 left-0 w-full h-[150px] z-30">
          <div className="wave-animation">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="waves h-full">
              <path
                fill="#4EC0B2"
                fillOpacity="0.7"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L0,320Z"
              ></path>
            </svg>
          </div>

          <div className="wave-animation wave-animation-delayed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="waves h-full">
              <path
                fill="#39B4A6"
                fillOpacity="1"
                d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,266.7C672,288,768,288,864,277.3C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Water Background */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-[#4EC0B2] z-10"></div>

        {/* Floating Ducks */}
        {ducks.map((duck) => (
          <div
            key={duck.id}
            className="absolute z-40" // Ensure ducks are in front of the water
            style={{
              left: `${duck.x}%`,
              bottom: "100px",  // Fixed y-coordinate for alignment
              animationDelay: `${duck.delay}s`,
            }}
          >
            <RubberDuck size={duck.size} animated={true} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-[#4EC0B2] z-0"></div>
    </div>
  );
};

export default Home;
