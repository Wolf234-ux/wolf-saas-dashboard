import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Systems online. Ready to execute your commands, Wolf.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState('programmer');
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  const [isAuthenticated, setIsAuthenticated] = useState(
  !!localStorage.getItem("token")
);
  // Track previous chat logs in the sidebar
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Python Loop Function' },
    { id: 2, title: 'SaaS Marketing Taglines' }
  ]);

  const chatEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    const tokenValue = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      });
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);

    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    // Create a new item in recent history based on the first few words
    if (messages.length === 1) {
      const shortTitle = inputText.split(' ').slice(0, 3).join(' ') + '...';
      setChatHistory(prev => [{ id: Date.now(), title: shortTitle }, ...prev]);
    }

    const userMessage = { role: 'user', content: inputText };
    const conversationHistory = [...messages, userMessage];
    
    setMessages(conversationHistory);
    setInputText('');
    setLoading(true);

    // Setup empty streaming message box
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    abortControllerRef.current = new AbortController();

    try {
      // 🔄 DYNAMIC NETWORK DETECTOR
      // Automatically swaps between localhost (PC) and 10.12.98.231 (Mobile Phone)
      const hostIP = window.location.hostname;

      const response = await fetch(`http://${hostIP}:8000/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          messages: conversationHistory,
          persona: persona
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('Server issue');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const textChunk = decoder.decode(value, { stream: !done });
          accumulatedText += textChunk;
          
          setMessages((prev) => {
            const historyCopy = [...prev];
            historyCopy[historyCopy.length - 1] = {
              role: 'assistant',
              content: accumulatedText
            };
            return historyCopy;
          });
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages((prev) => {
          const historyCopy = [...prev];
          historyCopy[historyCopy.length - 1].content += '\n\n🛑 Generation Terminated by Wolf.';
          return historyCopy;
        });
      } else {
        console.error(err);
        setMessages((prev) => {
          const historyCopy = [...prev];
          historyCopy[historyCopy.length - 1].content = '⚠️ Target server unreachable.';
          return historyCopy;
        });
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleTerminate = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="fullscreen-app">
      <header className="navbar">
        <div className="logo-group">
          <h1>AI SaaS Core v2.5</h1>
          <span className="hunt-tagline">Hey Wolf, ready to hunt? 🐺</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Logout
          </button>

          <div className="status-container">
            <span className="pulse-indicator"></span>
            <span className="status-text">
              ENGINE ACTIVE (QWEN-1.5B)
            </span>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="control-sidebar">
          <div className="sidebar-section">
            <h3>Target Persona</h3>
            <div className="persona-radio-group">
              <button 
                className={`persona-btn ${persona === 'programmer' ? 'active' : ''}`} 
                onClick={() => setPersona('programmer')} 
                disabled={loading}
              >
                💻 Programmer
              </button>
              <button 
                className={`persona-btn ${persona === 'copywriter' ? 'active' : ''}`} 
                onClick={() => setPersona('copywriter')} 
                disabled={loading}
              >
                ✍️ Copywriter
              </button>
            </div>
          </div>

          <div className="sidebar-section history-section">
            <h3>Last Chats</h3>
            <div className="history-list">
              {chatHistory.map((item) => (
                <div key={item.id} className="history-item">
                  💬 {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="workspace-main">
          <div className="chat-box">
            {messages.map((m, i) => (
              <div key={i} className={`msg-wrapper ${m.role === 'user' ? 'user-align' : 'ai-align'}`}>
                <div className={`msg-bubble ${m.role === 'user' ? 'user-style' : 'ai-style'}`}>
                  <span className="bubble-label">{m.role === 'user' ? 'WOLF' : persona.toUpperCase()}</span>
                  <div className="bubble-body">{m.content}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              placeholder={`Send instructions to ${persona}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            
            {loading ? (
              <button type="button" onClick={handleTerminate} className="terminate-btn">
                TERMINATE
              </button>
            ) : (
              <button type="submit" className="hunt-btn">
                HUNT
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
