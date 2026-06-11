/**
 * Console Easter Egg System
 * --------------------------
 * Prints beautifully styled messages in the browser console for each page,
 * and after visiting enough pages, presents a 3-question interactive challenge.
 *
 * The challenge questions:
 *   1. What ice cream flavor she promised to buy me? → mint choco chip
 *   2. Her reddit username? → mid_night_glitch
 *   3. The date when she first said I love you? → 08/02/2026
 *
 * After completing the quiz the user is told to come back at midnight.
 * Between 00:00 – 00:30 IST (if the game was completed), the console
 * congratulates her and after 15 s triggers a 30 s CSS glitch on the site.
 */

import { loveReasons, memoryTimeline, flowersDataset, twinsDataset } from './data';
import { triggerGlitchEffect } from './glitchEffect';

// ─── Styling helpers ──────────────────────────────────────────────
const STYLES = {
  title: 'font-size:24px; font-weight:bold; color:#65000b; text-shadow:2px 2px 4px rgba(101,0,11,0.2); font-family:Georgia,serif; padding:8px 0;',
  subtitle: 'font-size:16px; color:#800020; font-style:italic; font-family:Georgia,serif; padding:4px 0;',
  body: 'font-size:13px; color:#4a4a4a; font-family:system-ui,sans-serif; line-height:1.6; padding:2px 0;',
  accent: 'font-size:14px; color:#e11d48; font-weight:bold; font-family:Georgia,serif;',
  reason: 'font-size:12px; color:#65000b; font-family:system-ui,sans-serif; padding:1px 0; border-left:3px solid #fda4af; padding-left:8px; margin-left:4px;',
  memory: 'font-size:13px; color:#7c2d12; font-family:Georgia,serif; font-style:italic; padding:2px 0;',
  flower: 'font-size:13px; color:#9d174d; font-family:Georgia,serif; padding:2px 0;',
  twin: 'font-size:13px; color:#4338ca; font-family:system-ui,sans-serif; padding:2px 0;',
  divider: 'font-size:10px; color:#fda4af; padding:4px 0;',
  question: 'font-size:16px; color:#7c3aed; font-weight:bold; font-family:Georgia,serif; background:linear-gradient(90deg,#f5f3ff,#ede9fe); padding:8px 12px; border-radius:8px; border-left:4px solid #7c3aed;',
  success: 'font-size:18px; color:#059669; font-weight:bold; font-family:Georgia,serif; background:#ecfdf5; padding:8px 12px; border-radius:8px; border-left:4px solid #059669;',
  error: 'font-size:14px; color:#dc2626; font-family:system-ui,sans-serif; padding:4px 0;',
  hint: 'font-size:12px; color:#9ca3af; font-style:italic; font-family:system-ui,sans-serif; padding:2px 0;',
  secret: 'font-size:20px; font-weight:bold; color:#7c3aed; text-shadow:1px 1px 3px rgba(124,58,237,0.3); font-family:Georgia,serif; padding:8px 0;',
  banner: 'font-size:28px; font-weight:bold; background:linear-gradient(135deg,#65000b,#e11d48,#7c3aed); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-family:Georgia,serif; padding:12px 0;',
};

const DIVIDER = '━'.repeat(50);

// ─── Per-page console messages ─────────────────────────────────────
function logHomePage() {
  console.clear();
  console.log('%c🎂 HAPPY BIRTHDAY ASH! 🎂', STYLES.banner);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%c Welcome to the Birthday Universe Console!', STYLES.title);
  console.log('%cYou found the hidden world behind the curtain.', STYLES.subtitle);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cEvery page has its own secret message here.', STYLES.body);
  console.log('%cKeep exploring... and maybe you\'ll find something special at the end.', STYLES.body);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%c🎉 June 14th — The day the universe got a little more beautiful. ', STYLES.accent);
  console.log('%cHere\'s to the most amazing person I know.', STYLES.body);
  console.log('%cMay this year bring you everything you deserve and more.', STYLES.body);
  console.log('%cAnd may you never stop being the incredible human you are.', STYLES.body);
}

