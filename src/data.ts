import songsDataRaw from '../songs_data.json';

export interface Song {
  title: string;
  artist: string;
  youtubeId: string;
  category: "soft" | "upbeat" | "vibes";
}

import imgEveryday from './images/everyday.png';
import imgJester from './images/jester.png';
import imgJust from './images/just.png';
import imgLateNight from './images/late night.png';
import imgSurprise from './images/surprise.png';
import imgVoice from './images/voice.png';

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  sticker: string;
  color: string;
  rotation: string;
  image?: any;
}

export interface Flower {
  name: string;
  scientific: string;
  meaning: string;
  personality: string;
  color: string;
  bgGradient: string;
  illustrationType: "rose" | "tulip" | "sunflower" | "lavender" | "cherry" | "peony" | "lily";
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  sticker: string;
  color: string;
  greeting: string;
  surpriseMsg: string;
}

export interface Twin {
  name: string;
  description: string;
  image: string;
}


export const songsDataset: Song[] = songsDataRaw as Song[];


export const flowersDataset: Flower[] = [
  {
    name: "Tulips",
    scientific: "Tulipa",
    meaning: "Perfect, deep, and unconditional joy.",
    personality: "Ash with all your health problems you still are a happy person and refreshingly honest.",
    color: "#ff6b8b",
    bgGradient: "from-pink-100 to-rose-200",
    illustrationType: "tulip"
  },
  {
    name: "Peonies",
    scientific: "Paeonia",
    meaning: "A prosperous life, cozy vibes, and luxury.",
    personality: "Ash enjoys soft, beautiful Pinterest aesthetics and luxury self-care, carrying her deep warmth beautifully.",
    color: "#fca5a5",
    bgGradient: "from-rose-100 to-red-100",
    illustrationType: "peony"
  },
  {
    name: "Lavender",
    scientific: "Lavandula",
    meaning: "Serenity, calmness, and lifelong friendship.",
    personality: "Your calming presence is a refuge. You quiet my thoughts and make everyone feel incredibly secure and home.",
    color: "#a78bfa",
    bgGradient: "from-purple-100 to-indigo-100",
    illustrationType: "lavender"
  },
  {
    name: "Cherry Blossoms",
    scientific: "Prunus serrulata",
    meaning: "Delicate feminine charm, renewal, and magic.",
    personality: "Ash brings a soft, starry-eyed magic wherever she steps, lighting up the entire crowd with sweet elegance.",
    color: "#fbcfe8",
    bgGradient: "from-pink-100 to-purple-100",
    illustrationType: "cherry"
  },
  {
    name: "Roses",
    scientific: "Rosa rubiginosa",
    meaning: "Prettiest aesthetic vibes, playfulness, and luxury.",
    personality: "A classic, breathtaking beauty, matching your warm aura and carrying yourself with effortless elegance.",
    color: "#f43f5e",
    bgGradient: "from-rose-200 to-pink-300",
    illustrationType: "rose"
  },
  {
    name: "Sunflowers",
    scientific: "Helianthus annuus",
    meaning: "Undying loyalty, joy, and sunny comfort.",
    personality: "You have a playful sunshine vibe that immediately chases away any gloominess. You are our bright safe haven.",
    color: "#eab308",
    bgGradient: "from-amber-100 to-yellow-200",
    illustrationType: "sunflower"
  },
  {
    name: "Lilies",
    scientific: "Lilium",
    meaning: "Pure soulfulness, nobility, and majestic grace.",
    personality: "Amanpreet possesses a pristine, refined heart of gold that treats everyone with absolute gentleness.",
    color: "#e2e8f0",
    bgGradient: "from-slate-100 to-zinc-200",
    illustrationType: "lily"
  }
];



export const memoryTimeline: Memory[] = [
  {
    id: "m1",
    date: "The Prankster",
    title: "The first time you tricked me",
    description: "That one time when you convinced me you used to live in Patna. You had me bamboozled for a solid 10 minutes. I was actually about to ask you where in Patna your house was. I can't believe I fell for it lol.",
    sticker: "✨",
    color: "bg-rose-50",
    rotation: "-rotate-2",
    image: imgJester
  },
  {
    id: "m2",
    date: "Late Night Chats",
    title: "Talking Until Sunrise",
    description: "When the rest of the world fell fast asleep, but we stayed up talking about random stuff, flirting, and deepest thoughts, under the quiet sky.",
    sticker: "🌙",
    color: "bg-purple-50",
    rotation: "rotate-3",
    image: imgLateNight
  },
  {
    id: "m3",
    date: "The Surprise",
    title: "First time I heard your voice",
    description: "I don't know how to describe it but it was the most beautiful sound I'd ever heard. That story of your lil cousin getting his pp stuck in zip lol. I was dying. It still makes me laugh when I think about it.",
    sticker: "🎵",
    color: "bg-pink-50",
    rotation: "-rotate-3",
    image: imgVoice
  },
  {
    id: "m4",
    date: "The Golden Moment",
    title: "When you surprised me with your intellect",
    description: "You just guessed where I lived just from some random images I sent you. Like??? How smart are you? It was damn impressive.",
    sticker: "🧸",
    color: "bg-purple-50",
    rotation: "rotate-1",
    image: imgSurprise
  },
  {
    id: "m5",
    date: "Everyday Comfort",
    title: "How much I cherish boring conversations with you",
    description: "No matter how chaotic or exhausting my day gets, I find an oasis in the most mundane conversations with you.",
    sticker: "🌸",
    color: "bg-rose-50",
    rotation: "-rotate-2",
    image: imgEveryday
  },
  {
    id: "m6",
    date: "Just You",
    title: "First time when you said I love you",
    description: "It was so unbelievable. More so because I'm the first guy you ever said it to. I am honored. I still have the screenshot lol",
    sticker: "💖",
    color: "bg-rose-50",
    rotation: "rotate-3",
    image: imgJust
  }
];

