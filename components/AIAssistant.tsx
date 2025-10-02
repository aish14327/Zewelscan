import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { JewelryItem, ScanResult } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { SendIcon } from './icons/SendIcon';

interface AIAssistantProps {
    masterInventory: JewelryItem[];
    lastScanResult: ScanResult | null;
}

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ masterInventory, lastScanResult }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm your AI Jeweler's Assistant. Ask me about your inventory or last scan." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (!process.env.API_KEY) {
            console.error("Gemini API key not found. Please set the API_KEY environment variable.");
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, the AI Assistant is currently unavailable." };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const systemInstruction = `You are an expert AI assistant for a high-end jewelry store. Your name is Zewel. You are knowledgeable about inventory management, sales, and jewelry details. You will be provided with the current inventory list and the last scan results as context in JSON format. Be helpful, concise, and professional. When presenting lists, use markdown bullet points. Do not mention that you received the data in JSON format.`;

            const inventoryContext = `
                Current Master Inventory: ${JSON.stringify(masterInventory.slice(0, 20), null, 2)}
                Last Scan Result: ${JSON.stringify(lastScanResult, null, 2)}
                (Note: Inventory context might be truncated for brevity. There are ${masterInventory.length} total items in the full inventory.)
            `;

            const fullPrompt = `${systemInstruction}\n\nHere is the current context:\n${inventoryContext}\n\nUser question: ${input}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
            });

            const modelMessage: ChatMessage = { role: 'model', content: response.text ?? '' };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const formattedContent = (content: string) => {
      // Basic markdown for bullet points and bolding
      const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>'); // List items
      return { __html: htmlContent };
    }


    return (
        <div className="mt-8 bg-zinc-900 border border-purple-500/20 rounded-xl shadow-lg flex flex-col h-96">
            <div className="p-4 border-b border-zinc-800 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-3 text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-200">AI Jeweler's Assistant</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-slate-300'}`}>
                            <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={formattedContent(msg.content)} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl bg-zinc-800 text-slate-300">
                           <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center bg-zinc-800 rounded-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about inventory..."
                        className="w-full bg-transparent px-4 py-2 text-slate-200 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-3 text-purple-400 hover:text-purple-300 disabled:text-zinc-600 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;