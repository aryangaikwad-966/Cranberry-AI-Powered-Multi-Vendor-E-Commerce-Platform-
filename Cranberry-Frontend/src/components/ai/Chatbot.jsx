import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Minimize2 } from 'lucide-react';
import { useAIChat } from '../../hooks/useAI';
import { Button } from '../ui/button';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, isTyping, streamingResponse } = useAIChat();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingResponse]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const quickActions = [
    'Help me find a laptop',
    'Track my order',
    'Best deals today',
  ];

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-24 z-[9999] w-14 h-14 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          data-testid="chatbot-toggle"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-24 z-[9999] w-[380px] h-[520px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 flex flex-col overflow-hidden animate-slideUp"
          data-testid="chatbot-window"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0071E3] to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900">AI Assistant</h3>
                <p className="text-xs text-slate-500">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                data-testid="chatbot-minimize"
              >
                <Minimize2 className="h-4 w-4 text-slate-500" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                data-testid="chatbot-close"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[#0071E3] text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Streaming response */}
            {isTyping && streamingResponse && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-slate-100 text-slate-900 rounded-bl-md">
                  <p className="text-sm whitespace-pre-wrap">{streamingResponse}</p>
                  <span className="inline-block w-1.5 h-4 bg-[#0071E3] animate-pulse ml-0.5" />
                </div>
              </div>
            )}
            
            {/* Typing indicator */}
            {isTyping && !streamingResponse && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-slate-100 rounded-bl-md">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-slate-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                    data-testid={`quick-action-${action.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isTyping}
                className="flex-1 h-11 px-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#0071E3] rounded-xl transition-all outline-none text-sm disabled:opacity-50"
                data-testid="chatbot-input"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="h-11 w-11 p-0 bg-[#0071E3] hover:bg-[#0077ED] rounded-xl"
                data-testid="chatbot-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