export const loveReasons: string[] = [
  "Good Girl.\nLoL gottem tap again.",
  "You were there when I was sad and alone during a festival even when you were in a hospital",
  "You have a bubbly personality that I find adorable",
  "You cared about your friend when she was depressed and took intiative. Thanks to that I have another friend",
  "You have forgiven every single one of my fuckups and mistakes from day 1",
  "You have an excellent sense of humor sometimes.Though your pranks are terrible jk",
  "You are almost always available. Atleast you used to. But I get it coz of your health issues and all.",
  "I enjoy talking to you.",
  "That you never fail to hold a special, loving place in your heart for the small things.",
  "How incredibly cozy and safe it feels when we share our secret world together.",
  "Your gorgeous, beautiful hair that looks like a cascade of silk.",
  "How you make me want to level up, innovate, and always keep our connection incredibly fun and premium.",
  "The way you tell a story or explain a topic is quite fun and amusing.",
  "How you forget the biggest details about things I constantly mention is infuriatingly cute.",
  "The way you sometimes get unexpectedly flirty is cute",
  "That you are an amazing muse, inspiring great aesthetic dreams.",
  "You send me reels 69% of the time when asked.",
  "Your stunning and irresistibly kissable lips.",
  "How loyal you are to your friends.",
  "Your bhondu moolchand pfp on instagram makes me laugh.",
  "Hearing you laugh for the first time was so beautiful. That story of your lil cousin getting his pp stuck in zip lol",
  "The adorable way you get pouty or angry and bothered sometimes.",
  "How you make every conversation and meme-exchange a battle.",
  "The quiet strength you hold inside your soft, delicate soul you never share with me.",
  "When you struggle to give a compliment.",
  "The fact that you'll wear a maid dress for me.",
  "That you are tiny and smol 5'2\" yet still think you can beat me. Cute.",
  "Your gorgeous Punjabi roots that render your grace so regal, my Sikh princess.",
  "I need your excellent fashion sense to dress me up",
  "I love the fact that I'm the first guy you've said I love you to.",
  "That one time when you thought you could out spam me lol.",
  "That you turn me on so much sometimes. Idk how you do it.",
  "I need to kiss you and make love to you as soon as possible.",
  "I like your kinks are complementary to mine",
  "That I can be myself around you.",
  "I like writing you letters.",
  "That you get so jealous when I talk to other girls",
  "You also don't like confrontations like me",
  "You have very beautiful hands.",
  "You promised to buy me icecream",
  "You have made a lot of boring days in my life less boring",
  "When you strategically ignore me for some unknown reason",
  "The way my heart races with excitement whenever your notification pops up.",
  "How we can converse for hours about everything and absolutely nothing at once.",
  "Your incredible intelligence and classy wisdom that sometimes surprises me.",
  "The way you made me a talkative person, I was never like this before.",
  "How you make any distance feel so small because you occupy my mind.",
  "The incredible way you tell a story",
  "The way you always show up even after a bad day",
  "How much you love your mom and naani",
  "The way you try despite everything against you.",
  "How you make me feel so valued, energized, and lucky just to be in your orbit.",
  "The types of reels you like are so unfunny hahahah",
  "I don't need to see you to know you are beautiful",
  "The fact that you are born in June",
  "How you are comforting and sweet",
  "The funny face filter you used once",
  "The random 'babe' you drop.",
  "The fact that I am here writing 100 reasons why",
  "All this just to hide some hints of for a mystery game smh.",
  "You are emotionally independent in a healthy way.",
  "You would be an awesome girlfriend tbh",
  "You don't try to dominate conversations, and that's refreshing.",
  "Movies with my girliee.",
  "Wanted to flex some web dev skills.",
  "That you are my favorite notifications and my absolute favorite conversationalist.",
  "Your patience with my chaotic outbursts, always calming me with sweet attention.",
  "Maybe this will convince you to send me a cute picture of yours",
  "Gotta set the bar high tbh",
  "Now that my college's over, I got nothing better to do. Except you.",
  "Trying to beat the princess dress as a birthday surprise. Tough to beat I know.",
  "So that you'll have to one up me on my birthday. Hehe",
  "Had to express my gratitude for all the heart reactions to the good morning and good night texts.",
  "Amanpreet Kaur is a really pretty and cool name.",
  "To be honest I am running out of ideas.",
  "I have to hide a clue here somewhere.",
  "Your beautiful confidence when you talk about things you love and are passionate about.",
  "You are a dancer.",
  "You are possessive. Kinda hot tbh.",
  "You have a great taste in music.",
  "You are the kind of person people write love letters about without meaning to.",
  "You make me feel less alone in the world.",
  "You've heard more of my overthinking than anyone should ever have to.",
  "You're proof that someone's personality can be beautiful enough to fall in love with.",
  "You have this annoying talent of becoming the first person I want to tell things to.",
  "You made me understand why people write poetry, and unfortunately for you, I chose long emails instead.",
  "You somehow became part of my routine without ever feeling routine.",
  "You make me feel seen, and that's a rarer gift than people realize.",
  "You make waiting worth it.",
  "How you've shown me how effortless, soft, and luxurious an amazing friendship can feel.",
  "You never make me feel unwelcome, even on days when I don't have anything interesting to say.",
  "Your beautiful, bright soul that inspires me to be a better person every second of my life.",
  "That you gave me your attention out of eight billion options.",
  "The gorgeous, peaceful, and rare way our frequencies sync up in every chat.",
  "You're thoughtful in a very quiet way. You don't show off how much you care—you just do.",
  "You make people feel important when they're talking to you.",
  "You're surprisingly good at handling chaos while pretending you're not handling chaos.",
  "You don't lose your composure easily, and I really admire that about you.",
  "You have a very comforting presence, even through a screen.",
  "You're one of the most emotionally intelligent people I've ever met.",
  "Not all who floats are the same. You should pop that one when you go home."
];


