"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { data } from "../data/data";

const Snakegrid = () => {
  const grizSize = 20;

  type Point = {
    x: number;
    y: number;
  };
  type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

  const [snake, setSnake] = useState<Point[]>([
    { y: 0, x: 2 },
    { y: 0, x: 1 },
    { y: 0, x: 0 },
  ]);
  const [food, setFood] = useState<Point>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>("DOWN");
  const [gameOver, setGameover] = useState(false);
  const [foodChangeCount, setFoodChangeCount] = useState(0);
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [randomDescription, setRandomDescription] = useState<string | null>(
    null
  );

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Generate new food
  const generateFoods = () => {
    const x = Math.floor(Math.random() * grizSize);
    const y = Math.floor(Math.random() * grizSize);
    setFood({ x, y });
    setFoodChangeCount((prev) => prev + 1);
  };

  // Snake movement logic
  const moveSnake = () => {
    const newSnake = [...snake];
    const snakehead = { ...newSnake[0] };

    if (direction === "UP") snakehead.y -= 1;
    if (direction === "DOWN") snakehead.y += 1;
    if (direction === "LEFT") snakehead.x -= 1;
    if (direction === "RIGHT") snakehead.x += 1;

    // Collision check
    if (
      snakehead.x < 0 ||
      snakehead.x >= grizSize ||
      snakehead.y < 0 ||
      snakehead.y >= grizSize ||
      newSnake.some(
        (snakepart) =>
          snakepart.x === snakehead.x && snakepart.y === snakehead.y
      )
    ) {
      setGameover(true);
      return;
    }

    newSnake.unshift(snakehead);

    // Eat food
    if (snakehead.x === food.x && snakehead.y === food.y) {
      generateFoods();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  // Interval movement
  useEffect(() => {
    const interval = setInterval(moveSnake, 105);
    return () => clearInterval(interval);
  }, [snake, direction]);

  useEffect(() => {
    generateFoods();
  }, []);

  // Keyboard controls
  const handlekey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    if (event.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
    if (event.key === "ArrowLeft" && direction !== "RIGHT")
      setDirection("LEFT");
    if (event.key === "ArrowRight" && direction !== "LEFT")
      setDirection("RIGHT");
  };

  // Touch swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && direction !== "LEFT") setDirection("RIGHT");
      if (dx < 0 && direction !== "RIGHT") setDirection("LEFT");
    } else {
      if (dy > 0 && direction !== "UP") setDirection("DOWN");
      if (dy < 0 && direction !== "DOWN") setDirection("UP");
    }
  };

  const handlePlayAgain = () => {
    setSnake([
      { y: 0, x: 2 },
      { y: 0, x: 1 },
      { y: 0, x: 0 },
    ]);
    setDirection("DOWN");
    setGameover(false);
    setFoodChangeCount(0);
    setShowDidYouKnow(false);
    setRandomDescription(null);
    generateFoods();
  };

  const handleLearnMore = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setRandomDescription(data[randomIndex].description);
    setShowDidYouKnow(true);
  };

  return (
    <section
      className="container flex-wrap mx-auto flex justify-center h-auto w-full mt-[5%] md:mt-[10%] relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        onKeyDown={handlekey}
        tabIndex={0}
        autoFocus
        className="grid grid-rows-20 border-[#3673f5]  border-2"
      >
        {/* Grid */}
        {Array.from({ length: grizSize }).map((_, y) => (
          <div key={y} className="flex">
            {Array.from({ length: grizSize }).map((_, x) => (
              <div
                key={x}
                className={`w-4 h-4 md:w-5 md:h-5 border border-[#2C3444] ${
                  snake.some(
                    (snakepart) => snakepart.x === x && snakepart.y === y
                  )
                    ? "bg-[#3673f5] hover:bg-[#4C82F7]"
                    : ""
                } ${food.x === x && food.y === y ? "bg-green-600" : ""}`}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Full Page Backdrop + Modal */}
      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0A0D14]  backdrop-blur-sm"></div>

          {/* Modal */}
          <div className="relative z-10 flex flex-col items-center space-y-9 bg-[#1E232E] hover:bg-[#242A37] w-auto md:w-[350px] md:h-[340px] rounded-xl p-6 shadow-lg">
            {!showDidYouKnow ? (
              <>
                <div>
                  <div className="text-4xl font-bold text-[#EF4444]">
                    Game Over
                  </div>
                  <h1 className="text-lg font-bold text-[#22C55E]">
                    Score : {(foodChangeCount - 1) * 2} points
                  </h1>
                </div>

                <div className="flex flex-col gap-3 mt-[10%] w-full">
                  <button
                    className="py-3 px-5 cursor-pointer text-xl font-bold text-white bg-[#3673f5] hover:bg-[#4C82F7] rounded-xl"
                    onClick={() => window.location.reload()}
                  >
                    PLAY AGAIN
                  </button>
                  <button
                    className="py-3 px-5  cursor-pointer text-xl bg-[#3673f5] hover:bg-[#4C82F7] font-bold text-white opacity-60 hover:opacity-100  rounded-xl"
                    onClick={handleLearnMore}
                  >
                    LEARN MORE
                  </button>
                </div>
              </>
            ) : (
              <div className="w-[300px] md:w-auto text-center">
                <h1 className="text-4xl font-bold text-[#9CA3AF]">
                  Do You Know? 🤔
                </h1>
                <p className="text-left text-[#E5E7EB] font-medium  mt-[5%]">
                  {randomDescription}
                </p>
                <button
                  className="py-3 px-5 bg-[#3673f5] hover:bg-[#4C82F7] cursor-pointer text-xl font-bold text-white rounded-xl mt-6"
                  onClick={() => window.location.reload()}
                >
                  PLAY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile On-Screen Controls */}

      {!gameOver && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden">
          <button
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#3673f5] to-[#4F9CFD] text-white font-bold"
            onClick={() => direction !== "DOWN" && setDirection("UP")}
          >
            ↑
          </button>
          <div className="flex gap-14">
            <button
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#3673f5] to-[#4F9CFD] text-white font-bold"
              onClick={() => direction !== "RIGHT" && setDirection("LEFT")}
            >
              ←
            </button>
            <button
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#3673f5] to-[#4F9CFD] text-white font-bold"
              onClick={() => direction !== "LEFT" && setDirection("RIGHT")}
            >
              →
            </button>
          </div>
          <button
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#3673f5] to-[#4F9CFD] text-white font-bold"
            onClick={() => direction !== "UP" && setDirection("DOWN")}
          >
            ↓
          </button>
        </div>
      )}
    </section>
  );
};

export default Snakegrid;
