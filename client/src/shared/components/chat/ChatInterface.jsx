import React, { useState, useEffect, useRef } from 'react';
import {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useClearChatHistoryMutation,
  useGetSuggestedQuestionsQuery,
} from '../../../modules/chat/chatApi';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // RTK hooks
  const { data: chatHistory, refetch: refetchHistory } = useGetChatHistoryQuery(undefined, { skip: !isOpen });
  const { data: suggestedQuestions } = useGetSuggestedQuestionsQuery(undefined, { skip: !isOpen });
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [clearChat, { isLoading: clearing }] = useClearChatHistoryMutation();

  // Initialize greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = chatHistory?.user?.name || 'Guest';
      simulateTyping(`Hi ${userName}! 👋 I'm your shopping assistant. How can I help you today?`);
    }
  }, [isOpen, chatHistory]);

  // Sync messages with backend history
  useEffect(() => {
    if (chatHistory?.messages) {
      setMessages(chatHistory.messages);
    }
  }, [chatHistory]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Typing simulation
  const simulateTyping = async (message) => {
    setIsTyping(true);
    const delay = Math.random() * 1000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    setMessages(prev => [...prev, { text: message, sender: 'bot' }]);
    setIsTyping(false);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(prev => !prev);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
    if (!isOpen) refetchHistory();
  };

  // Send user message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    setInputMessage('');
    setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);

    try {
      const { data } = await sendMessage({ text: trimmed }).unwrap();
      await simulateTyping(data?.reply || "I'm here to assist you!");
      refetchHistory();
    } catch (err) {
      console.error('Error sending message:', err);
      await simulateTyping("Oops! Something went wrong. Please try again.");
    }
  };

  // Suggested question click
  const handleQuestionClick = async (question) => {
    setMessages(prev => [...prev, { text: question, sender: 'user' }]);

    try {
      const { data } = await sendMessage({ text: question }).unwrap();
      await simulateTyping(data?.reply || "I'm here to assist you!");
      refetchHistory();
    } catch (err) {
      console.error('Error handling question:', err);
    }
  };

  // Clear chat
  const handleClearChat = async () => {
    try {
      await clearChat().unwrap();
      setMessages([]);
      refetchHistory();
    } catch (err) {
      console.error('Error clearing chat:', err);
    }
  };

  return (
    <div>
      {/* Chat bubble toggle */}
      {!isOpen && (
        <div
          className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-full cursor-pointer shadow-lg fixed bottom-4 right-4 transition-transform transform hover:scale-110 animate-bounce"
          onClick={toggleChat}
          role="button"
          aria-label="Toggle chat"
        >
          <span className="text-2xl">💬</span>
        </div>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40" onClick={toggleChat}></div>

          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-lg shadow-xl border border-gray-300 z-50 overflow-hidden transition-transform duration-500">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <h4 className="text-lg font-semibold">Shopping Assistant</h4>
              </div>
              <button
                className="text-white hover:text-gray-200 text-xl"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                ✖
              </button>
            </div>

            {/* Suggested Questions */}
            {suggestedQuestions?.length > 0 && (
              <div className="px-4 py-0.5 bg-gray-50 border-b border-gray-300">
                <p className="text-sm text-gray-600 mb-1.5">Suggested questions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(item.question)}
                      className="px-3 py-1.5 text-sm bg-white border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Body */}
            <div className="p-4 bg-white h-60 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 p-3 bg-gray-100 text-gray-500 rounded-lg w-20">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-300">
              <div className="flex gap-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[calc(100%-3rem)]"
                />
                <button
                  type="submit"
                  className="px-3 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim() || isTyping || sending}
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    transform="rotate(90)"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <div className="p-2 border-t border-gray-300 flex justify-end">
                <button
                  onClick={handleClearChat}
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={clearing}
                >
                  Clear Chat
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;