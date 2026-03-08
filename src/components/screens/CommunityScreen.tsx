import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { communityMessages } from '@/data/mockData';
import { Send, Users } from 'lucide-react';

export function CommunityScreen() {
  const [messages, setMessages] = useState(communityMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const userMsgText = newMessage;
    setNewMessage('');
    
    const userMessage = {
      id: `m${messages.length + 1}`,
      user: 'You',
      avatar: '😊',
      message: userMsgText,
      isAI: false,
      timestamp: 'Just now',
    };

    const typingId = `m${messages.length + 2}`;
    const typingMessage = {
      id: typingId,
      user: 'AI Mentor',
      avatar: '🤖',
      message: 'AI Mentor is typing...',
      isAI: true,
      timestamp: 'Just now',
    };

    // Optimistically add user msg and the typing indicator
    setMessages(prev => [...prev, userMessage, typingMessage]);

    try {
      const response = await fetch("https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "community-chat",
          message: userMsgText
        }),
      });

      const data = await response.json();
      const result = typeof data.body === "string" ? JSON.parse(data.body) : data;
      
      const reply = result.reply || "I'm not sure how to answer that.";

      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, message: reply }
          : msg
      ));
    } catch (err) {
      console.error("Community AI Error:", err);
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...msg, message: "AI Mentor is temporarily unavailable." }
          : msg
      ));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Learning Community</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-correct animate-pulse" />
              8 learners online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.isAI ? 'bg-accent/20' : 'bg-muted'
            }`}>
              <span className="text-xl">{msg.avatar}</span>
            </div>
            <div className={`max-w-[75%] ${msg.user === 'You' ? 'items-end' : ''}`}>
              <div className={`flex items-center gap-2 mb-1 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                <span className={`font-bold text-sm ${msg.isAI ? 'text-accent' : 'text-foreground'}`}>
                  {msg.user}
                </span>
                <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
              </div>
              <Card className={`p-3 ${
                msg.isAI 
                  ? 'bg-accent/10 border-accent/30' 
                  : msg.user === 'You'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
              }`}>
                <p className="text-sm">{msg.message}</p>
              </Card>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question or share your progress..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="game-button">
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          🤖 AI Mentor will respond to your questions
        </p>
      </div>
    </div>
  );
}
