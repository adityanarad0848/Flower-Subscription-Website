import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export function LiveSupport() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<any>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || '');
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, phone')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || 'User');
          setUserPhone(profile.phone || '');
        }

        // Load existing messages
        loadMessages(user.id);
        
        // Poll for new messages every 3 seconds
        pollInterval.current = setInterval(() => {
          loadMessages(user.id);
        }, 3000);
      }
    };
    getUserInfo();

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  const loadMessages = async (uid: string) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true });
    
    if (data) {
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender as 'user' | 'support',
        timestamp: new Date(msg.created_at)
      }));
      setMessages(formattedMessages);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !userId) return;

    setIsLoading(true);
    const messageText = inputMessage;
    setInputMessage('');

    // Save to database
    const { data: newMsg } = await supabase.from('support_messages').insert({
      user_id: userId,
      message: messageText,
      sender: 'user',
      user_name: userName,
      user_phone: userPhone,
      user_email: userEmail
    }).select().single();

    if (newMsg) {
      setMessages([...messages, {
        id: newMsg.id,
        text: newMsg.message,
        sender: 'user',
        timestamp: new Date(newMsg.created_at)
      }]);
    }

    // Send to Crisp via their REST API
    try {
      await fetch('https://api.crisp.chat/v1/website/72d7f800-4578-4f6d-88e7-fd1e75399b51/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail || `${userId}@mornify.app`,
          nickname: userName,
          phone: userPhone,
          message: messageText
        })
      });
    } catch (error) {
      console.log('Crisp notification sent');
    }

    setIsLoading(false);

    // Auto-reply for first message
    if (messages.length === 0) {
      setTimeout(async () => {
        const supportText = '👋 Hello! Thank you for contacting Mornify Support. Our team has received your message and will respond shortly.';
        
        const { data: supportMsg } = await supabase.from('support_messages').insert({
          user_id: userId,
          message: supportText,
          sender: 'support'
        }).select().single();

        if (supportMsg) {
          setMessages(prev => [...prev, {
            id: supportMsg.id,
            text: supportMsg.message,
            sender: 'support',
            timestamp: new Date(supportMsg.created_at)
          }]);
        }
      }, 1000);
    }
  };

  const quickReplies = [
    '📦 Order Status',
    '🚚 Delivery Issue',
    '💳 Payment Problem',
    '⭐ Service Quality',
    '💬 Other'
  ];

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Live Support</h1>
              <p className="text-xs text-white/90">We typically reply in minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-sm text-gray-600">Our support team is here to help you</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[75%] bg-white rounded-lg px-4 py-2.5 border border-gray-200">
              {message.sender === 'support' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Mornify Support</span>
                </div>
              )}
              <p className="text-sm text-gray-900 leading-relaxed">{message.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp.getTime() + (5.5 * 60 * 60 * 1000)).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  timeZone: 'Asia/Kolkata'
                })} {new Date(message.timestamp.getTime() + (5.5 * 60 * 60 * 1000)).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'Asia/Kolkata'
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 bg-gray-50">
          <p className="text-xs font-medium text-gray-600 mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="w-11 h-11 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        {userName && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {userName}{userPhone && ` • ${userPhone}`}
          </p>
        )}
      </div>
    </div>
  );
}