function logFlowerPage() {
  console.clear();
  console.log('%c💐 A Bouquet of Words 💐', STYLES.title);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cIf I could give you flowers every day, I would.', STYLES.subtitle);
  console.log('%cBut since I can\'t (yet), here are some words that bloom just for you:', STYLES.body);
  console.log('%c' + DIVIDER, STYLES.divider);

  const poeticLines = [
    '🌸 You are the kind of beautiful that flowers are jealous of.',
    '🌺 Your smile has this annoying habit of making my whole day better.',
    '🌷 Like tulips in spring, you bring color to the dullest days.',
    '🌻 You radiate warmth like sunflowers chasing the sun.',
    '🌹 Every rose has thorns, but you? You\'re all petals and sweetness.',
    '💮 You\'re proof that the most beautiful things grow from the most unexpected places.',
    '🏵️ The world doesn\'t deserve how gently you exist in it.',
  ];

  poeticLines.forEach(line => {
    console.log('%c' + line, STYLES.flower);
  });

  console.log('%c' + DIVIDER, STYLES.divider);

  console.log('%cFlowers in this bouquet & their meanings for you:', STYLES.subtitle);
  flowersDataset.forEach(f => {
    console.log(`%c🌼 ${f.name} — ${f.meaning}`, STYLES.flower);
  });
}

function logSongPage() {
  console.clear();
  console.log('%c🎵 The Soundtrack of Us 🎵', STYLES.title);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cEvery song reminds me of something about you.', STYLES.subtitle);
  console.log('%cThe melodies that play when I think of you:', STYLES.body);
  console.log('%c' + DIVIDER, STYLES.divider);

  const songPoems = [
    '🎶 Some songs feel like they were written about us.',
    '🎵 Late night playlists that I associate with your voice.',
    '🎧 Every beat, every lyric — they all lead back to you.',
    '🎹 If our story had a soundtrack, it would be a masterpiece.',
    '🎼 Music sounds better when I\'m talking to you.',
  ];

  songPoems.forEach(line => {
    console.log('%c' + line, STYLES.body);
  });

  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%c♪ Fun fact: I carefully picked every single song in that playlist.', STYLES.hint);
  console.log('%c♪ Some of them have hidden meanings. Pay attention to the lyrics. 😉', STYLES.hint);
}

function logScrapbookPage() {
  console.clear();
  console.log('%c📸 Memory Lane — Behind the Scenes 📸', STYLES.title);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cThese aren\'t just memories. They\'re proof that magic is real.', STYLES.subtitle);
  console.log('%c' + DIVIDER, STYLES.divider);

  memoryTimeline.forEach((mem, i) => {
    console.log(`%c${mem.sticker} Memory #${i + 1}: "${mem.title}"`, STYLES.memory);
    console.log(`%c   ${mem.description}`, STYLES.body);
    console.log('%c   ' + '·'.repeat(40), STYLES.divider);
  });

  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cEvery moment with you is a memory I never want to forget. 💕', STYLES.accent);
  console.log('%cEven the boring ones. Especially the boring ones.', STYLES.body);
}

function logReasonsPage() {
  console.clear();
  console.log('%c💖 100 Reasons — The Complete List 💖', STYLES.title);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cSince you\'re clever enough to check the console,', STYLES.subtitle);
  console.log('%cyou deserve to see all 100 without flipping cards:', STYLES.body);
  console.log('%c' + DIVIDER, STYLES.divider);

  loveReasons.forEach((reason, i) => {
    const num = String(i + 1).padStart(3, ' ');
    console.log(`%c${num}. ${reason}`, STYLES.reason);
  });

  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cAnd honestly? I could write 100 more. 💌', STYLES.accent);
  console.log('%cYou make it embarrassingly easy.', STYLES.body);
}

function logGamesPage() {
  console.clear();
  console.log('%c🎮 Games Area — Developer Notes 🎮', STYLES.title);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cYou found the dev console in the games section!', STYLES.subtitle);
  console.log('%c' + DIVIDER, STYLES.divider);

  const devNotes = [
    '🕹️ Each game was built from scratch, just for you.',
    '🏓 Emoji Pong — because regular pong is boring.',
    '💗 Catch Hearts — catch the ones that fall for you.',
    '🎡 Wheel of Dares — spin it, I dare you.',
    '🧩 Every game has a hidden reward. Did you find them all?',
    '⚡ Fun fact: The balloon physics engine has real collision detection.',
    '💜 There\'s a secret purple balloon. Have you clicked it?',
  ];

  devNotes.forEach(note => {
    console.log('%c' + note, STYLES.body);
  });

  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cP.S. No cheat codes here. You gotta earn those wins! 😤', STYLES.hint);
}

function logTwinsPage() {
  console.clear();
  console.log('%c👯 Birthday Twins — Fun Facts 👯', STYLES.title);
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cPeople born on June 14th are pretty remarkable.', STYLES.subtitle);
  console.log('%cBut none of them hold a candle to you, obviously.', STYLES.body);
  console.log('%c' + DIVIDER, STYLES.divider);

  twinsDataset.forEach(twin => {
    console.log(`%c⭐ ${twin.name}`, STYLES.twin);
    console.log(`%c   ${twin.description}`, STYLES.body);
    console.log('%c   ' + '·'.repeat(40), STYLES.divider);
  });

  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%cJune 14th really does produce legends. 👑', STYLES.accent);
}


