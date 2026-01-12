import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Send,
  Bot,
  User,
  Heart,
  Phone,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  showCrisisResources?: boolean;
  suggestions?: string[];
}

// Crisis keywords that trigger emergency resources
const crisisKeywords = [
  "suicide", "suicidal", "kill myself", "end my life", "want to die",
  "don't want to live", "better off dead", "no reason to live",
  "self-harm", "hurt myself", "cutting", "overdose"
];

// Wellness conversation prompts and responses
const conversationFlow = {
  greeting: {
    messages: [
      "Hi there! 👋 I'm your wellness companion. I'm here to check in with you and offer support.",
      "How are you feeling today? You can share as much or as little as you'd like.",
    ],
    suggestions: ["I'm doing okay", "Not great today", "I'm struggling", "Feeling anxious"],
  },
  
  responses: {
    positive: [
      "That's wonderful to hear! 🌟 It's great that you're taking time to check in with yourself.",
      "I'm so glad you're feeling okay! What's been going well for you lately?",
      "That's great! Remember, acknowledging the good days is just as important as navigating the tough ones.",
    ],
    neutral: [
      "Thank you for sharing. Some days are just 'okay' days, and that's perfectly valid.",
      "I hear you. Would you like to talk about what's on your mind, or would you prefer some calming exercises?",
    ],
    struggling: [
      "I'm really sorry you're going through a difficult time. Thank you for trusting me with this. 💙",
      "It takes courage to acknowledge when we're struggling. I'm here with you.",
      "I hear you, and your feelings are completely valid. Let's take this one step at a time.",
    ],
    anxious: [
      "Anxiety can feel overwhelming. Thank you for sharing this with me. 💙",
      "I understand anxiety can be really difficult. Let's try to ground ourselves together.",
      "You're not alone in feeling this way. Would you like to try a quick breathing exercise?",
    ],
  },

  copingStrategies: {
    anxiety: [
      "**Try the 5-4-3-2-1 grounding technique:** Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      "**Box breathing can help:** Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 4 times.",
      "**Progressive muscle relaxation:** Tense and release each muscle group, starting from your toes up to your head.",
    ],
    depression: [
      "**Start small:** Even getting out of bed or taking a shower counts as an accomplishment.",
      "**Reach out to someone:** A friend, family member, or therapist. Connection helps.",
      "**Gentle movement:** A short walk outside can help shift your mood, even just for a few minutes.",
    ],
    stress: [
      "**Take a break:** Step away from what's stressing you, even for 5 minutes.",
      "**Write it down:** Sometimes getting thoughts out of your head onto paper helps.",
      "**Prioritize:** What's the ONE thing you can focus on right now?",
    ],
    general: [
      "**Practice self-compassion:** Speak to yourself like you would to a good friend.",
      "**Stay hydrated and nourished:** Basic needs matter more than we realize.",
      "**Connect with nature:** Even looking at trees or sky through a window can help.",
    ],
  },

  followUp: [
    "Would you like to tell me more about what's going on?",
    "Is there anything specific that's been weighing on you?",
    "What would feel most helpful for you right now?",
    "Would you like some coping strategies, or do you just need someone to listen?",
  ],

  closing: [
    "Remember, it's okay to not be okay. You're doing the best you can, and that's enough. 💙",
    "Thank you for checking in today. Taking care of your mental health is a sign of strength.",
    "You matter, and your well-being matters. I'm always here when you need to talk.",
    "Be gentle with yourself today. You deserve kindness, especially from yourself.",
  ],
};

