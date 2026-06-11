import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { Heart, Music, Flower2, Camera, Home, Trophy, Users } from "lucide-react";
import {
  songsDataset, memoryTimeline, loveReasons, twinsDataset, getDayIndex, Memory, Song, Twin
} from "./data";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import InteractiveGames from "./components/InteractiveGames";
import BouquetGenerator from "./components/BouquetGenerator";
import Chatbot from "./components/Chatbot";
import { initConsoleEasterEgg, logPageToConsole } from "./consoleEasterEgg";

export function useGlobalMouseParallax() {
  const globalX = useMotionValue(0);
  const globalY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      globalX.set((e.clientX - centerX) / centerX); // -1 to 1
      globalY.set((e.clientY - centerY) / centerY); // -1 to 1
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [globalX, globalY]);

  return { globalX, globalY };
}

function MemoryCard({ mem, index }: { mem: Memory; index: number; key?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), { stiffness: 120, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), { stiffness: 120, damping: 30 });

  const particles = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 160,
      scale: Math.random() * 0.6 + 0.4,
      delay: Math.random() * 0.5,
      duration: Math.random() * 1.5 + 1.5,
    }));
  }, []);

  const tossX = useMemo(() => (Math.random() - 0.5) * 800, []);
  const tossY = useMemo(() => (Math.random() - 0.5) * 800, []);

  return (
    <motion.div
      ref={cardRef}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: tossX, y: tossY, rotate: (Math.random() - 0.5) * 30 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2] }}
      transition={{
        opacity: { duration: 0.8, delay: index * 0.12 },
        x: { type: "spring", stiffness: 40, damping: 14, delay: index * 0.12 },
        y: { type: "spring", stiffness: 40, damping: 14, delay: index * 0.12 },
        rotate: { duration: 6 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.04, zIndex: 50, transition: { type: "spring", stiffness: 150, damping: 25 } }}
      className="bg-transparent cursor-pointer relative tracking-wide group perspective-1000 z-0 h-full"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 22 }}
        className="w-full h-full preserve-3d"
      >
        {/* Front */}
        <div className="backface-hidden bg-white p-4 pb-6 rounded-sm shadow-md hover:shadow-[0_20px_40px_-10px_rgba(101,0,11,0.25)] border border-stone-200/80 relative h-full">
          {/* Floating particles */}
          <AnimatePresence>
            {isHovered && particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: p.x,
                  y: p.y - 60,
                  scale: p.scale,
                  rotate: p.x > 0 ? 45 : -45
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 pointer-events-none text-3xl z-50 drop-shadow-sm"
              >
                {mem.sticker}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="absolute -top-3 left-1/3 w-1/3 h-6 bg-amber-100/50 backdrop-blur-sm border-x border-dashed border-amber-300 transform -rotate-2 lift-3d group-hover:tape-wiggle-hover"></div>
          <div className={`aspect-square w-full rounded-sm mb-4 flex items-center justify-center relative overflow-hidden lift-3d ${mem.image ? 'bg-transparent' : mem.color}`}>
            {mem.image ? (
              <img src={mem.image} alt={mem.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <span className="text-7xl group-hover:scale-110 transition-transform">{mem.sticker}</span>
            )}
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-700 font-bold tracking-widest bg-white/90 px-2 py-0.5 rounded-full shadow-sm">{mem.date}</span>
          </div>
          <div className="space-y-1 text-center mt-2 lift-3d">
            <h3 className="font-cursive text-2xl text-[#65000b] leading-none">{mem.title}</h3>
            <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-2">Tap to view</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fff1f2] p-6 rounded-sm shadow-md border border-rose-200 flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="absolute -top-3 left-1/3 w-1/3 h-6 bg-amber-100/50 backdrop-blur-sm border-x border-dashed border-amber-300 transform rotate-2"></div>
          <h3 className="font-serif text-xl text-[#65000b] font-bold mb-4 pb-2 border-b border-rose-200 w-full">{mem.title}</h3>
          <p className="text-sm text-stone-700 leading-relaxed font-sans overflow-y-auto custom-scrollbar">{mem.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AmbientEffects() {
  const { globalX, globalY } = useGlobalMouseParallax();

  const dustX = useSpring(useTransform(globalX, [-1, 1], [-40, 40]), { stiffness: 50, damping: 30 });
  const dustY = useSpring(useTransform(globalY, [-1, 1], [-40, 40]), { stiffness: 50, damping: 30 });

  const lightX = useSpring(useTransform(globalX, [-1, 1], [50, -50]), { stiffness: 40, damping: 40 });
  const lightY = useSpring(useTransform(globalY, [-1, 1], [50, -50]), { stiffness: 40, damping: 40 });

  const dustParticles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 30,
      duration: Math.random() * 20 + 20,
      dx: Math.random() * 200 - 100,
      dy: Math.random() * -300 - 100,
      drot: Math.random() * 360,
      opacity: Math.random() * 0.5 + 0.1, // Use opacity for depth instead of blur
    }));
  }, []);

  return (
    <>
      <motion.div style={{ x: dustX, y: dustY }} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {dustParticles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-rose-200/40 ambient-dust"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--drot': `${p.drot}deg`,
              '--duration': `${p.duration}s`,
              '--delay': `-${p.delay}s`,
            } as any}
          />
        ))}
      </motion.div>
      <motion.div style={{ x: lightX, y: lightY }} className="fixed inset-0 pointer-events-none z-0 overflow-hidden light-leak">
        <div className="absolute top-0 left-0 w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,rgba(255,228,205,0.15)_0%,transparent_50%)]"></div>
      </motion.div>
    </>
  );
}

type PhysicsBalloon = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
};

// Load all 5 balloon color variants
const BALLOON_SOURCES: HTMLImageElement[] = [];
const BALLOON_PATHS = [
  '/balloon  1.png',
  '/balloon  2.png',
  '/balloon  3.png',
  '/balloon 4.png',
  '/balloon  5.png',
  '/purple balloon.png',
];
let balloonsReadyCount = 0;
let ALL_BALLOONS_READY = false;

