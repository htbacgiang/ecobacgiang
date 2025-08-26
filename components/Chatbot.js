import { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useSelector } from 'react-redux';
import styles from './Chatbot.module.css';

const Chatbot = () => {
  // Get user session and auth info
  const { data: session } = useSession();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUser = session?.user || authUser;

  // Function to get personalized greeting
  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "";
    
    if (hour < 12) {
      timeGreeting = "buổi sáng";
    } else if (hour < 18) {
      timeGreeting = "buổi chiều";
    } else {
      timeGreeting = "buổi tối";
    }
    
    // Cá nhân hóa lời chào dựa trên thông tin user
    if (currentUser && currentUser.name) {
      const userName = currentUser.name.split(' ').pop(); // Lấy tên gọn
      return `🌱 Chào ${timeGreeting}! Em là Mai từ Eco Bắc Giang! 😊 Em rất vui được hỗ trợ anh/chị ${userName} hôm nay! Anh/chị có cần tư vấn gì không ạ?`;
    }
    
    return `🌱 Chào ${timeGreeting}! Em là Mai từ Eco Bắc Giang! 😊 Em rất vui được hỗ trợ anh chị hôm nay!`;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getPersonalizedGreeting(),
      isBot: true,
      timestamp: new Date()
    }
  ]);

  // Cập nhật lời chào khi user thay đổi
  useEffect(() => {
    setMessages(prev => [
      {
        id: 1,
        text: getPersonalizedGreeting(),
        isBot: true,
        timestamp: new Date()
      },
      ...prev.slice(1) // Giữ các tin nhắn khác
    ]);
  }, [currentUser?.name]); // Chỉ chạy khi tên user thay đổi
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          // Truyền thông tin user để chatbot nhận biết
          user_email: currentUser?.email || null,
          user_phone: currentUser?.phone || null,
          session_id: session?.user?.id || authUser?.id || `guest_${Date.now()}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isBot: true,
          timestamp: new Date(),
          source: data.source,
          intent: data.intent,
          confidence: data.confidence
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "😅 Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau nhé! 🔧",
        isBot: true,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className={`${styles.toggleButton} ${isOpen ? styles.open : ''}`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? '✨' : '💖'}
      </button>

      {/* Chatbot Window */}
      <div className={`${styles.chatbotWindow} ${isOpen ? styles.visible : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.statusDot}></span>
            🌱 Mai - Eco Bắc Giang
          </div>
          <button
            onClick={toggleChatbot}
            className={styles.closeButton}
            aria-label="Close chatbot"
          >
            💤
          </button>
        </div>

        {/* Messages Area */}
        <div className={styles.chatbox}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${
                message.isBot ? styles.botMessageContainer : styles.userMessageContainer
              }`}
            >
              <div
                className={`${styles.message} ${
                  message.isBot ? styles.botMessage : styles.userMessage
                } ${message.isError ? styles.errorMessage : ''}`}
              >
                <div className={styles.messageText}>{message.text}</div>
                <div className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                  {message.source && (
                    <span className={styles.source}>
                      {message.source === 'local' ? ' 🤖' : ' 🧠'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className={`${styles.messageContainer} ${styles.botMessageContainer}`}>
              <div className={`${styles.message} ${styles.botMessage} ${styles.loadingMessage}`}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.messageText}>🤔 Đang suy nghĩ...</div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <div className={styles.inputContainer}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="💭 Nhập câu hỏi của anh/chị..."
              className={styles.messageInput}
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              {isLoading ? '💫' : '🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