// Simple sentiment analysis
const analyzeSentiment = (text: string): "positive" | "neutral" | "struggling" | "anxious" | "crisis" => {
  const lowerText = text.toLowerCase();
  
  // Check for crisis keywords first
  if (crisisKeywords.some(keyword => lowerText.includes(keyword))) {
    return "crisis";
  }
  
  // Check for negative patterns BEFORE positive (to catch "not great", "not okay", etc.)
  if (lowerText.match(/not great|not good|not okay|not fine|not well|could be better/)) {
    return "struggling";
  }
  
  // Check for anxiety
  if (lowerText.match(/anxious|anxiety|worried|panic|scared|nervous|overwhelmed|can't breathe|stressed|stress/)) {
    return "anxious";
  }
  
  // Check for struggling/depression
  if (lowerText.match(/struggling|depressed|sad|hopeless|empty|lonely|tired|exhausted|can't cope|terrible|awful|horrible|worst|crying|numb|bad|rough|hard|difficult|tough|down|low/)) {
    return "struggling";
  }
  
  // Check for positive - only if no negatives matched
  if (lowerText.match(/\b(good|great|okay|fine|better|happy|well|wonderful|amazing|fantastic|positive)\b/) && 
      !lowerText.match(/not\s/)) {
    return "positive";
  }
  
  return "neutral";
};

// Get random item from array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate AI response based on user input
const generateResponse = (userMessage: string, messageCount: number): Omit<Message, "id" | "timestamp"> => {
  const sentiment = analyzeSentiment(userMessage);
  
  // Crisis response
  if (sentiment === "crisis") {
    return {
      role: "assistant",
      content: "I'm really concerned about what you've shared. Please know that you're not alone, and there is help available right now. Your life matters. 💙\n\n**Please reach out to a crisis helpline:**",
      showCrisisResources: true,
    };
  }
  
  // First response after greeting
  if (messageCount <= 2) {
    const responseCategory = conversationFlow.responses[sentiment] || conversationFlow.responses.neutral;
    const response = getRandomItem(responseCategory);
    const followUp = getRandomItem(conversationFlow.followUp);
    
    return {
      role: "assistant",
      content: `${response}\n\n${followUp}`,
      suggestions: sentiment === "anxious" 
        ? ["Yes, I'd like coping strategies", "I just need to vent", "Tell me about breathing exercises"]
        : sentiment === "struggling"
        ? ["I want to talk about it", "I'd like some suggestions", "Just listen please"]
        : ["Tell me more", "I'd like some tips", "That's all for now"],
    };
  }
  
  // Provide coping strategies if requested
  if (userMessage.toLowerCase().match(/strateg|tip|help|exercise|breathing|suggest|cope|coping/)) {
    let strategies: string[];
    if (userMessage.toLowerCase().includes("breath")) {
      strategies = conversationFlow.copingStrategies.anxiety;
    } else if (analyzeSentiment(userMessage) === "anxious") {
      strategies = conversationFlow.copingStrategies.anxiety;
    } else if (analyzeSentiment(userMessage) === "struggling") {
      strategies = conversationFlow.copingStrategies.depression;
    } else {
      strategies = conversationFlow.copingStrategies.general;
    }
    
    const strategy = getRandomItem(strategies);
    return {
      role: "assistant",
      content: `Here's something that might help:\n\n${strategy}\n\nWould you like to try this, or would you prefer a different suggestion?`,
      suggestions: ["This is helpful, thanks", "Give me another suggestion", "I'd like to talk instead"],
    };
  }
  
  // Listening/venting response
  if (userMessage.toLowerCase().match(/vent|listen|just need|talk about/)) {
    return {
      role: "assistant",
      content: "I'm here to listen. Take your time and share whatever feels right. There's no judgment here. 💙",
    };
  }
  
  // Closing response
  if (userMessage.toLowerCase().match(/thank|that's all|enough|bye|goodbye|done/)) {
    const closing = getRandomItem(conversationFlow.closing);
    return {
      role: "assistant",
      content: `${closing}\n\nFeel free to come back anytime you need support. Take care! 🌱`,
      suggestions: ["Start a new check-in", "Track my mood", "Find a therapist"],
    };
  }
  
  // General supportive response for ongoing conversation
  const supportiveResponses = [
    "Thank you for sharing that with me. It sounds like you're carrying a lot right now.",
    "I hear you. Your feelings are valid, and it's okay to feel this way.",
    "That sounds really challenging. How long have you been feeling this way?",
    "I appreciate you opening up. Is there anything specific that triggered these feelings?",
    "You're being really brave by talking about this. What do you think might help you feel a bit better?",
  ];
  
  return {
    role: "assistant",
    content: getRandomItem(supportiveResponses),
    suggestions: ["I'd like some coping tips", "Just keep listening", "That's all for now"],
  };
};

const WellnessCheckin = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation
  useEffect(() => {
    startNewConversation();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewConversation = () => {
    setMessages([]);
    setIsTyping(true);
    
    // Send greeting messages with delay
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: conversationFlow.greeting.messages[0],
          timestamp: new Date(),
        },
      ]);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: "2",
            role: "assistant",
            content: conversationFlow.greeting.messages[1],
            timestamp: new Date(),
            suggestions: conversationFlow.greeting.suggestions,
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }, 500);
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Generate AI response after delay
    setTimeout(() => {
      const response = generateResponse(content, messages.length);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        timestamp: new Date(),
        ...response,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Start a new check-in") {
      startNewConversation();
    } else if (suggestion === "Track my mood") {
      window.location.href = "/mood-tracker";
    } else if (suggestion === "Find a therapist") {
      window.location.href = "/find-support";
    } else {
      sendMessage(suggestion);
    }
  };

  return (
    <Layout>
      <div className="py-8 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Heart className="w-4 h-4" />
                <span>Here for you</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
                How are you feeling?
              </h1>
              <p className="text-muted-foreground text-sm">
                A safe space to talk about what's on your mind
              </p>
            </motion.div>

            {/* Chat Container */}
            <Card className="border-border overflow-hidden">
              {/* Messages */}
              <div className="h-[50vh] overflow-y-auto p-4 space-y-4 bg-muted/20">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "assistant" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-accent/10 text-accent"
                      }`}>
                        {message.role === "assistant" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === "assistant"
                            ? "bg-card border border-border rounded-tl-sm"
                            : "bg-primary text-primary-foreground rounded-tr-sm"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {/* Crisis Resources */}
                          {message.showCrisisResources && (
                            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Crisis Resources</span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <a href="tel:988" className="flex items-center gap-2 text-foreground hover:text-primary">
                                  <Phone className="w-4 h-4" />
                                  <span><strong>988</strong> - Suicide & Crisis Lifeline (US)</span>
                                </a>
                                <a href="sms:741741" className="flex items-center gap-2 text-foreground hover:text-primary">
                                  <Phone className="w-4 h-4" />
                                  <span>Text <strong>HOME</strong> to <strong>741741</strong> - Crisis Text Line</span>
                                </a>
                                <a href="tel:1-800-273-8255" className="flex items-center gap-2 text-foreground hover:text-primary">
                                  <Phone className="w-4 h-4" />
                                  <span><strong>1-800-273-8255</strong> - National Suicide Prevention</span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Suggestion Chips */}
                        {message.suggestions && message.role === "assistant" && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.suggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button type="submit" disabled={!input.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startNewConversation}
                    title="Start new conversation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-muted-foreground mb-3">
                This AI companion provides supportive conversation but is not a replacement for professional help.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/find-support">
                    <Heart className="w-4 h-4 mr-1" />
                    Find a Therapist
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/mood-tracker">
                    Track Your Mood
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WellnessCheckin;

