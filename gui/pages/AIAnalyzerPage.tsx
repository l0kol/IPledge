
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SectionHeader } from '../components/core/SectionHeader';
import { Card } from '../components/core/Card';
import { Button } from '../components/core/Button';
import { LoadingSpinner } from '../components/core/LoadingSpinner';
import { generateProjectAnalysis, streamChatResponse } from '../services/geminiService';
import { Send, User, Bot, CornerDownLeft } from 'lucide-react';
import { ChatMessage } from '../types'; // Ensure ChatMessage type is defined

export const AIAnalyzerPage: React.FC = () => {
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);

  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreamingChat, setIsStreamingChat] = useState<boolean>(false);
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleAnalyzeProject = async () => {
    if (!projectIdea.trim()) {
      setAnalysisResult("Please enter a project idea.");
      return;
    }
    setIsLoadingAnalysis(true);
    setAnalysisResult('');
    try {
      const result = await generateProjectAnalysis(projectIdea);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisResult("Failed to generate analysis. See console for details.");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSendChatMessage = useCallback(async () => {
    if (!chatInput.trim()) return;

    const newUserMessage: ChatMessage = { 
      id: `user-${Date.now()}`, 
      sender: 'user', 
      text: chatInput,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, newUserMessage]);
    setChatInput('');
    setCurrentStreamedMessage(''); // Clear previous stream for new message

    // Pass a callback to update currentStreamedMessage as chunks arrive
    await streamChatResponse(
        newUserMessage.text, 
        chatHistory, // Pass current history for context
        (updater) => setCurrentStreamedMessage(updater), // Updater for the currently streaming message
        setIsStreamingChat
    );
    // Streaming is complete, currentStreamedMessage holds the full AI response
    // Add it to chat history once streaming finishes. streamChatResponse sets isLoading to false.
  }, [chatInput, chatHistory]);

  // Effect to add fully streamed message to history
  useEffect(() => {
    if (!isStreamingChat && currentStreamedMessage.trim() !== "") {
      // Check if the last message was from the user to avoid duplicate AI messages
      // This logic might need refinement based on how `isStreamingChat` and `currentStreamedMessage` are updated.
      // The goal is to add the AI's complete response once streaming is done.
      const lastMessage = chatHistory[chatHistory.length -1];
      if(lastMessage && lastMessage.sender === 'user') { // Only add if last message was user, meaning AI is responding
         setChatHistory(prev => [...prev, { 
            id: `ai-${Date.now()}`, 
            sender: 'ai', 
            text: currentStreamedMessage,
            timestamp: new Date(),
        }]);
        setCurrentStreamedMessage(''); // Reset for next interaction
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreamingChat, currentStreamedMessage]); // Removed chatHistory to avoid loop from itself


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, currentStreamedMessage]);


  return (
    <div className="space-y-8">
      <SectionHeader title="AI Project Analyzer" subtitle="Get AI-powered insights and chat about your Web3 project ideas." />

      <Card title="Project Idea Analysis (One-Shot)">
        <div className="space-y-4">
          <textarea
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            placeholder="Describe your project idea here... e.g., A platform for tokenizing music royalties using NFTs."
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
            rows={4}
          />
          <Button onClick={handleAnalyzeProject} isLoading={isLoadingAnalysis} disabled={isLoadingAnalysis}>
            Analyze Project Idea
          </Button>
          {isLoadingAnalysis && <LoadingSpinner message="Generating analysis..." />}
          {analysisResult && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md">
              <h4 className="text-lg font-semibold text-indigo-400 mb-2">Analysis:</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-200">{analysisResult}</pre>
            </div>
          )}
        </div>
      </Card>

      <Card title="Interactive AI Chat">
        <div className="flex flex-col h-[500px]">
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-700 rounded-t-md">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl p-3 rounded-lg shadow ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-100'}`}>
                  <div className="flex items-center mb-1">
                    {msg.sender === 'user' ? <User size={16} className="mr-2 opacity-80" /> : <Bot size={16} className="mr-2 opacity-80" />}
                    <span className="text-xs font-medium opacity-80">{msg.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                   <p className="text-xxs opacity-60 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isStreamingChat && currentStreamedMessage && (
               <div className="flex justify-start">
                 <div className="max-w-xl p-3 rounded-lg shadow bg-gray-600 text-gray-100">
                    <div className="flex items-center mb-1">
                        <Bot size={16} className="mr-2 opacity-80" />
                        <span className="text-xs font-medium opacity-80">AI Assistant (typing...)</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{currentStreamedMessage}<span className="animate-pulse">▍</span></p>
                 </div>
               </div>
            )}
            {isStreamingChat && !currentStreamedMessage && <LoadingSpinner size="sm" message="AI is thinking..."/>}
          </div>
          <div className="p-4 border-t border-gray-600 bg-gray-800 rounded-b-md">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isStreamingChat && handleSendChatMessage()}
                placeholder={isStreamingChat ? "AI is responding..." : "Ask about Web3, funding, IP..."}
                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                disabled={isStreamingChat}
              />
              <Button onClick={handleSendChatMessage} isLoading={isStreamingChat} disabled={isStreamingChat || !chatInput.trim()} className="h-full">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
