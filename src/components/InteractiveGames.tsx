import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw, Play, Heart, Sparkles, HelpCircle, Lock, CheckCircle2, Share2, Download } from "lucide-react";
import { toPng } from "html-to-image";

const EMOJIS = [
  "😭", "✋", "😂", "🤣", "🍿", "🔪", "😔", "🙂", "😮‍💨",
  "🙃", "😌", "👍", "🫳", "👊", "😑", "🤧", "💋", "🙏",
  "😠", "😤", "🏃‍♀️", "🗣️", "💪", "✨", "🤙", "😆", "🙂",
  "🤠", "😏", "🥺", "💎", "☕", "👏", "💥", "👎", "🍾",
  "🫵", "✋", "👉", "😋", "🟦", "🥀", "😭", "🤣", "🤦‍♀️",
  "💗", "💞", "😂", "🥺", "💔", "✋", "🙌", "🍑", "😔",
  "👊", "🔗", "👉", "👈", "🙂", "☀️", "😘", "💃", "👊",
  "👍", "🙏", "😪", "😋", "💄", "😶", "😕", "💗", "😌"
];

const CUTE_DARES = [
  "Call you memsaab , madamji , malkin ji or ash ji for a week in every text",
  "Do anything you say no questions asked for 1 minute",
  "Send you a pic every hour for a day",
  "Change my pfp to an image of your choice on an app of your choice for an hour",
  "Write a 500 word essay praising you or dissing myself according to your choice",
  "Use this card as a uno reverse to change my decision on anything. I cannot refuse.",
  "Send this to make me give you compliments or talk dirty for however long you want",
  "Mystery Dare. I'll do a dare of your choice. Have mercy."
];

