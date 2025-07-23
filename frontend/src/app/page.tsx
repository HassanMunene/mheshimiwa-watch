"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sun, Moon, ShieldAlert, ChevronRight, Menu,
  X, Send, User, History, ChevronLeft
} from 'lucide-react';
import Image from 'next/image';

interface ChatItem {
  question: string;
  timestamp: string;
  session_id: number;
}

interface ChatSection {
  date: string;
  chats: ChatItem[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSection[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  // Create a reusable API client instance
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await apiClient.get("/chat-history");
        setChatHistory(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();
  }, []);

  // Our theme colors for our Mheshimiwa Chat Bot
  const themeColors = {
    primary: '#046A38', // Kenyan green
    secondary: '#BB0000', // Kenyan red
    accent: '#FCDC0A', // Kenyan yellow
    darkBg: '#1a1a1a',
    darkCard: '#1e1e1e',
    lightBg: '#f5f5f5',
    lightCard: '#ffffff'
  };

  const askAI = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const requestData: { question: string; session_id?: number } = { question: query };
      if (currentSessionId !== null) {
        requestData.session_id = currentSessionId;
      }

      const response = await apiClient.post("/ask", requestData);
      setAnswer(response.data.answer);
      setCurrentSessionId(response.data.session_id);
      // Refresh the chat history
      const historyResponse = await apiClient.get("/chat-history");
      setChatHistory(historyResponse.data);
    } catch (error) {
      setAnswer("Error: Could not get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick actions for sidebar
  const quickActions = [
    {
      icon: <ShieldAlert size={16} />,
      label: "Report Issue",
      action: () => {
        setQuery("How to report government misconduct or corruption");
        setActiveTab('home');
      }
    },
    {
      icon: <History size={16} />,
      label: "Recent Inquiries",
      action: () => {
        setActiveTab('home');
        setQuery("");
        setAnswer("");
        setCurrentSessionId(null);
      }
    },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'} text-${darkMode ? 'white' : 'gray-800'}`}>
      {/* Mobile Sidebar Overlay to create some sort of contrast. */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside className={`fixed lg:static z-30 h-full transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} ${sidebarOpen ? 'left-0' : '-left-64'} ${darkMode ? 'bg-[#1e1e1e]' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${sidebarCollapsed ? 'flex-col gap-2' : ''}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Image src="/assets/mhesh-logo.png" alt="Mhesh-Watch logo" width={24} height={24} className="object-contain" />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Mhesh-Watch
              </h2>
            </div>
          )}

          {sidebarCollapsed && (
            <Image src="/assets/mhesh-logo.png" alt="Mhesh-Watch logo" width={24} height={24} className="object-contain" />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100%-60px)]">
          {/* Quick Actions */}
          <div className="p-4 space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full ${sidebarCollapsed ? 'p-2' : 'p-3'} rounded-lg flex items-center justify-center gap-2 ${darkMode ? 'bg-[#046A38] hover:bg-[#03582d]' : 'bg-[#046A38] hover:bg-[#03582d]'} text-white`}
              >
                {action.icon}
                {!sidebarCollapsed && <span>{action.label}</span>}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4">
            {!sidebarCollapsed && (
              <h3 className="text-sm text-gray-400 mb-3 font-medium">Recent Queries</h3>
            )}
            {chatHistory.map((section) => (
              <div key={section.date} className="mb-6">
                {!sidebarCollapsed && (
                  <h3 className="text-sm text-gray-400 mb-3 font-medium">{section.date}</h3>
                )}
                <div className="space-y-1">
                  {section.chats.map((chat, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(chat.question);
                        setCurrentSessionId(chat.session_id);
                        setActiveTab('home');
                      }}
                      className={`w-full text-left text-sm ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} rounded px-3 py-2 cursor-pointer truncate transition-colors flex items-center gap-2`}
                    >
                      {sidebarCollapsed ? (
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      ) : (
                        chat.question
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-4 space-y-3 border-t border-gray-700">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2'} hover:bg-gray-700 rounded-lg cursor-pointer transition-colors`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <User size={16} className={darkMode ? 'text-white' : 'text-gray-700'} />
              </div>
              {!sidebarCollapsed && (
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>My Profile</span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {activeTab === 'home' && 'Political Accountability Tracker'}
            {activeTab === 'search' && 'Search Government Records'}
            {activeTab === 'trending' && 'Trending Topics'}
            {activeTab === 'saved' && 'Saved Queries'}
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'home' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {!answer ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#046A38] flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-medium text-center mb-2">
                    Welcome to Mheshimiwa Watch
                  </h1>
                  <p className="text-gray-400 text-center mb-8">
                    Track political promises and government accountability in Kenya
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                    {[
                      "Road projects in Nairobi",
                      "MP attendance records",
                      "County budget spending",
                      "Healthcare projects status"
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(suggestion)}
                        className={`p-3 rounded-lg text-left ${darkMode ? 'bg-[#1e1e1e] hover:bg-[#2a2a2a]' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <p className="font-medium">{suggestion}</p>
                        <p className="text-sm text-gray-400 mt-1">Ask about {suggestion.split(' ')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#1e1e1e]' : 'bg-white'} mb-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#046A38] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Your Question</h3>
                      <p className="text-sm text-gray-400">{query}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-10 h-10 rounded-full bg-[#BB0000] flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Accountability Report</h3>
                      <div className={`prose ${darkMode ? 'prose-invert' : ''} mt-2`}>
                        {answer.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className={`sticky bottom-0 bg-${darkMode ? '[#1a1a1a]' : '[#f5f5f5]'} pt-4 pb-6`}>
                <div className={`relative rounded-xl border ${darkMode ? 'bg-[#2a2a2a] border-gray-700' : 'bg-white border-gray-300'} p-4 shadow-lg`}>
                  <div className="flex items-end gap-3">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && askAI()}
                      placeholder="Ask about political promises, projects, or MP performance..."
                      className={`flex-1 bg-transparent border-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'} focus:outline-none`}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={askAI}
                        disabled={loading || !query.trim()}
                        className={`p-2 rounded-lg ${loading || !query.trim() ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#046A38] hover:bg-[#03582d]'} text-white`}
                      >
                        {loading ? (
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    AI-generated for accountability tracking
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}