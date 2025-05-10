import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome to our store IntelliHome! How can I help you?", sender: 'ai', suggestions: ["Price", "Store Policy", "Refund Policy", "Order Status", "Contact Us", "Shipping", "Warranty", "Product Details"] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
    setLoading(true);

    let aiResponse = "I'm thinking...";

    try {
      const response = await axios.post("http://localhost:5000/chat", { message });
      aiResponse = response.data.response || "Sorry, I couldn't provide an answer. Can I assist you with something else?";
    } catch (error) {
      aiResponse = "Sorry, I couldn't provide an answer. Can I assist you with something else?";
      console.error("Error:", error);
    }

    const suggestions = ["Price", "Store Policy", "Refund Policy", "Order Status", "Contact Us", "Shipping", "Warranty", "Product Details"];

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: aiResponse, sender: 'ai', suggestions }
    ]);
    setLoading(false);
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 p-4">
      <div className="max-w-lg w-full p-5 border rounded-lg shadow-2xl bg-white space-y-4">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">IntelliHome Chatbot</h1>
        <div className="space-y-3 overflow-y-auto h-80 mb-4">
          {messages.map((message, index) => (
            <div key={index}>
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl inline-block ${message.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {message.text}
                </div>
              </div>
              {message.suggestions && message.sender === 'ai' && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-200 transition"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="text-gray-500 text-sm">Please wait...</div>}
          <div ref={chatEndRef}></div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
          />
          <Button
            onClick={() => handleSendMessage(input)}
            className="bg-purple-600 text-black px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