export default function InteractiveGames() {
  const [activeTab, setActiveTab] = useState<"pong" | "catch" | "wheel">("pong");
  const [pongCompleted, setPongCompleted] = useState(() => localStorage.getItem('birthday_pong_done') === 'true');
  const [catchCompleted, setCatchCompleted] = useState(() => localStorage.getItem('birthday_catch_done') === 'true');

  const wheelUnlocked = pongCompleted && catchCompleted;

  const handlePongComplete = () => {
    setPongCompleted(true);
    localStorage.setItem('birthday_pong_done', 'true');
  };

  const handleCatchComplete = () => {
    setCatchCompleted(true);
    localStorage.setItem('birthday_catch_done', 'true');
  };

  const handleWheelTabClick = () => {
    setActiveTab("wheel");
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-rose-900/10 shadow-xl" id="games-section">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-rose-900/10 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-rose-950 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-rose-800" />
            Kill your boredom here Ash babyy!!
          </h2>
          <p className="text-sm text-stone-600 font-sans mt-0.5">Play just for fun. There are no rewards. 😉</p>
        </div>
        <div className="flex gap-2 bg-stone-100/70 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab("pong")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 ${activeTab === "pong"
              ? "bg-[#65000b] text-white shadow-md"
              : "text-stone-600 hover:bg-stone-200/50"
              }`}
          >
            {pongCompleted && <CheckCircle2 className="w-3 h-3" />}
            Emoji Pong
          </button>
          <button
            onClick={() => setActiveTab("catch")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 ${activeTab === "catch"
              ? "bg-[#65000b] text-white shadow-md"
              : "text-stone-600 hover:bg-stone-200/50"
              }`}
          >
            {catchCompleted && <CheckCircle2 className="w-3 h-3" />}
            Catch Hearts
          </button>
          <button
            onClick={handleWheelTabClick}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 ${activeTab === "wheel"
              ? wheelUnlocked
                ? "bg-[#65000b] text-white shadow-md"
                : "bg-stone-300 text-stone-500 shadow-md"
              : wheelUnlocked
                ? "text-stone-600 hover:bg-stone-200/50"
                : "text-stone-400 hover:bg-stone-200/30"
              }`}
          >
            {!wheelUnlocked ? <Lock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            Wheel of Dares
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "pong" && (
          <motion.div key="pong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PongGame onComplete={handlePongComplete} />
          </motion.div>
        )}
        {activeTab === "catch" && (
          <motion.div key="catch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CatchHeartsGame onComplete={handleCatchComplete} />
          </motion.div>
        )}
        {activeTab === "wheel" && (
          <motion.div key="wheel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WheelOfDaresGame isLocked={!wheelUnlocked} pongDone={pongCompleted} catchDone={catchCompleted} onDareShared={() => {
              setPongCompleted(false);
              setCatchCompleted(false);
              localStorage.removeItem('birthday_pong_done');
              localStorage.removeItem('birthday_catch_done');
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PongGame({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("😭");

  const containerRef = useRef<HTMLDivElement>(null);
  const ballDivRef = useRef<HTMLDivElement>(null);
  const paddleDivRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  const paddleX = useRef(50);
  const ball = useRef({ x: 50, y: 10, dx: 1, dy: 1 });

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setGameOver(false);
    setRewardUnlocked(false);
    setCurrentEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    ball.current = {
      x: 50, y: 10,
      dx: (Math.random() > 0.5 ? 1 : -1) * 0.8,
      dy: 1.2
    };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    paddleX.current = Math.max(6, Math.min(94, relativeX));
    if (paddleDivRef.current) {
      paddleDivRef.current.style.left = `${paddleX.current}%`;
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const update = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      let { x, y, dx, dy } = ball.current;
      const speedMultiplier = deltaTime * 0.05;

      let nextX = x + dx * speedMultiplier;
      let nextY = y + dy * speedMultiplier;

      if (nextX <= 2 || nextX >= 98) {
        dx = -dx;
        nextX = nextX <= 2 ? 2 : 98;
      }
      if (nextY <= 2) {
        dy = -dy;
        nextY = 2;
      }

      // Check collision with paddle (Y between 88-92, X within 8% of paddleX since paddle is 12% wide)
      if (nextY >= 88 && nextY <= 92 && dy > 0) {
        if (Math.abs(nextX - paddleX.current) < 8) { // Harder: paddle is 12%, radius is 6
          dy = -Math.abs(dy) - 0.08; // Faster acceleration
          dx = dx > 0 ? dx + 0.02 : dx - 0.02; // Increase X speed
          nextY = 87;

          setScore(s => {
            const newScore = s + 1;
            if (newScore >= 50 && !rewardUnlocked) {
              setRewardUnlocked(true);
              setIsPlaying(false);
              onComplete();
            }
            return newScore;
          });
          setCurrentEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
        }
      }

      if (nextY > 98) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      ball.current = { x: nextX, y: nextY, dx, dy };

      if (ballDivRef.current) {
        ballDivRef.current.style.left = `${nextX}%`;
        ballDivRef.current.style.top = `${nextY}%`;
      }

      if (isPlaying && !gameOver && !rewardUnlocked) {
        requestRef.current = requestAnimationFrame(update);
      }
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameOver, rewardUnlocked]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="relative w-full h-96 bg-stone-100 rounded-2xl border border-rose-900/10 overflow-hidden cursor-crosshair select-none touch-none"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a0404 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 font-mono text-xs text-rose-900 bg-white/80 px-4 py-2 rounded-full border border-rose-900/10 backdrop-blur-sm shadow-sm">
        <span className="font-sans font-medium">
          Score: <strong className="text-sm font-bold font-mono text-rose-800">{score}</strong> / 50
        </span>
      </div>

      {!isPlaying && !rewardUnlocked && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 text-center z-20">
          <div className="text-5xl mb-4">🏓</div>
          <h3 className="font-serif text-xl font-bold text-rose-900">Emoji Pong</h3>
          <p className="text-xs text-stone-600 max-w-xs mt-1 mb-4 font-sans leading-relaxed">
            You couldn't break my record on Insta. Let's see if you have better luck here.
          </p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-[#65000b] hover:bg-[#800020] text-rose-50 font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition-all duration-300"
          >
            <Play className="w-4 h-4" /> Start Game
          </button>
        </div>
      )}

      {(isPlaying || gameOver) && (
        <div
          ref={ballDivRef}
          style={{ left: `${ball.current.x}%`, top: `${ball.current.y}%`, transform: "translate(-50%, -50%)" }}
          className="absolute text-4xl pointer-events-none will-change-transform"
        >
          {currentEmoji}
        </div>
      )}

      {(isPlaying || gameOver) && (
        <div
          ref={paddleDivRef}
          style={{ left: `${paddleX.current}%`, top: "90%", transform: "translateX(-50%)" }}
          className="absolute w-[12%] h-3 bg-[#65000b] rounded-full shadow-md will-change-transform"
        />
      )}

      {rewardUnlocked && !isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 p-6 text-center z-20 overflow-y-auto">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl mb-2"
          >
            💌
          </motion.div>
          <h3 className="font-serif text-2xl font-bold text-rose-900 mb-2">
            Yayyy you won!!
          </h3>
          <div className="bg-white rounded-2xl p-5 border border-rose-900/10 italic shadow-md max-w-sm font-caveat text-xl text-rose-900 leading-relaxed md:text-2xl">
            "Ash, You absolute cutie! I owe you a kiss"
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-5 max-w-xs"
          >
            <div className="rounded-2xl overflow-hidden border-2 border-rose-200 shadow-lg">
              <img
                src="/prize_image.jpg"
                alt="A special prize for you"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-stone-600 font-sans italic leading-relaxed">
              "I know you couldn't see this image then when I used it as a pfp so here you go"
            </p>
          </motion.div>
          <button
            onClick={startGame}
            className="mt-6 flex items-center gap-1.5 text-rose-900 bg-rose-100 border border-rose-200 hover:bg-rose-200 transition-all duration-300 text-xs font-semibold px-4 py-2 rounded-full"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Play Again
          </button>
        </div>
      )}

      {gameOver && !rewardUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-6 text-center z-20">
          <div className="text-4xl mb-2">💥</div>
          <h3 className="font-serif text-lg font-bold text-stone-700">Oops!</h3>
          <p className="text-xs text-stone-500 max-w-xs mt-1 mb-4 font-sans">
            You scored {score}.<br></br> Ha! get good loser!<br></br> LoL just kiddin sweetheart.
          </p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-[#65000b] hover:bg-[#800020] text-rose-50 font-semibold text-xs px-5 py-2.5 rounded-full shadow"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

function CatchHeartsGame({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const basketDivRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  const basketPos = useRef(50);
  const lastSpawnTime = useRef<number>(0);
  const hearts = useRef<{ x: number; y: number; speed: number; char: string; isHeart: boolean }[]>([]);

  const GOOD_HEARTS = ["❤️", "💖", "💗", "💞", "💕", "💔"];

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(5);
    hearts.current = [];
    setRewardUnlocked(false);
    setGameOver(false);
    lastSpawnTime.current = performance.now();
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    basketPos.current = Math.max(5, Math.min(95, relativeX));

    if (basketDivRef.current) {
      basketDivRef.current.style.left = `${basketPos.current}%`;
    }
  };

  useEffect(() => {
    if (!isPlaying || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const update = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Spawn
      if (time - lastSpawnTime.current > 600) {
        lastSpawnTime.current = time;
        const isHeart = Math.random() < 0.4;
        const char = isHeart
          ? GOOD_HEARTS[Math.floor(Math.random() * GOOD_HEARTS.length)]
          : EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

        hearts.current.push({
          x: Math.random() * 90 + 5,
          y: 0,
          speed: isHeart ? (Math.random() * 0.02 + 0.03) : (Math.random() * 0.06 + 0.05),
          char,
          isHeart
        });
      }

      let livesLost = 0;
      let pointsChange = 0;

      for (let i = hearts.current.length - 1; i >= 0; i--) {
        const item = hearts.current[i];
        item.y += item.speed * deltaTime;

        // Draw item
        const pixelX = (item.x / 100) * canvas.width;
        const pixelY = (item.y / 100) * canvas.height;
        ctx.fillText(item.char, pixelX, pixelY);

        const isAtBasketHeight = item.y >= 82 && item.y <= 90;
        const isNearBasketX = Math.abs(item.x - basketPos.current) < 12;

        if (isAtBasketHeight && isNearBasketX) {
          if (item.isHeart) pointsChange++;
          else pointsChange--;
          hearts.current.splice(i, 1);
        } else if (item.y >= 100) {
          if (item.isHeart) livesLost++;
          hearts.current.splice(i, 1);
        }
      }

      if (pointsChange !== 0) {
        setScore(s => {
          const newScore = Math.max(0, s + pointsChange);
          if (newScore >= 5 && !rewardUnlocked) {
            setRewardUnlocked(true);
            setIsPlaying(false);
            onComplete();
          }
          return newScore;
        });
      }

      if (livesLost > 0) {
        setLives(l => {
          const newLives = l - livesLost;
          if (newLives <= 0) {
            setGameOver(true);
            setIsPlaying(false);
          }
          return newLives;
        });
      }

      if (isPlaying && !gameOver && !rewardUnlocked) {
        requestRef.current = requestAnimationFrame(update);
      }
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, gameOver, rewardUnlocked]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="relative w-full h-96 bg-[#fff1f2] rounded-2xl border border-rose-900/10 overflow-hidden cursor-crosshair select-none touch-none"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none scrapbook-paper" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 font-mono text-xs text-rose-800 bg-white/80 px-4 py-2 rounded-full border border-[#65000b]/10 backdrop-blur-sm shadow-sm">
        <span className="flex items-center gap-1 font-sans font-medium">
          <Heart className="w-4 h-4 text-[#65000b] fill-[#65000b] animate-pulse" />
          Score: <strong className="text-sm font-bold font-mono text-rose-600">{score}</strong>/100
        </span>
        <span className="font-sans font-medium flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < lives ? "text-rose-600" : "text-stone-300 opacity-50"}>❤️</span>
          ))}
        </span>
      </div>

      {!isPlaying && !rewardUnlocked && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-6 text-center z-20">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#fff1f2] p-4 rounded-full mb-3 shadow-inner">
            <Heart className="w-12 h-12 text-[#65000b] fill-[#65000b]" />
          </motion.div>
          <h3 className="font-serif text-xl font-bold text-[#65000b]">Yash's Heart Catcher</h3>
          <p className="text-xs text-stone-600 max-w-xs mt-1 mb-4 font-sans leading-relaxed">
            Catch 100 hearts! Catching other emojis deducts points. Dropping a heart loses a life! This is for all the heart emojis you don't send me hmph.
          </p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-[#65000b] hover:bg-[#800020] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition-all duration-300"
          >
            <Play className="w-4 h-4 fill-white" /> Start Game
          </button>
        </div>
      )}

      {(isPlaying || gameOver) && (
        <div
          ref={basketDivRef}
          style={{ left: `${basketPos.current}%` }}
          className="absolute bottom-6 w-16 h-10 bg-[#e6b8af] rounded-b-2xl rounded-t-lg border-2 border-[#65000b]/20 shadow-md transform -translate-x-1/2 flex items-center justify-center will-change-transform z-10"
        >
          <div className="text-xl">🧺</div>
        </div>
      )}

      {rewardUnlocked && !isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 p-6 text-center z-20 overflow-y-auto">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl mb-2">
            💖
          </motion.div>
          <h3 className="font-serif text-2xl font-bold text-[#65000b] mb-2">
            You caught my heart!
          </h3>
          <div className="bg-white/80 rounded-2xl p-5 border border-[#65000b]/20 italic shadow-md max-w-sm font-caveat text-xl text-[#65000b] leading-relaxed md:text-2xl mt-4">
            "Wow ash! you really caught my heart. If you answer these questions correctly, i'll tell you a secret"
          </div>
          <div className="flex gap-3 mt-5">
            <a href="/quiz.html" className="flex items-center gap-1.5 text-white bg-[#65000b] hover:bg-[#800020] transition-all duration-300 text-xs font-semibold px-4 py-2 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> Take the Quiz
            </a>
            <button onClick={startGame} className="flex items-center gap-1.5 text-[#65000b] bg-rose-100 border border-rose-200 hover:bg-rose-200 transition-all duration-300 text-xs font-semibold px-4 py-2 rounded-full">
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        </div>
      )}

      {gameOver && !rewardUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-6 text-center z-20">
          <div className="text-4xl mb-2">💔</div>
          <h3 className="font-serif text-lg font-bold text-stone-700">Oops!</h3>
          <p className="text-xs text-stone-500 max-w-xs mt-1 mb-4 font-sans">
            You ran out of lives! You caught {score} hearts. Let's try again.
          </p>
          <button onClick={startGame} className="flex items-center gap-2 bg-[#65000b] hover:bg-[#800020] text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

function WheelOfDaresGame({ isLocked, pongDone, catchDone, onDareShared }: { isLocked: boolean; pongDone: boolean; catchDone: boolean; onDareShared: () => void }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedDare, setSelectedDare] = useState<string | null>(null);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [dareTimestamp, setDareTimestamp] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  const dareCardRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning || isLocked) return;
    setIsSpinning(true);
    setSelectedDare(null);

    const spinTicks = 8 + Math.floor(Math.random() * 8);
    const segmentDeg = 360 / CUTE_DARES.length;
    const finalRot = rotationDeg + (spinTicks * segmentDeg) + (360 * 3);

    const winningIndex = Math.floor(((finalRot + 90) % 360) / segmentDeg);
    const correctedIndex = (CUTE_DARES.length - winningIndex) % CUTE_DARES.length;

    setRotationDeg(finalRot);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedDare(CUTE_DARES[correctedIndex]);
      setDareTimestamp(new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }));
    }, 4000);
  };

  return (
    <div
      className="w-full max-w-sm mx-auto flex flex-col items-center p-4 bg-stone-100/50 border border-stone-200 rounded-2xl relative"
    >
      {isLocked && (
        <div className="absolute inset-0 z-30 rounded-2xl bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center shadow-inner">
              <Lock className="w-9 h-9 text-stone-400" />
            </div>
          </motion.div>
          <h3 className="font-serif text-xl font-bold text-stone-700 mb-2">Locked Challenge</h3>
          <p className="text-sm text-stone-500 font-sans max-w-xs mb-5 leading-relaxed">
            Complete both games to unlock the Wheel of Dares! No shortcuts Ash. 😤
          </p>
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${pongDone
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-stone-50 border border-stone-200 text-stone-500"
              }`}>
              {pongDone
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                : <div className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
              }
              <span>Emoji Pong</span>
              <span className="ml-auto text-[10px] font-mono opacity-70">{pongDone ? "Done!" : "Score 50"}</span>
            </div>
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${catchDone
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-stone-50 border border-stone-200 text-stone-500"
              }`}>
              {catchDone
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                : <div className="w-4 h-4 rounded-full border-2 border-stone-300 flex-shrink-0" />
              }
              <span>Catch Hearts</span>
              <span className="ml-auto text-[10px] font-mono opacity-70">{catchDone ? "Done!" : "Score 100"}</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10">
        <HelpCircle className="w-4 h-4 text-stone-400 hover:text-stone-600 cursor-pointer" />
      </div>

      {!isLocked && (
        <p className="text-sm text-stone-600 font-sans italic text-center max-w-xs mb-4 leading-relaxed">
          "Well played. You have completed two boring and pointless games. Well now you can make me do any of the dares listed here 😤"
        </p>
      )}

      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#65000b] relative z-15 transform -translate-y-2 drop-shadow-sm" />

      <div className={`relative w-64 h-64 rounded-full border-4 border-[#65000b]/20 shadow-xl overflow-hidden mb-6 flex items-center justify-center ${isLocked ? 'opacity-30 blur-[2px]' : ''}`}>
        <div
          style={{ transform: `rotate(${rotationDeg}deg)`, transition: isSpinning ? "transform 4s cubic-bezier(0.1, 0.8, 0.3, 1)" : "none" }}
          className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center bg-white"
        >
          {CUTE_DARES.map((_, idx) => {
            const rot = idx * (360 / CUTE_DARES.length);
            const isCutePink = idx % 2 === 0;
            return (
              <div key={idx} style={{ transform: `rotate(${rot}deg)` }} className="absolute inset-0 origin-center flex items-start justify-center pt-4">
                <div className={`w-1 h-12 rounded-full ${isCutePink ? "bg-[#c15c5c]" : "bg-[#e6a5a5]"} opacity-70`} />
                <span className="absolute text-xl top-6 font-bold text-stone-700">{idx + 1}</span>
              </div>
            );
          })}

          <div className="absolute inset-2 rounded-full border border-stone-100 bg-white/40 backdrop-blur-[2px] pointer-events-none" />
          <div className="absolute inset-16 rounded-full border border-[#65000b]/10 bg-stone-100 flex items-center justify-center text-2xl font-serif text-[#65000b] font-bold pointer-events-none shadow">
            🩷
          </div>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning || isLocked}
        className={`px-6 py-2.5 rounded-full font-serif font-bold text-sm tracking-wide transition-all shadow-md ${isSpinning || isLocked
          ? "bg-stone-200 text-stone-500 cursor-not-allowed"
          : "bg-[#65000b] text-white hover:bg-[#800020] hover:shadow-lg"
          }`}
      >
        {isLocked ? "🔒 Locked" : isSpinning ? "Spinning Magic..." : "Spin the Wheel!"}
      </button>

      <AnimatePresence>
        {selectedDare && !isSpinning && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="mt-6 w-full max-w-[300px]"
          >
            {/* Capturable card */}
            <div
              ref={dareCardRef}
              className="rounded-2xl overflow-hidden shadow-lg border border-rose-200"
              style={{ background: 'linear-gradient(145deg, #fff5f5, #fff0f0, #fce4ec)' }}
            >
              <div className="px-5 pt-5 pb-3 text-center">
                <div className="text-2xl mb-1"> Dare Challenge!</div>
                <div className="w-12 h-[2px] bg-[#65000b]/30 mx-auto rounded-full mb-3" />
                <p className="text-[10px] font-sans text-stone-400 tracking-[0.2em] font-mono uppercase mb-2">Action Requisite</p>
                <p className="font-handwritten text-xl text-[#65000b] md:text-2xl leading-relaxed px-2">{selectedDare}</p>
              </div>
              <div className="flex items-center justify-between px-5 py-3 bg-[#65000b]/5 border-t border-rose-200/50">
                <span className="text-[10px] font-mono text-stone-400">🌸 Ash's Birthday Dare</span>
                <span className="text-[10px] font-mono text-stone-400">{dareTimestamp}</span>
              </div>
            </div>

            {/* Share / Download button */}
            <div className="flex justify-center mt-3">
              <button
                disabled={isSharing}
                onClick={async () => {
                  if (!dareCardRef.current) return;
                  setIsSharing(true);
                  try {
                    const dataUrl = await toPng(dareCardRef.current, { pixelRatio: 3 });
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], `dare-card-${Date.now()}.png`, { type: 'image/png' });

                    if (navigator.share && navigator.canShare?.({ files: [file] })) {
                      await navigator.share({ files: [file], title: 'Dare Challenge!' });
                    } else {
                      const a = document.createElement('a');
                      a.href = dataUrl;
                      a.download = file.name;
                      a.click();
                    }
                    onDareShared();
                  } catch (err) {
                    console.error('Share failed:', err);
                  } finally {
                    setIsSharing(false);
                  }
                }}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-[#65000b] text-white hover:bg-[#800020] transition-all duration-300 shadow-md disabled:opacity-50"
              >
                {isSharing ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    Share Dare with your Pookie Bear
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