// ─── Persistence keys ─────────────────────────────────────────────
const LS_GAME_COMPLETED = 'console-challenge-completed';
const LS_MIDNIGHT_GLITCH_DONE = 'midnight-glitch-done';

// ─── Interactive Challenge System ──────────────────────────────────
interface ChallengeState {
  currentQuestion: number;
  completed: boolean;
  attempts: number;
}

let challengeState: ChallengeState = {
  currentQuestion: 0,
  completed: localStorage.getItem(LS_GAME_COMPLETED) === 'true',
  attempts: 0,
};

// Normalise user answers for flexible matching
function normalise(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/]/g, '') // strip everything except alphanumeric and /
    ;
}

const QUESTIONS = [
  {
    prompt: '🍦 Question 1/3: What ice cream flavor did you promise to buy me?',
    acceptedAnswers: ['mintchocochip', 'mintchocolatechip', 'mintchocchip', 'mintchocochips', 'mintchocolatechips', 'mintchoccochip'],
    hint: 'It is a famous flavor from Baskin Robbins... 🍫🌿',
  },
  {
    prompt: '👾 Question 2/3: What was my Reddit username?',
    acceptedAnswers: ['waifubeeter_', 'u/waifubeeter_'],
    hint: 'It was also my discord username... 🌙💫',
  },
  {
    prompt: '💕 Question 3/3: What date did you first say "I love you" to me? (DD/MM/YYYY)',
    acceptedAnswers: ['08/02/2026', '8/2/2026', '08022026', '8022026', '08/2/2026', '8/02/2026', '08-02-2026', '8-2-2026', '08-2-2026', '8-02-2026', '08.02.2026', '8.2.2026', '08.2.2026', '8.02.2026', '2026/02/08', '2026-02-08', '20260208', '2026.02.08', '2026/2/8', '2026-2-8', '02/08/2026', '2/8/2026', '02082026', '2082026', '02/8/2026', '2/08/2026', '02-08-2026', '2-8-2026', '02-8-2026', '2-08-2026', '02.08.2026', '2.8.2026', '02.8.2026', '2.08.2026', 'February 8, 2026', 'Feb 8, 2026', 'February 08, 2026', 'Feb 08, 2026', '8 February 2026', '8 Feb 2026', '08 February 2026', '08 Feb 2026', 'February 8th, 2026', 'Feb 8th, 2026', '8th February 2026', '8th Feb 2026', '2026 February 8', '2026 Feb 8', '2026 February 08', '2026 Feb 08', 'February 8', 'Feb 8', 'February 08', 'Feb 08', '8 February', '8 Feb', '08 February', '08 Feb', 'February 8th', 'Feb 8th', '8th February', '8th Feb', '8 February.', '8 Feb.', 'Feb. 8', 'Feb. 08', '8-Feb', '08-Feb', 'Feb-8', 'Feb-08', '8_Feb', '08_Feb', 'Feb_8', 'Feb_08'],
    hint: 'A day in February 2026... 📅❤️',
  },
];

function showCurrentQuestion() {
  if (challengeState.completed) {
    const midnightDone = localStorage.getItem(LS_MIDNIGHT_GLITCH_DONE) === 'true';
    if (midnightDone) {
      console.log('%c✅ Thanks for visiting the site and playing the game! 💖', STYLES.success);
    } else if (isMidnightWindow()) {
      console.log(
        '%c🎉 You came at midnight! Now close the console and watch what happens... 👀✨',
        'font-size:16px; color:#e11d48; font-weight:bold; font-style:italic; font-family:Georgia,serif; ' +
        'background:#fff1f2; padding:10px 14px; border-radius:8px; border-left:4px solid #e11d48; margin:8px 0;'
      );
    } else {
      console.log(
        '%cYay you completed the game. Come back at midnight.',
        'font-size:20px; font-weight:bold; color:#7c3aed; font-family:Georgia,serif; ' +
        'background:#f5f3ff; padding:12px 16px; border-radius:10px; border-left:4px solid #7c3aed; margin:8px 0;'
      );
    }
    return;
  }

  const q = QUESTIONS[challengeState.currentQuestion];
  console.log('');
  console.log('%c' + DIVIDER, STYLES.divider);
  console.log('%c' + q.prompt, STYLES.question);
  console.log('%cType your answer: window.__answer("your answer here")', STYLES.hint);
  console.log('%c' + DIVIDER, STYLES.divider);
}

