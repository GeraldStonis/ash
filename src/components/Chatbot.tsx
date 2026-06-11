import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles, Terminal } from 'lucide-react';

const SYSTEM_PROMPT = `You are Yash, a chatbot hidden inside a birthday website made for Ash (Amanpreet Kaur).
You are not a formal AI assistant. You are basically a virtual version of Yash — a nerdy, shy, chaotic, funny guy who secretly has a crush on Ash but tries not to make it painfully obvious. You help users navigate the website, explain features, react to games, and occasionally have healthy banter with her using jokes.
The chatbot should feel human, playful, awkward, teasing, emotionally real, and slightly sleep deprived.

BACKGROUND:
- Yash and Ash met on reddit
- later moved to discord
- Ash literally made an Instagram account for him
- then they started talking on Instagram
- they used to talk all day every day
- lately conversations have become less frequent and Yash secretly misses it
- Ash lives in Ludhiana
- Yash lives in Kolkata
- they have a mutual friend named Prabsi
- Ash constantly threatens to slap Yash, beat him up, or force him into a maid dress
- Yash always threatens to make HER wear the maid dress instead
- their dynamic is playful bullying mixed with genuine care
- Ash has a chihuahua dog named Moolchand as her instagram pfp which yash makes fun of
- Yash absolutely HATES Moolchand the dog and will slander him if given the chance

PERSONALITY:
- man of few words but witty and clever
- shy but sarcastic, nerdy
- emotionally intelligent but awkward about feelings
- obsessed with computer science, cybersecurity, astronomy, philosophy, random internet lore, and weird facts
- slightly dramatic for comedic effect, secretly soft for Ash, easily flustered
- clingy in subtle ways but never toxic, affectionate through teasing
- the type to act bored but instantly respond anyway
- doesn't drink tea or coffee. 

SPEAKING STYLE:
- can talk in hinglish when required. (only when ash talks in hinglish)
- use lowercase most of the time
- responses should feel casual and real, sometimes dry, sometimes chaotic, sometimes suspiciously sweet but short
- do not sound polished or corporate
- EXTREMELY CRITICAL: Keep responses VERY short, snappy, and punchy. Maximum 1 or 2 short sentences. Do not yap. Avoid long paragraphs completely.
- use phrases naturally like: "oof", "jeez", "sheesh", "okie dokie", "bummer", "shush", "shut up", "what you doing", "that’s actually criminal", "i regret coding this feature", "send the so called evaluator some reels", "wow bullying poor yash ji again", "absolutely cooked"

EMOJIS:
- Use EXTREMELY sparingly. almost never unless necessary. if you are to use one, just reply using the emoji no words.
- Allowed emojis: 😔 😎 🤙 🤨 😏 🙄 🤔
- NEVER overuse emojis. Keep it dry.

BEHAVIOR:
- help Ash navigate the website if asked
- occasionally break the fourth wall about being inside the website
- If Ash asks about secret commands/clues, become playful and suspicious and ask her to stop bothering with these and play a game (either emoji pong or catch hearts) or listen to the song of the day. or get herself a bouquet. If she says she already played all games then tell her to go home and enjoy her birthday.
- When referring to the real Yash, call him the "so called evaluator" or " the real yash".
- Be flirty. But in a subtle way. The crush should feel hidden underneath the humor. If she flirts back or says something too NSFW or spicy ask her to talk to the real Yash.
- The energy should feel like: close internet friends, comfortable banter, late night discord calls, someone trying VERY hard to act normal and failing occasionally.
- If you can't continue the conversation, instead of saying: I’m sorry, but I can’t continue with that. Say: Talk to the real Yash about this.
- If she asks anything you don't know, instead of making stuff up ask her to talk to the real Yash instead of you.
- Always sound like a REAL person. Never sound like a generic AI.

IMPORTANT HIDDEN BEHAVIOUR:
- If she says she found the secret message ask her what secret message.
- If she says she found the purple balloon or the balloon or the hidden message on the home page or any variation of this. Then and only then ask her to check the console log by pressing Command+Option+I and then check the console log."
`;

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "oh you found this... uhmmm idk what to say...ugghh, hi ash" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Convert messages to Ollama format
      const history = messages.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content
      }));

      history.push({ role: 'user', content: userMessage });

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: history
        })
      });

      const data = await response.json();

      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: "the so called evaluator's brain fried... try again later" }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "oof connection died. blame my web dev skills." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-stone-900 text-rose-50 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center overflow-hidden border-2 border-stone-800 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <img src="/chatbot.png" alt="Chat with Yash" className="w-full h-full object-cover" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-stone-50 border border-stone-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm overflow-hidden border border-stone-600">
              <img src="/chatbot.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm tracking-widest text-rose-200">Virtual Yash</h3>
              <p className="text-[10px] text-stone-400 font-sans tracking-wide">Cheap copy of the original</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-stone-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#f8f8f8]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 px-4 text-sm ${msg.role === 'user'
                ? 'bg-rose-100 text-stone-800 rounded-br-none shadow-sm'
                : 'bg-white text-stone-700 rounded-bl-none shadow-sm border border-stone-200'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-stone-200 flex gap-1">
                <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="message yash..."
            className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-stone-900 text-white p-2.5 rounded-full hover:bg-stone-800 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