export function getDayIndex(length: number): number {
  const date = new Date();
  const dayOfYear = date.getDate() + (date.getMonth() * 31);
  return dayOfYear % length;
}



export const twinsDataset: Twin[] = [
  {
    "name": "Donald Trump",
    "description": "Him? Really? That would explain a lot. LoL just kidding. Just kidding. Crazy coincidence tho",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29_%28cropped%29%282%29.jpg/330px-Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29_%28cropped%29%282%29.jpg"
  },
  {
    "name": "Che Guevara",
    "description": "Ernesto 'Che' Guevara was an Argentine Marxist revolutionary. A major figure of the Cuban Revolution, his stylized visage has become a countercultural symbol. Tbh you two couldn't be more unlike.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Che_Guevara_-_Guerrillero_Heroico_by_Alberto_Korda.jpg/330px-Che_Guevara_-_Guerrillero_Heroico_by_Alberto_Korda.jpg"
  },
  {
    "name": "Steffi Graf",
    "description": "Stefanie Maria Graf is a German former professional tennis player. She was ranked as the world No. 1 in women's singles for a record 377 weeks. Dunno how good you are at tennis. You should give it a try just in case. ",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg/330px-Steffi_Graf_in_Hamburg_2010_%28cropped%29.jpg"
  },
  {
    "name": "Harriet Beecher Stowe",
    "description": "Harriet Elisabeth Beecher Stowe was an American author and abolitionist. She came from the religious Beecher family. Idk nothing about her. Maybe you'll look like her when you get old.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Beecher-Stowe.jpg/330px-Beecher-Stowe.jpg"
  },
  {
    "name": "Alois Alzheimer",
    "description": "Alois Alzheimer was a German psychiatrist and neuropathologist. He is credited with identifying the first published case of Alzheimer's disease. I was about to make a joke about something similar between him and you but I forgot.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Alois_Alzheimer_002.jpg/330px-Alois_Alzheimer_002.jpg"
  },
  {
    "name": "Karl Landsteiner",
    "description": "Karl Landsteiner was an Austrian-American biologist, physician, and immunologist. He is noted for distinguishing the main blood groups, enabling safe blood transfusions. He had a truly be positive attitude.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Karl_Landsteiner_nobel.jpg"
  },
  {
    "name": "Andrey Markov",
    "description": "Andrey Andreyevich Markov was a Russian mathematician celebrated for his pioneering work in stochastic processes, laying the groundwork for Markov chains. You disappearing mid convo is a stochastic process.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Andrei_Markov.jpg/330px-Andrei_Markov.jpg"
  },
  {
    "name": "Alonzo Church",
    "description": "Alonzo Church was an American computer scientist, mathematician, logician, and philosopher who made major contributions to mathematical logic and theoretical computer science. Now you'll have to study computer science. Lmao.",
    "image": "https://upload.wikimedia.org/wikipedia/en/a/a6/Alonzo_Church.jpg"
  }
];