BALLOON_PATHS.forEach((path, idx) => {
  const img = new Image();
  img.src = path;
  img.onload = () => {
    balloonsReadyCount++;
    if (balloonsReadyCount === BALLOON_PATHS.length) ALL_BALLOONS_READY = true;
  };
  BALLOON_SOURCES[idx] = img;
});

// Cache keyed by "colorIndex-size" for each unique (color, diameter) combo
const BALLOON_SPRITE_CACHE = new Map<string, HTMLCanvasElement>();
function getBalloonSprite(colorIndex: number, radius: number): HTMLCanvasElement | null {
  if (!ALL_BALLOONS_READY) return null;

  const size = Math.round(radius * 2);
  const cacheKey = `${colorIndex}-${size}`;
  let cached = BALLOON_SPRITE_CACHE.get(cacheKey);
  if (cached) return cached;

  const srcImg = BALLOON_SOURCES[colorIndex];
  const aspect = srcImg.naturalHeight / srcImg.naturalWidth;
  const w = size + 4;
  const h = Math.round(w * aspect);

  const offscreen = document.createElement('canvas');
  offscreen.width = w;
  offscreen.height = h;
  const octx = offscreen.getContext('2d')!;
  octx.drawImage(srcImg, 0, 0, w, h);

  BALLOON_SPRITE_CACHE.set(cacheKey, offscreen);
  return offscreen;
}

// Fisher-Yates shuffle helper
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Cap the maximum number of live balloons to prevent runaway frame drops
const MAX_BALLOONS = 60;