function checkAnswer(userAnswer: string): void {
  if (challengeState.completed) {
    console.log('%c✅ You already aced all the questions! Refresh to see the reward. 🎉', STYLES.success);
    return;
  }

  const q = QUESTIONS[challengeState.currentQuestion];
  const normalisedInput = normalise(userAnswer);
  const isCorrect = q.acceptedAnswers.some(a => normalise(a) === normalisedInput);

  if (isCorrect) {
    challengeState.attempts = 0;
    console.log('%c✨ Correct! ✨', STYLES.success);

    if (challengeState.currentQuestion < QUESTIONS.length - 1) {
      challengeState.currentQuestion++;
      console.log('%cNice one! Here\'s the next question...', STYLES.body);
      showCurrentQuestion();
    } else {
      challengeState.completed = true;
      triggerChallengeComplete();
    }
  } else {
    challengeState.attempts++;
    console.log('%c❌ That\'s not quite right. Try again!', STYLES.error);

    if (challengeState.attempts >= 3) {
      console.log(`%c💡 Hint: ${q.hint}`, STYLES.hint);
    }
  }
}

function triggerChallengeComplete() {
  console.log('');
  console.log('%c' + '🌟'.repeat(25), STYLES.divider);
  console.log('%c🏆 ALL QUESTIONS ANSWERED CORRECTLY! 🏆', STYLES.banner);
  console.log('%c' + '🌟'.repeat(25), STYLES.divider);
  console.log('%cYou really do know everything about us. 💖', STYLES.subtitle);
  console.log('%c' + DIVIDER, STYLES.divider);

  // The big midnight tease
  console.log(
    '%cYay you completed the game. Come back at midnight.',
    'font-size:20px; font-weight:bold; color:#7c3aed; font-family:Georgia,serif; ' +
    'background:#f5f3ff; padding:12px 16px; border-radius:10px; border-left:4px solid #7c3aed; margin:8px 0;'
  );

  // Persist completion
  localStorage.setItem(LS_GAME_COMPLETED, 'true');

  // Dispatch a custom event that App.tsx can listen for
  window.dispatchEvent(new CustomEvent('console-challenge-complete'));
}

// ─── Page log dispatcher ───────────────────────────────────────────
const PAGE_LOGGERS: Record<string, () => void> = {
  home: logHomePage,
  flower: logFlowerPage,
  song: logSongPage,
  scrapbook: logScrapbookPage,
  reasons: logReasonsPage,
  games: logGamesPage,
  twins: logTwinsPage,
};

let visitedPages = new Set<string>();

export function logPageToConsole(pageId: string) {
  const logger = PAGE_LOGGERS[pageId];
  if (logger) {
    logger();
    visitedPages.add(pageId);
  }

  // After the page-specific message, always show the challenge section
  console.log('');
  console.log('%c' + '═'.repeat(50), STYLES.divider);
  console.log('%c🔐 SECRET CONSOLE CHALLENGE 🔐', STYLES.secret);
  console.log('%c' + '═'.repeat(50), STYLES.divider);
  console.log('%cAnswer 3 questions to unlock a hidden secret...', STYLES.body);
  showCurrentQuestion();
}

// ─── Mount the answer function on window ──────────────────────────
export function initConsoleEasterEgg() {
  // Make the answer function globally accessible from the console
  (window as any).__answer = (answer: string) => {
    if (typeof answer !== 'string') {
      console.log('%c⚠️ Please pass a string! Example: window.__answer("your answer")', STYLES.error);
      return;
    }
    checkAnswer(answer);
  };

  // Also add a helper
  (window as any).__hint = () => {
    if (challengeState.completed) {
      console.log('%c✅ No more hints needed — you\'ve completed the challenge! 🎉', STYLES.success);
      return;
    }
    const q = QUESTIONS[challengeState.currentQuestion];
    console.log(`%c💡 ${q.hint}`, STYLES.hint);
  };

  // Print a one-time teaser
  console.log('%c👀 Psst... you found the console!', STYLES.title);
  console.log('%cNavigate to different pages and watch this space. 🔮', STYLES.body);
  console.log('%c' + DIVIDER, STYLES.divider);

  // Kick off midnight watcher
  initMidnightGlitch();
}

// ─── Midnight Glitch Watcher ──────────────────────────────────────
// Checks every 30 s whether the time is between 00:00 and 00:30 IST
// and the game has been completed. If so, congratulate + glitch.
let midnightTimerId: ReturnType<typeof setInterval> | null = null;

