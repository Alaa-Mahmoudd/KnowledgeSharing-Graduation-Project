import { useState, useRef, useEffect } from 'react';
import { Client } from "@gradio/client";
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

const Chatbot = () => {
  // Chat states
  const [messages, setMessages] = useState([{
    text: "Hello! I'm your AI assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [gradioClient, setGradioClient] = useState(null);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize connection
  useEffect(() => {
    const connectToAPI = async () => {
      try {
        const client = await Client.connect("yazied49/nad");
        setGradioClient(client);
        setConnectionStatus('connected');
      } catch (err) {
        console.error("Connection error:", err);
        setConnectionStatus('disconnected');
        addMessage({
          text: "Connection error. Working in limited mode.",
          sender: 'bot'
        });
      }
    };

    connectToAPI();
  }, []);

  // Enhanced scroll behavior
  const scrollToBottom = debounce((behavior = 'auto') => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 100;

      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior
        });
        setShowNewMessagesButton(false);
        setUnreadCount(0);
      } else if (messages.length > 1) {
        setShowNewMessagesButton(true);
      }
    }
  }, 100);

  useEffect(() => {
    scrollToBottom('smooth');
    return () => scrollToBottom.cancel();
  }, [messages]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !gradioClient) return;

    // Add user message
    addMessage({
      text: inputValue,
      sender: 'user'
    });

    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Get AI response
      const result = await gradioClient.predict("/predict", {
        user_input: inputValue
      });

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      addMessage({
        text: result.data,
        sender: 'bot'
      });
    } catch (err) {
      console.error("API error:", err);
      addMessage({
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot'
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Adjust textarea height dynamically
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  // Handle scroll events
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 100;
      setShowNewMessagesButton(!isNearBottom);

      if (isNearBottom) {
        setUnreadCount(0);
      }
    }
  };

  // Count new messages when not at bottom
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 1) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 100;

      if (!isNearBottom) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <motion.h1
            className="text-2xl font-bold"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            AI Assistant
          </motion.h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                  connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              <span className="text-sm">
                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </span>
            </div>
            {unreadCount > 0 && (
              <motion.span
                className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {unreadCount} new
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto container mx-auto p-4 w-full relative"
        onScroll={handleScroll}
      >
        {/* New messages button */}
        <AnimatePresence>
          {showNewMessagesButton && (
            <motion.button
              onClick={() => scrollToBottom('smooth')}
              className="sticky bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg z-10 hover:bg-blue-600 transition-colors flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Messages
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                whileHover={{ scale: 1.02 }}
              >
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <p className={`text-xs mt-1 text-right ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                  {message.timestamp}
                </p>
              </motion.div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              className="flex justify-start mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none max-w-[70%] border border-gray-200 shadow-sm">
                <div className="flex space-x-2">
                  <div className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '150ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <motion.div
        className="border-t border-gray-200 bg-white p-4 shadow-inner"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden max-h-40 transition-all duration-200"
              rows={1}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className={`absolute right-2 bottom-2 p-2 rounded-full ${isLoading || !inputValue.trim()
                  ? 'text-gray-400'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
                }`}
              whileHover={!isLoading && inputValue.trim() ? { scale: 1.1 } : {}}
              whileTap={!isLoading && inputValue.trim() ? { scale: 0.9 } : {}}
            >
              {isLoading ? (
                <motion.svg
                  className="h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </motion.svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Typing animation styles */}
      <style jsx global>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: #6b7280;
          border-radius: 50%;
          display: inline-block;
          animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        @keyframes typingAnimation {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;