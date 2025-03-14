import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStreamResponse = async (message) => {
    const eventSource = new EventSource(`http://localhost:3001/api/chat?message=${encodeURIComponent(message)}`);
    let fullResponse = '';

    eventSource.onmessage = (event) => {
      const { chunk } = JSON.parse(event.data);
      fullResponse += chunk;
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { type: 'bot', content: fullResponse };
        return newMessages;
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsLoading(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    setError(null);
    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input, image: image ? URL.createObjectURL(image) : null }]);

    try {
      if (image) {
        const formData = new FormData();
        formData.append('message', input);
        formData.append('image', image);
        const response = await axios.post('http://localhost:3001/api/chat', formData);
        setMessages(prev => [...prev, { type: 'bot', content: response.data.response }]);
      } else {
        await handleStreamResponse(input);
      }
    } catch (error) {
      setError('Failed to get response. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setInput('');
      setImage(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.image && <img src={msg.image} alt="uploaded" className="message-image" />}
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()}
          className="upload-btn"
        >
          📎
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;