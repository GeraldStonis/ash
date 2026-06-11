import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FLOWERS = [
  'orchid', 'tulip', 'dahlia', 'anemone', 'carnation', 'zinnia',
  'ranunculus', 'sunflower', 'lily', 'daisy', 'peony', 'rose',
];
const ASSET_BASE_URL = 'https://assets.pauwee.com';

interface FlowerPosition {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  size: number;
  flower: string;
}

function generateBouquet() {
  const bushType = Math.floor(Math.random() * 3) + 1;
  const numFlowers = Math.floor(Math.random() * 3) + 10; // 6 to 8 flowers
  
  // Nicely spaced honeycomb-like slots so flowers never heavily overlap
  const SLOTS = [
    { x: 38, y: 44, rotBase: -15 },
    { x: 50, y: 42, rotBase: 0 },
    { x: 62, y: 44, rotBase: 15 },
    { x: 32, y: 54, rotBase: -25 },
    { x: 44, y: 53, rotBase: -5 },
    { x: 56, y: 53, rotBase: 5 },
    { x: 68, y: 54, rotBase: 25 },
    { x: 30, y: 65, rotBase: -35 },
    { x: 41, y: 65, rotBase: -10 },
    { x: 50, y: 67, rotBase: 0 },
    { x: 59, y: 65, rotBase: 10 },
    { x: 70, y: 65, rotBase: 35 },
  ];

  // Shuffle slots
  const shuffledSlots = [...SLOTS].sort(() => Math.random() - 0.5).slice(0, numFlowers);
  const positions: FlowerPosition[] = [];

  for (let i = 0; i < numFlowers; i++) {
    const slot = shuffledSlots[i];
    
    // Add small random jitter (±1.5%) so it doesn't look like a rigid grid
    const x = slot.x + (Math.random() * 3 - 1.5);
    const y = slot.y + (Math.random() * 3 - 1.5);
    
    // Natural rotation
    const rotation = slot.rotBase + (Math.random() * 14 - 7);
    
    const scale = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    const size = 70 + Math.random() * 20; // 70 to 90
    const zIndex = 10 + Math.floor(Math.random() * 30);
    const flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];

    positions.push({
      id: `flower-${Date.now()}-${i}-${Math.random()}`,
      x,
      y,
      rotation,
      scale,
      zIndex,
      size,
      flower
    });
  }
  
  // Sort by Y so flowers in the back render first, but z-index actually handles it mostly.
  return { id: `bouquet-${Date.now()}`, bushType, positions };
}

export default function BouquetGenerator() {
  const [bouquet, setBouquet] = useState<{ id: string, bushType: number, positions: FlowerPosition[] } | null>(null);

  useEffect(() => {
    setBouquet(generateBouquet());
  }, []);

  if (!bouquet) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-md h-[400px] mx-auto bg-[#fff1f2] rounded-3xl shadow-lg overflow-hidden border-2 border-rose-100">
        <div className="absolute inset-0 opacity-20 pointer-events-none scrapbook-paper" />
        
        {/* Bush background */}
        <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={`bush-${bouquet.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={`${ASSET_BASE_URL}/color/bush/bush-${bouquet.bushType}.png`}
              alt="bush background"
              className="w-[120%] h-auto object-cover transform translate-y-12"
            />
          </AnimatePresence>
        </div>

        {/* Flowers container */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={`flowers-${bouquet.id}`} className="absolute inset-0">
              {bouquet.positions.map((pos, index) => (
                <motion.div
                  key={pos.id}
                  initial={{ scale: 0, opacity: 0, x: "-50%", y: "-30%", rotate: pos.rotation - 15 }}
                  animate={{ scale: pos.scale, opacity: 1, x: "-50%", y: "-50%", rotate: pos.rotation }}
                  transition={{ delay: 0.2 + index * 0.08, type: "spring", stiffness: 150, damping: 12 }}
                  className="absolute drop-shadow-md origin-center"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    zIndex: pos.zIndex,
                    width: `${pos.size}px`,
                    height: `${pos.size}px`,
                  }}
                >
                  <img
                    src={`${ASSET_BASE_URL}/color/flowers/${pos.flower}.webp`}
                    alt={pos.flower}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bush top overlay */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={`bushtop-${bouquet.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              src={`${ASSET_BASE_URL}/color/bush/bush-${bouquet.bushType}-top.png`}
              alt="bush top"
              className="w-[120%] h-auto object-cover transform translate-y-12"
            />
          </AnimatePresence>
        </div>
      </div>

      <button 
        onClick={() => setBouquet(generateBouquet())}
        className="mt-8 flex items-center gap-2 bg-[#65000b] hover:bg-[#800020] text-rose-50 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1"
      >
        <span className="text-xl">🌸</span> Generate New Bouquet
      </button>
    </div>
  );
}