export function BalloonPhysicsOverlay({ spawnEvents, onSecretClick }: { spawnEvents: { x: number, y: number, count: number, id: number, hasSecret?: boolean }[], onSecretClick?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const secretBalloonsContainerRef = useRef<HTMLDivElement>(null);
  const secretClickHandlersRef = useRef<(() => void) | undefined>(onSecretClick);
  secretClickHandlersRef.current = onSecretClick;
  const balloonsRef = useRef<PhysicsBalloon[]>([]);
  const nextId = useRef(0);
  const processedIds = useRef<Set<number>>(new Set());
  const canvasSize = useRef({ w: 0, h: 0 });

  useEffect(() => {
    if (spawnEvents.length === 0) return;

    for (const event of spawnEvents) {
      if (processedIds.current.has(event.id)) continue;
      processedIds.current.add(event.id);

      const currentCount = balloonsRef.current.length;
      const spawnCount = Math.min(event.count, MAX_BALLOONS - currentCount);
      if (spawnCount <= 0) continue;

      // Build a shuffled color assignment so colors are evenly distributed
      // and same-color balloons don't cluster together
      const colorSlots: number[] = [];
      for (let i = 0; i < spawnCount; i++) {
        colorSlots.push(i % 5); // Normal balloons only use first 5 colors
      }
      shuffleArray(colorSlots);

      if (event.hasSecret && spawnCount > 0) {
        // Ensure one of them is the secret purple balloon
        colorSlots[Math.floor(Math.random() * spawnCount)] = 5;
      }

      for (let i = 0; i < spawnCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        balloonsRef.current.push({
          id: nextId.current++,
          x: event.x + (Math.random() - 0.5) * 40,
          y: event.y + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 8 + 24,
          colorIndex: colorSlots[i],
        });
      }
    }

    // Trim processedIds to avoid unbounded memory growth
    if (processedIds.current.size > 200) {
      const ids = Array.from(processedIds.current);
      processedIds.current = new Set(ids.slice(-100));
    }
  }, [spawnEvents]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Resize handler — only triggers on actual window resize, not every frame
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvasSize.current = { w, h };
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const { w, h } = canvasSize.current;
      ctx.clearRect(0, 0, w, h);
      const balloons = balloonsRef.current;
      const len = balloons.length;

      // Physics update
      for (let i = 0; i < len; i++) {
        const b = balloons[i];
        b.vy -= 0.15; // buoyancy
        b.vx *= 0.98; // air friction
        b.vy *= 0.98;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < b.radius) { b.x = b.radius; b.vx *= -0.8; }
        if (b.x > w - b.radius) { b.x = w - b.radius; b.vx *= -0.8; }
      }

      // Spatial grid collision — avoids O(n²) by only checking neighbours
      const CELL = 80; // cell size slightly larger than max balloon diameter (64px)
      const cols = Math.ceil(w / CELL) + 1;
      const grid = new Map<number, number[]>();

      for (let i = 0; i < len; i++) {
        const b = balloons[i];
        const cx = Math.floor(b.x / CELL);
        const cy = Math.floor(b.y / CELL);
        const key = cy * cols + cx;
        const cell = grid.get(key);
        if (cell) cell.push(i);
        else grid.set(key, [i]);
      }

      // Check collisions only within neighbouring cells
      grid.forEach((indices, key) => {
        const cy = Math.floor(key / cols);
        const cx = key - cy * cols;

        for (let ncx = cx; ncx <= cx + 1; ncx++) {
          for (let ncy = cy - 1; ncy <= cy + 1; ncy++) {
            const nkey = ncy * cols + ncx;
            const neighbours = nkey === key ? indices : grid.get(nkey);
            if (!neighbours) continue;

            for (const i of indices) {
              const startJ = nkey === key ? indices.indexOf(i) + 1 : 0;
              for (let jIdx = startJ; jIdx < neighbours.length; jIdx++) {
                const j = neighbours[jIdx];
                const b1 = balloons[i];
                const b2 = balloons[j];
                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const distSq = dx * dx + dy * dy;
                const minDist = b1.radius + b2.radius;

                if (distSq < minDist * minDist && distSq > 0) {
                  const dist = Math.sqrt(distSq);
                  const overlap = minDist - dist;
                  const invDist = 1 / dist;
                  const nx = dx * invDist;
                  const ny = dy * invDist;

                  const sepX = nx * overlap * 0.5;
                  const sepY = ny * overlap * 0.5;
                  b1.x -= sepX; b1.y -= sepY;
                  b2.x += sepX; b2.y += sepY;

                  const p = 1.2 * (nx * (b1.vx - b2.vx) + ny * (b1.vy - b2.vy)) * 0.5;
                  b1.vx -= p * nx;
                  b1.vy -= p * ny;
                  b2.vx += p * nx;
                  b2.vy += p * ny;
                }
              }
            }
          }
        }
      });

      // Render using pre-rendered sprites & filter out off-screen balloons
      let writeIdx = 0;
      const secretBalloons: PhysicsBalloon[] = [];
      for (let i = 0; i < len; i++) {
        const b = balloons[i];
        if (b.y < -120) continue; // skip off-screen, don't copy to output

        const sprite = getBalloonSprite(b.colorIndex, b.radius);
        if (sprite) {
          ctx.drawImage(sprite, b.x - sprite.width / 2, b.y - sprite.height / 2);
        }

        if (b.colorIndex === 5) secretBalloons.push(b);
        balloons[writeIdx++] = b; // compact in-place (avoids splice & filter allocation)
      }
      balloons.length = writeIdx;

      // Update interactive DOM elements for secret balloons
      const container = secretBalloonsContainerRef.current;
      if (container) {
        while (container.children.length < secretBalloons.length) {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.cursor = 'pointer';
          div.style.borderRadius = '50%';
          // slight padding to make it easier to click
          div.style.transform = 'translate(-10px, -10px)';
          div.onpointerdown = (e) => {
            e.preventDefault(); // Prevent accidental dragging
            if (secretClickHandlersRef.current) secretClickHandlersRef.current();
          };
          container.appendChild(div);
        }
        while (container.children.length > secretBalloons.length) {
          container.removeChild(container.lastChild!);
        }

        for (let i = 0; i < secretBalloons.length; i++) {
          const b = secretBalloons[i];
          const div = container.children[i] as HTMLElement;
          div.style.left = `${b.x - b.radius}px`;
          div.style.top = `${b.y - b.radius}px`;
          div.style.width = `${b.radius * 2 + 20}px`;
          div.style.height = `${b.radius * 2 + 20}px`;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[200]"
      />
      <div ref={secretBalloonsContainerRef} className="fixed inset-0 pointer-events-none z-[201] [&>*]:pointer-events-auto" />
    </>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [curDayIndex, setCurDayIndex] = useState<number>(0);
  const [isBirthdayToday, setIsBirthdayToday] = useState<boolean>(false);

  // Interactive UI states
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [reasonsShowCount, setReasonsShowCount] = useState<number>(12);
  const [shuffledReasons, setShuffledReasons] = useState(() => loveReasons.map((text, idx) => ({ text, id: idx + 1 })));
  const [searchReasonQuery, setSearchReasonQuery] = useState<string>("");
  const [flippedReasons, setFlippedReasons] = useState<Record<number, boolean>>({});
  const [clickedTwin, setClickedTwin] = useState<string | null>(null);
  const [curSongIndex, setCurSongIndex] = useState<number>(() => getDayIndex(songsDataset.length));
  const [spotifyTrackId, setSpotifyTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [balloonSpawns, setBalloonSpawns] = useState<{ x: number, y: number, count: number, id: number, hasSecret?: boolean }[]>([]);
  const [showSecretPurpleCard, setShowSecretPurpleCard] = useState<boolean>(false);

  const { globalX, globalY } = useGlobalMouseParallax();

  // Background Parallax for Tab Contents
  const bgFloatX = useSpring(useTransform(globalX, [-1, 1], [-30, 30]), { stiffness: 60, damping: 30 });
  const bgFloatY = useSpring(useTransform(globalY, [-1, 1], [-30, 30]), { stiffness: 60, damping: 30 });

  // Hero section parallax
  const heroRef = useRef<HTMLDivElement>(null);

  // Softer springs: stiffness 150, damping 40 — feels graceful, not snappy
  const emojiX = useSpring(useTransform(globalX, [-1, 1], [-18, 18]), { stiffness: 150, damping: 40 });
  const emojiY = useSpring(useTransform(globalY, [-1, 1], [-18, 18]), { stiffness: 150, damping: 40 });
  const headingX = useSpring(useTransform(globalX, [-1, 1], [-8, 8]), { stiffness: 150, damping: 40 });
  const headingY = useSpring(useTransform(globalY, [-1, 1], [-8, 8]), { stiffness: 150, damping: 40 });
  const btnX = useSpring(useTransform(globalX, [-1, 1], [-4, 4]), { stiffness: 150, damping: 40 });
  const btnY = useSpring(useTransform(globalY, [-1, 1], [-4, 4]), { stiffness: 150, damping: 40 });
  const bgX = useSpring(useTransform(globalX, [-1, 1], [-2, 2]), { stiffness: 150, damping: 40 });
  const bgY = useSpring(useTransform(globalY, [-1, 1], [-2, 2]), { stiffness: 150, damping: 40 });

  // Expanded memory state for cinematic card opening
  const [expandedMemory, setExpandedMemory] = useState<Memory | null>(null);

  // --- Console Easter Egg ---
  useEffect(() => {
    initConsoleEasterEgg();
  }, []);

  useEffect(() => {
    logPageToConsole(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const currentSong = songsDataset[curSongIndex];
    if (!currentSong) return;
    setSpotifyTrackId(null);
    setIsPlaying(false);

    if (currentSong.youtubeId) {
      fetch(`https://api.song.link/v1-alpha.1/links?url=https://youtube.com/watch?v=${currentSong.youtubeId}`)
        .then(res => res.json())
        .then(data => {
          const spotifyUrl = data?.linksByPlatform?.spotify?.url;
          if (spotifyUrl && spotifyUrl.includes('/track/')) {
            const trackId = spotifyUrl.split('/track/')[1].split('?')[0];
            setSpotifyTrackId(trackId);
          }
        })
        .catch(console.error);
    }
  }, [curSongIndex]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nowStr = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const nowIst = new Date(nowStr);
      setIsBirthdayToday(nowIst.getMonth() === 5 && nowIst.getDate() === 14);

      let targetYear = now.getUTCFullYear();
      let targetDate = new Date(Date.UTC(targetYear, 5, 13, 18, 30, 0));
      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(Date.UTC(targetYear + 1, 5, 13, 18, 30, 0));
      }
      const difference = targetDate.getTime() - now.getTime();
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Cinematic confetti burst (button-only, elegant) ---
  const triggerCelebration = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    const colors = ['#65000b', '#c15c5c', '#e6a5a5', '#ffd700', '#fda4af', '#fbbf24', '#f472b6'];

    // Massive initial explosion
    confetti({ particleCount: 100, spread: 360, origin, startVelocity: 50, colors, ticks: 250, gravity: 0.8, zIndex: 150 });

    // Follow-up blasts to cover the screen
    setTimeout(() => {
      confetti({ particleCount: 80, angle: 60, spread: 120, origin: { x: Math.max(0, origin.x - 0.2), y: origin.y }, startVelocity: 45, colors, ticks: 200, gravity: 0.7, zIndex: 150 });
      confetti({ particleCount: 80, angle: 120, spread: 120, origin: { x: Math.min(1, origin.x + 0.2), y: origin.y }, startVelocity: 45, colors, ticks: 200, gravity: 0.7, zIndex: 150 });
    }, 150);

    // Grand finale blast
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 360, origin, startVelocity: 65, colors, ticks: 300, gravity: 0.6, scalar: 1.2, zIndex: 150 });
    }, 400);
  };

  const triggerEmojiConfetti = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Spawn Cakes via canvas-confetti (slow descent)
    // @ts-ignore
    const cake = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '🎂', scalar: 3 }) : 'square';

    const origin = e
      ? { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
      : { x: 0.5, y: 0.9 }; // Fire from bottom center if no event

    confetti({
      particleCount: 25,
      spread: 120,
      origin,
      startVelocity: 35,
      gravity: 0.2, // slow descent
      ticks: 400,
      shapes: [cake],
      scalar: 2.5,
      zIndex: 150
    });

    // If it's a tab-load explosion (no event), add standard confetti too!
    if (!e) {
      const colors = ['#65000b', '#c15c5c', '#e6a5a5', '#ffd700', '#fda4af'];
      confetti({ particleCount: 80, spread: 160, origin, startVelocity: 55, colors, ticks: 250, gravity: 0.8, zIndex: 140 });
    }

    // Spawn Balloons via custom physics engine at different parts of the screen
    // Replace old spawn events instead of accumulating forever
    const now = Date.now();
    const hasSecret = !!e; // Only spawn secret balloon if triggered by explicit click on 🎉
    setBalloonSpawns([
      { x: window.innerWidth * 0.15, y: window.innerHeight + 50, count: 6, id: now },
      { x: window.innerWidth * 0.5, y: window.innerHeight + 100, count: 8, id: now + 1, hasSecret },
      { x: window.innerWidth * 0.85, y: window.innerHeight + 50, count: 6, id: now + 2 }
    ]);
  };

  useEffect(() => {
    if (activeTab === "home") {
      // Small delay to ensure the tab has rendered before firing the explosion
      const timeout = setTimeout(() => {
        triggerEmojiConfetti();
      }, 300);

      // Random confetti explosion every 4s
      const interval = setInterval(() => {
        const origin = {
          x: Math.random() * 0.8 + 0.1, // Random X between 10% and 90%
          y: Math.random() * 0.4 + 0.1  // Random Y between 10% and 50% (top half)
        };
        const colors = ['#65000b', '#c15c5c', '#e6a5a5', '#ffd700', '#fda4af', '#fbbf24', '#f472b6'];
        confetti({
          particleCount: Math.floor(Math.random() * 30) + 40,
          spread: Math.floor(Math.random() * 60) + 60,
          origin,
          startVelocity: Math.random() * 20 + 30,
          colors,
          ticks: 200,
          gravity: 0.8,
          zIndex: 140
        });
      }, 4000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [activeTab]);

  const triggerBouquetMagic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-ignore
    const flower = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '🌸', scalar: 2 }) : 'circle';
    // @ts-ignore
    const leaf = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '🍃', scalar: 2 }) : 'circle';

    confetti({
      particleCount: 40,
      spread: 100,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      startVelocity: 25,
      gravity: 0.6,
      ticks: 300,
      shapes: [flower, leaf, 'circle'],
      colors: ['#fbcfe8', '#fca5a5', '#bef264', '#ffffff'],
      scalar: 1.2,
      zIndex: 150
    });
  };

  const triggerSongMagic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-ignore
    const note1 = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '🎵', scalar: 3 }) : 'circle';
    // @ts-ignore
    const note2 = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '🎶', scalar: 3 }) : 'circle';

    confetti({
      particleCount: 25,
      spread: 80,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      startVelocity: 20,
      gravity: -0.2, // Floats UP!
      ticks: 400,
      shapes: [note1, note2],
      colors: ['#65000b', '#000000', '#4a0404'],
      scalar: 1.5,
      zIndex: 150
    });
  };

  const triggerScrapbookMagic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-ignore
    const sparkle = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '✨', scalar: 3 }) : 'star';

    // Quick flash bang style for photos
    confetti({
      particleCount: 80,
      spread: 360,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      startVelocity: 40,
      gravity: 1.2,
      ticks: 150,
      shapes: [sparkle, 'square'],
      colors: ['#ffffff', '#f1f5f9', '#fef08a'],
      scalar: 1,
      zIndex: 150
    });
  };

  const triggerReasonsMagic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-ignore
    const heart = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '💖', scalar: 2 }) : 'circle';
    // @ts-ignore
    const star = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '⭐', scalar: 2 }) : 'star';

    confetti({
      particleCount: 50,
      spread: 120,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      startVelocity: 35,
      gravity: 0.4,
      ticks: 300,
      shapes: [heart, star],
      scalar: 1.5,
      zIndex: 150
    });
  };

  const triggerTwinsMagic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // @ts-ignore
    const twin = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '👯‍♀️', scalar: 3 }) : 'circle';
    // @ts-ignore
    const sparkle = typeof confetti.shapeFromText === 'function' ? confetti.shapeFromText({ text: '🌟', scalar: 2 }) : 'star';

    // Fire from both edges towards center
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: e.clientY / window.innerHeight },
      startVelocity: 45,
      gravity: 0.8,
      shapes: [twin, sparkle],
      zIndex: 150
    });
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: e.clientY / window.innerHeight },
      startVelocity: 45,
      gravity: 0.8,
      shapes: [twin, sparkle],
      zIndex: 150
    });
  };

  // --- Subtle cursor sparkle trail ---
  useEffect(() => {
    let lastSpawn = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn < 120) return; // throttle: one sparkle per 120ms
      lastSpawn = now;

      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      sparkle.style.left = `${e.clientX - 2}px`;
      sparkle.style.top = `${e.clientY - 2}px`;
      document.body.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 800);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff1f2] text-stone-900 font-sans pb-12 selection:bg-rose-900 selection:text-white relative overflow-hidden">
      <div className="paper-noise-overlay"></div>
      <AmbientEffects />
      <BalloonPhysicsOverlay spawnEvents={balloonSpawns} onSecretClick={() => setShowSecretPurpleCard(true)} />

      {/* Secret Purple Balloon Card Modal */}
      <AnimatePresence>
        {showSecretPurpleCard && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowSecretPurpleCard(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border-2 border-purple-200 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full blur-2xl z-0"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4">🎈</div>
                <h3 className="font-serif text-2xl font-bold text-purple-900 mb-3">A Secret Message!</h3>
                <p className="text-lg text-purple-800 font-serif italic mb-8 leading-relaxed">
                  "You are on the right track. But some secrets are not found but told. "
                </p>
                <button
                  onClick={() => setShowSecretPurpleCard(false)}
                  className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors shadow-lg shadow-purple-600/30 text-sm tracking-wide"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sparkles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
        <div className="absolute top-[20%] left-[10%] w-4 h-4 bg-rose-300 blur-sm rounded-full animate-pulse"></div>
        <div className="absolute top-[50%] right-[15%] w-6 h-6 bg-[#65000b] blur-sm rounded-full animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[25%] w-5 h-5 bg-amber-300 blur-sm rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 relative z-10">

        {/* Header Bar */}
        <header className="flex justify-between items-center bg-white/60 backdrop-blur-md rounded-2xl p-4 mb-8 border border-rose-900/10 shadow-sm">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl inline-block cursor-pointer hover:scale-110"
              onClick={triggerEmojiConfetti}
            >
              🎉
            </motion.span>
            <div>
              <h2 className="font-serif text-2xl text-[#65000b] font-bold">
                Ash's Birthday Universe
              </h2>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <nav className="fixed bottom-0 left-0 right-0 lg:relative lg:col-span-3 bg-white/90 backdrop-blur-md p-2 lg:p-4 lg:rounded-3xl border-t lg:border border-rose-900/10 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)] lg:shadow-sm flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible z-50 h-fit no-scrollbar lg:sticky lg:top-4">
            <p className="hidden lg:block text-xs font-mono tracking-widest uppercase font-bold text-stone-400 px-3 mb-2">
              Menu
            </p>
            {[
              { id: "home", label: "Home", icon: <Home size={18} /> },
              { id: "flower", label: "A Bouquet a Day", icon: <Flower2 size={18} /> },
              { id: "song", label: "Song of the Day", icon: <Music size={18} /> },
              { id: "scrapbook", label: "Memories", icon: <Camera size={18} /> },
              { id: "reasons", label: "100 Reasons", icon: <Heart size={18} /> },
              { id: "games", label: "Games Area", icon: <Trophy size={18} /> },
              { id: "twins", label: "Birthday Twins", icon: <Users size={18} /> }
            ].map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-serif font-semibold whitespace-nowrap transition-colors duration-300 w-full ${activeTab === m.id
                  ? "bg-[#65000b] text-white nav-tab-active"
                  : "text-stone-600 hover:bg-rose-100 hover:text-[#65000b]"
                  }`}
              >
                <motion.span whileHover={{ rotate: 8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  {m.icon}
                </motion.span>
                {m.label}
              </motion.button>
            ))}
          </nav>

          {/* Main Content Area */}
          <main className="lg:col-span-9 transition-all duration-500 pb-24 lg:pb-12">

            <AnimatePresence mode="wait">
              {/* HOME TAB */}
              {activeTab === "home" && (
                <motion.div key="home" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-8 relative">

                  <div
                    ref={heroRef}
                    className="bg-white/80 p-12 rounded-3xl border-2 border-[#65000b]/10 shadow-xl text-center relative overflow-hidden"
                  >
                    <motion.div style={{ x: bgX, y: bgY }} className="absolute -top-20 -left-20 w-64 h-64 bg-[#65000b]/15 rounded-full blur-3xl"></motion.div>
                    <motion.div style={{ x: bgX, y: bgY }} className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></motion.div>

                    {/* Decorative floating sparkles */}
                    {['✦', '♡', '✿', '·', '✧', '❀'].map((s, i) => (
                      <div key={i} className="absolute pointer-events-none text-rose-300/30 hero-sparkle" style={{
                        left: `${12 + i * 15}%`, top: `${10 + (i % 3) * 25}%`,
                        fontSize: `${10 + (i % 3) * 6}px`,
                        '--sparkle-dur': `${22 + i * 5}s`,
                        '--sparkle-delay': `${-i * 4}s`,
                        '--sdx': `${(i % 2 === 0 ? 1 : -1) * (15 + i * 5)}px`,
                        '--sdy': `${-20 - i * 8}px`,
                      } as any}>{s}</div>
                    ))}

                    <div className="relative z-10 flex flex-col items-center space-y-6">
                      <motion.span
                        style={{ x: emojiX, y: emojiY }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block text-6xl mb-4 drop-shadow-sm cursor-pointer hover:scale-110"
                        onClick={triggerEmojiConfetti}
                      >
                        🥳
                      </motion.span>
                      <motion.h1
                        style={{ x: headingX, y: headingY }}
                        className="font-serif text-5xl md:text-7xl text-[#65000b] font-bold leading-tight heading-reveal"
                      >
                        Happy Birthday,<br />Ash!
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed"
                      >
                        Wishing you the most incredible birthday ever! Hope your day is filled with joy, laughter, and lots of cake. You're an amazing person!
                      </motion.p>

                      <motion.button
                        style={{ x: btnX, y: btnY }}
                        onClick={triggerCelebration}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(101, 0, 11, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="mt-4 bg-[#65000b] hover:bg-[#800020] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
                      >
                        More Confetti! 🎉
                      </motion.button>
                    </div>
                  </div>

                  {isBirthdayToday ? (
                    <div className="bg-gradient-to-br from-[#65000b] to-rose-900 text-white p-8 md:p-16 rounded-3xl shadow-2xl text-center relative overflow-hidden perspective-1000 mt-8">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                      <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-pulse-glow"></div>

                      <motion.div
                        initial={{ rotateX: 20, rotateY: -20, scale: 0.8, opacity: 0 }}
                        animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
                        className="relative z-10 preserve-3d"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                          className="lift-3d cursor-pointer hover:scale-110"
                          onClick={triggerEmojiConfetti}
                        >
                          <span className="text-8xl md:text-9xl block mb-6 drop-shadow-2xl">👑</span>
                        </motion.div>

                        <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-200 drop-shadow-lg lift-3d">
                          It's Your Birthday!
                        </h2>

                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                          className="text-xl md:text-2xl font-mono text-rose-100 mb-8 max-w-2xl mx-auto leading-relaxed lift-3d"
                        >
                          The stars have aligned perfectly. June 14th is here.
                          The universe officially celebrates you today!! ✨
                        </motion.p>

                        <motion.button
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={triggerCelebration}
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                          className="bg-white/20 backdrop-blur-md border-2 border-rose-200/50 hover:bg-white/30 text-rose-50 font-bold py-4 px-10 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-colors text-xl lift-3d preserve-3d"
                        >
                          Let's Celebrate! 🎉
                        </motion.button>
                      </motion.div>

                      {/* Floating background aesthetic elements */}
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-32 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl"></motion.div>
                      <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"></motion.div>
                    </div>
                  ) : (
                    <div className="bg-[#65000b] text-white p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                      {/* Breathing glow behind countdown */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.25)_0%,transparent_70%)] breathing-glow"></div>

                      <h3 className="font-serif text-2xl font-bold mb-6 relative z-10 text-rose-100">Countdown to June 14th</h3>
                      <div className="flex justify-center gap-4 relative z-10">
                        {[{ label: "Days", value: timeLeft.days }, { label: "Hours", value: timeLeft.hours }, { label: "Mins", value: timeLeft.minutes }, { label: "Secs", value: timeLeft.seconds }].map((time, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div className="bg-white/10 backdrop-blur-sm w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border border-white/20 mb-2 overflow-hidden">
                              <AnimatePresence mode="popLayout">
                                <motion.span
                                  key={time.value}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -20, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                  className="font-mono text-3xl md:text-5xl font-bold block"
                                >
                                  {time.value.toString().padStart(2, '0')}
                                </motion.span>
                              </AnimatePresence>
                            </div>
                            <span className="text-xs uppercase tracking-widest text-rose-200/80">{time.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* FLOWER TAB (BOUQUET GENERATOR) */}
              {activeTab === "flower" && (
                <motion.div key="flower" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 relative">
                  {/* Continuous Background Petals */}
                  <motion.div style={{ x: bgFloatX, y: bgFloatY }} className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="absolute text-xl" style={{
                        left: `${Math.random() * 100}%`,
                        animation: `float-up ${10 + Math.random() * 15}s linear infinite`,
                        animationDelay: `-${Math.random() * 20}s`,
                        opacity: 0.4
                      }}>
                        🌸
                      </div>
                    ))}
                  </motion.div>

                  <div className="text-center space-y-2 mb-8 relative z-10">
                    <span className="text-4xl inline-block mb-2 cursor-pointer hover:scale-110 transition-transform" onClick={triggerBouquetMagic}>💐</span>
                    <h2 className="font-serif text-3xl text-[#65000b] font-bold">Bouquet Generator</h2>
                    <p className="text-sm text-stone-500 max-w-xl mx-auto">
                      I know you like flowers so until I can give you some in person I hope this will do.Each new bouquet is uniquely generated so no two bouquets are alike.
                    </p>
                  </div>

                  <div className="flex justify-center w-full">
                    <BouquetGenerator />
                  </div>
                </motion.div>
              )}

              {/* SONG TAB */}
              {activeTab === "song" && (
                <motion.div key="song" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 relative">
                  {/* Continuous floating notes */}
                  <motion.div style={{ x: bgFloatX, y: bgFloatY }} className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="absolute text-2xl text-[#65000b]" style={{
                        left: `${Math.random() * 100}%`,
                        animation: `float-up ${12 + Math.random() * 10}s linear infinite`,
                        animationDelay: `-${Math.random() * 15}s`,
                        opacity: 0.15
                      }}>
                        {i % 2 === 0 ? '🎵' : '🎶'}
                      </div>
                    ))}
                  </motion.div>

                  <div className="text-center space-y-2 mb-8 relative z-10">
                    <span className="text-4xl inline-block mb-2 cursor-pointer hover:scale-110 transition-transform" onClick={triggerSongMagic}>🎧</span>
                    <h2 className="font-serif text-3xl text-[#65000b] font-bold">Song of the Day</h2>
                    <p className="text-sm text-stone-500 max-w-xl mx-auto">
                      Yeah it's back! Sorry about discontinuing it. Now we're good for the next {songsDataset.length} days!
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-rose-900/10 shadow-lg text-center relative z-10 float-drift">
                    <div className="inline-block p-4 bg-stone-50 rounded-full mb-6 relative">
                      <div className="absolute inset-0 border border-dashed border-rose-300 rounded-full record-spin"></div>
                      <Music size={48} className={`text-[#65000b] ${isPlaying ? 'animate-pulse' : ''}`} />
                    </div>
                    <h3 className="font-serif text-3xl text-stone-900 font-bold mb-2">
                      {songsDataset[curSongIndex]?.title}
                    </h3>
                    <p className="text-lg font-mono text-[#800020] mb-8">
                      {songsDataset[curSongIndex]?.artist}
                    </p>

                    <div className="flex flex-col xl:flex-row gap-6 w-full max-w-5xl mx-auto mb-6">
                      {/* YouTube Embed */}
                      <div className="flex-1 aspect-video rounded-2xl overflow-hidden border-4 border-stone-100 shadow-inner bg-stone-900 relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
                        {songsDataset[curSongIndex]?.youtubeId ? (
                          isPlaying ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${songsDataset[curSongIndex].youtubeId}?autoplay=1`}
                              title="Song of the Day" className="absolute top-0 left-0 w-full h-full z-10"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                            ></iframe>
                          ) : (
                            <>
                              <img src={`https://img.youtube.com/vi/${songsDataset[curSongIndex].youtubeId}/hqdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-lg">
                                  <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                              </div>
                            </>
                          )
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-stone-500 font-mono text-sm bg-stone-100">Loading YouTube Track...</div>
                        )}
                      </div>

                      {/* Spotify Embed or Button */}
                      <div className="w-full xl:w-80 h-24 xl:h-auto flex items-center justify-center">
                        {spotifyTrackId ? (
                          <iframe
                            src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen={false}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="rounded-2xl shadow-inner min-h-[152px] xl:h-full border-4 border-stone-100"
                          ></iframe>
                        ) : (
                          <a
                            href={`https://open.spotify.com/search/${encodeURIComponent(songsDataset[curSongIndex]?.title + " " + songsDataset[curSongIndex]?.artist)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full min-h-[152px] xl:h-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-sans font-bold p-6 rounded-2xl shadow-inner transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 border-4 border-[#1DB954]"
                          >
                            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z" />
                            </svg>
                            <span className="text-xl">Listen on Spotify</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                      <button
                        onClick={() => setCurSongIndex(Math.floor(Math.random() * songsDataset.length))}
                        className="bg-[#65000b] hover:bg-[#800020] text-rose-50 font-serif font-bold py-3 px-8 rounded-full shadow-md transition-all transform hover:-translate-y-1 text-lg"
                      >
                        🎵 Play Another Song
                      </button>
                    </div>

                    <div className="mt-8 text-sm text-stone-400 font-mono">
                      <p>Track {curSongIndex + 1} of {songsDataset.length}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCRAPBOOK TAB */}
              {activeTab === "scrapbook" && (
                <motion.div key="scrapbook" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 relative">
                  {/* Continuous floating polaroid frames */}
                  <motion.div style={{ x: bgFloatX, y: bgFloatY }} className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="absolute w-24 h-28 bg-white/20 border border-white/40 shadow-sm rounded-sm" style={{
                        left: `${Math.random() * 80 + 10}%`,
                        animation: `float-up ${20 + Math.random() * 20}s linear infinite`,
                        animationDelay: `-${Math.random() * 30}s`,
                        transform: `rotate(${Math.random() * 60 - 30}deg)`,
                        opacity: 0.5
                      }}>
                        <div className="w-full h-20 bg-stone-100/30 m-1"></div>
                      </div>
                    ))}
                  </motion.div>

                  <div className="text-center space-y-2 mb-8 relative z-10">
                    <span className="text-4xl inline-block mb-2 cursor-pointer hover:scale-110 transition-transform" onClick={triggerScrapbookMagic}>📸</span>
                    <h2 className="font-serif text-3xl text-[#65000b] font-bold">Memory Lane</h2>
                    <p className="text-sm text-stone-500 max-w-xl mx-auto">
                      Some cute memories with you that I cherish. Here's to making more!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {memoryTimeline.map((mem, index) => (
                      <MemoryCard key={mem.id} mem={mem} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}


              {/* REASONS TAB */}
              {activeTab === "reasons" && (
                <motion.div key="reasons" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 relative">
                  {/* Continuous floating hearts */}
                  <motion.div style={{ x: bgFloatX, y: bgFloatY }} className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute text-xl" style={{
                        left: `${Math.random() * 100}%`,
                        animation: `float-up ${15 + Math.random() * 10}s linear infinite`,
                        animationDelay: `-${Math.random() * 20}s`,
                        opacity: 0.2
                      }}>
                        {i % 3 === 0 ? '✨' : '💖'}
                      </div>
                    ))}
                  </motion.div>

                  <div className="text-center space-y-2 mb-8 relative z-10">
                    <span className="text-4xl inline-block mb-2 cursor-pointer hover:scale-110 transition-transform" onClick={triggerReasonsMagic}>✨</span>
                    <h2 className="font-serif text-3xl text-[#65000b] font-bold">100 Reasons for uhh something</h2>
                    <p className="text-sm text-stone-500 max-w-xl mx-auto">
                      Click to flip each card and and find out 👀
                    </p>
                  </div>

                  <div className="flex justify-center pt-8 mb-12">
                    {shuffledReasons.slice(0, 1).map((item) => {
                      const isFlipped = flippedReasons[item.id] || false;
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ layout: { type: "spring", stiffness: 45, damping: 14, mass: 1 } }}
                          key={item.id}
                          onClick={() => {
                            if (isFlipped) {
                              // Turn back
                              setFlippedReasons(prev => ({ ...prev, [item.id]: false }));
                              // Shuffle after flip animation finishes
                              setTimeout(() => {
                                setShuffledReasons(prev => {
                                  const arr = [...prev];
                                  for (let i = arr.length - 1; i > 0; i--) {
                                    const j = Math.floor(Math.random() * (i + 1));
                                    [arr[i], arr[j]] = [arr[j], arr[i]];
                                  }
                                  return arr;
                                });
                              }, 300);
                            } else {
                              // Reveal
                              setFlippedReasons(prev => ({ ...prev, [item.id]: true }));
                            }
                          }}
                          className="group perspective-1000 cursor-pointer w-full max-w-sm h-72"
                        >
                          <div className={`relative w-full h-full preserve-3d transition-all duration-500 ${isFlipped ? 'rotate-y-180' : 'hover:-translate-y-2'}`}>

                            {/* Pulse Ring when not flipped */}
                            {!isFlipped && (
                              <div className="absolute inset-0 rounded-3xl pulse-ring pointer-events-none z-0"></div>
                            )}

                            {/* Front of card (Hidden reason) */}
                            <div className="absolute inset-0 backface-hidden bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(101,0,11,0.15)] border border-rose-100 flex flex-col items-center justify-center text-center z-10 hover:shadow-[0_30px_60px_rgba(244,63,94,0.3)] transition-shadow">
                              <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                              <span className="text-6xl mb-6 drop-shadow-md">💌</span>
                              <span className="font-mono text-lg text-stone-400 font-bold tracking-widest uppercase mb-2">Come on babes</span>
                              <span className="text-sm text-stone-500 bg-rose-50 px-4 py-1.5 rounded-full font-serif italic">Tap me to draw a card</span>
                            </div>

                            {/* Back of card (Revealed reason) */}
                            <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#fff1f2] to-white p-8 rounded-3xl shadow-2xl flex flex-col justify-center items-center text-center overflow-y-auto custom-scrollbar border ${item.text.includes("Not all who floats") ? "border-red-300 bg-red-50/40" : "border-rose-200"}`}>
                              <div className={`flex justify-between items-center text-xs font-mono w-full mb-4 ${item.text.includes("Not all who floats") ? "text-red-400" : "text-rose-300"}`}>
                                <span>Reason #{item.id}</span><span>{item.text.includes("Not all who floats") ? "🎈" : "💫"}</span>
                              </div>
                              <p className={`whitespace-pre-line text-lg md:text-xl leading-relaxed italic font-serif my-auto ${item.text.includes("Not all who floats") ? "text-[#800020]" : "text-[#65000b]"}`}>"{item.text}"</p>
                              <span className={`text-[10px] font-mono mt-4 uppercase tracking-widest ${item.text.includes("Not all who floats") ? "text-red-300" : "text-stone-400"}`}>Tap to shuffle</span>
                            </div>

                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}


              {/* GAMES TAB */}
              {activeTab === "games" && (
                <motion.div key="games" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <InteractiveGames />
                </motion.div>
              )}

              {/* TWINS TAB */}
              {activeTab === "twins" && (
                <motion.div key="twins" initial={{ opacity: 0, x: 60, rotateY: -4 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -60, rotateY: 4 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 relative py-12 -mt-12">
                  <motion.div style={{ x: bgFloatX, y: bgFloatY }} className="absolute inset-0 spotlight-sweep rounded-3xl z-[-1] opacity-70"></motion.div>

                  <div className="text-center space-y-2 mb-8 relative z-10">
                    <span className="text-4xl inline-block mb-2 cursor-pointer hover:scale-110 transition-transform" onClick={triggerTwinsMagic}>👯‍♀️</span>
                    <h2 className="font-serif text-3xl text-[#65000b] font-bold">Birthday Twins</h2>
                    <p className="text-sm text-stone-500 max-w-xl mx-auto">
                      Some famous people who share your June 14th birthday!
                      Click on a card to learn more about your famous birthday twins. Coz I learned more about you from them
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                    {twinsDataset.map((twin) => {
                      const isFlipped = clickedTwin === twin.name;
                      return (
                        <div
                          key={twin.name}
                          onClick={() => setClickedTwin(isFlipped ? null : twin.name)}
                          className="group perspective-1000 cursor-pointer h-80"
                        >
                          <div className={`relative w-full h-full preserve-3d transition-all duration-500 ${isFlipped ? 'rotate-y-180 scale-105' : 'hover:-translate-y-3 hover:rotate-2 hover:scale-105'}`}>

                            {/* Front of card */}
                            <div className="absolute inset-0 backface-hidden bg-white p-4 pb-6 rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(244,63,94,0.2)] border border-stone-200/80 flex flex-col polaroid-shadow transition-shadow">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:translate-x-full transition-all duration-1000"></div>
                              <div className="w-full h-48 bg-stone-100 mb-3 rounded overflow-hidden relative border border-stone-200">
                                {twin.image ? (
                                  <img src={twin.image} alt={twin.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-4xl bg-rose-50 text-rose-200">👤</div>
                                )}
                              </div>
                              <h3 className="font-serif text-lg text-center text-[#65000b] font-bold mt-auto line-clamp-2 leading-tight">{twin.name}</h3>
                            </div>

                            {/* Back of card */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fff1f2] p-6 rounded-sm shadow-md border border-rose-200 flex flex-col justify-start items-center text-center overflow-y-auto custom-scrollbar">
                              <h3 className="font-serif text-xl text-[#65000b] font-bold mb-3 pb-2 border-b border-rose-200 w-full shrink-0 mt-auto">{twin.name}</h3>
                              <p className="text-xs text-stone-700 leading-relaxed font-sans shrink-0">{twin.description}</p>
                              <span className="mt-4 text-[10px] uppercase tracking-widest text-[#65000b] font-mono font-bold shrink-0 mb-auto">June 14th</span>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