function isMidnightWindow(): boolean {
  // Use IST (Asia/Kolkata)
  const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const nowIST = new Date(nowStr);
  const hours = nowIST.getHours();
  const minutes = nowIST.getMinutes();
  return hours === 0 && minutes < 30; // TODO: change back to 30 after testing
}

function runMidnightSequence() {
  // Mark so we don't fire again this session/day
  localStorage.setItem(LS_MIDNIGHT_GLITCH_DONE, 'true');

  // Clear the interval — we're done watching
  if (midnightTimerId !== null) {
    clearInterval(midnightTimerId);
    midnightTimerId = null;
  }

  // Congratulations in the console
  console.clear();
  console.log('');
  console.log('%c' + '🌙'.repeat(25), STYLES.divider);
  console.log(
    '%c🎉 CONGRATULATIONS! 🎉',
    'font-size:28px; font-weight:bold; background:linear-gradient(135deg,#7c3aed,#e11d48,#f59e0b); ' +
    '-webkit-background-clip:text; -webkit-text-fill-color:transparent; font-family:Georgia,serif; padding:12px 0;'
  );
  console.log('%c' + '🌙'.repeat(25), STYLES.divider);
  console.log(
    '%cYou actually came back at midnight! 🥺💖',
    'font-size:18px; color:#7c3aed; font-weight:bold; font-family:Georgia,serif; padding:4px 0;'
  );
  console.log(
    '%cYou really are something special. I can\'t believe you did this.',
    'font-size:14px; color:#4a4a4a; font-family:system-ui,sans-serif; padding:2px 0;'
  );
  console.log(
    '%cNow close the console and watch what happens... 👀✨',
    'font-size:16px; color:#e11d48; font-weight:bold; font-style:italic; font-family:Georgia,serif; ' +
    'background:#fff1f2; padding:10px 14px; border-radius:8px; border-left:4px solid #e11d48; margin:8px 0;'
  );
  console.log('%c' + DIVIDER, STYLES.divider);

  // After 15 seconds trigger the glitch effect for 30 seconds
  setTimeout(() => {
    triggerGlitchEffect(30_000);
    
    // Show the button after the glitch is done (30s + 500ms buffer)
    setTimeout(() => {
      showMidnightReward();
    }, 30_500);
  }, 15_000);
}

function showMidnightReward() {
  const container = document.createElement('div');
  container.id = 'midnight-reward-container';
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.zIndex = '9999999';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = 'rgba(0,0,0,0.8)';
  container.style.backdropFilter = 'blur(10px)';
  container.style.transition = 'opacity 0.5s ease';

  const btn = document.createElement('button');
  btn.innerText = 'Click me';
  btn.style.padding = '15px 40px';
  btn.style.fontSize = '24px';
  btn.style.fontFamily = 'Georgia, serif';
  btn.style.fontWeight = 'bold';
  btn.style.color = '#fff';
  btn.style.background = 'linear-gradient(135deg, #7c3aed, #e11d48)';
  btn.style.border = 'none';
  btn.style.borderRadius = '50px';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(225,29,72,0.3)';
  btn.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  
  btn.onmouseover = () => {
    btn.style.transform = 'scale(1.05)';
    btn.style.boxShadow = '0 0 30px rgba(124,58,237,0.8), 0 0 60px rgba(225,29,72,0.6)';
  };
  btn.onmouseout = () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(225,29,72,0.3)';
  };

  container.appendChild(btn);
  document.body.appendChild(container);

  btn.onclick = () => {
    btn.style.display = 'none';
    
    const iframe = document.createElement('iframe');
    iframe.src = 'https://my.spline.design/play-007poJ1ZkFCGVKWk8ANqNMVz';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    container.appendChild(iframe);

    // Remove everything after 10 seconds
    setTimeout(() => {
      container.style.opacity = '0';
      setTimeout(() => {
        container.remove();
      }, 500);
    }, 10_000);
  };
}

function initMidnightGlitch() {
  const gameCompleted = localStorage.getItem(LS_GAME_COMPLETED) === 'true';
  const alreadyFired = localStorage.getItem(LS_MIDNIGHT_GLITCH_DONE) === 'true';

  if (!gameCompleted || alreadyFired) return;

  // Check immediately
  if (isMidnightWindow()) {
    runMidnightSequence();
    return;
  }

  // Otherwise poll every 30 seconds
  midnightTimerId = setInterval(() => {
    if (isMidnightWindow()) {
      runMidnightSequence();
    }
  }, 30_000);
}
