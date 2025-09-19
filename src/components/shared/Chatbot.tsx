 
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, type ChatSession, type Part } from "@google/generative-ai";
import { useData } from '@/context/DataContext';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import * as Icons from './icons/Icons';
import { PaperclipIcon } from 'lucide-react';

// Helper function to convert file to base64
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

interface Message {
    role: 'user' | 'model';
    text: string;
    image?: string; // URL or base64 string
}

const Chatbot: React.FC = () => {
    const { user } = useAuth();
    const { itineraries } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState<ChatSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    // New state for image handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canShowChatbot = user?.roles.includes(UserRole.CUSTOMER) || user?.roles.includes(UserRole.AGENT);

    useEffect(() => {
        if (!canShowChatbot || !user) return;

        const initChat = () => {
            try {
                const ai = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

                const isAgent = user.roles.includes(UserRole.AGENT);

                const itineraryContext = itineraries.map(it =>
                    `- Title: ${it.title}, Destination: ${it.destination}, Duration: ${it.duration} days, Price: AED ${it.price}, Description: ${it.description}`
                ).join('\n');

                const systemInstruction = isAgent
                    ? `You are an assistant for a travel agent. Your primary goal is to help the agent register a new customer for "Travelplans.fun". Start by asking for the customer's first name, last name, and email. Be friendly and efficient.`
                    : `You are a friendly and helpful travel assistant for a company called "Travelplans.fun". Your goal is to help users find their perfect travel package. You have access to the following list of available itineraries. Use this information to answer user questions and make recommendations. Be concise and conversational. Do not mention that you have a list; just use the information naturally.\n\nAvailable Itineraries:\n${itineraryContext}`;

                const initialMessage = isAgent
                    ? 'Hello! Let\'s register a new customer. What is their first name?'
                    : 'Hello! How can I help you plan your next adventure today?';

                const newChat = model.startChat({
                    systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
                });

                setChat(newChat);
                setMessages([{ role: 'model', text: initialMessage }]);
            } catch (e) {
                console.error("Error initializing chatbot:", e);
                setError("Could not initialize AI assistant. Please check the API key.");
                setMessages([{ role: 'model', text: 'AI assistant is currently unavailable.' }]);
            }
        };

        initChat();
    }, [itineraries, user, canShowChatbot]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setImageError("File size must be less than 5MB.");
                return;
            }
            if (!file.type.startsWith("image/")) {
                setImageError("Only image files are accepted.");
                return;
            }

            setImageError(null);
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !imageFile) || !chat || isLoading || error) return;

        const userMessage: Message = { role: 'user', text: input, image: imagePreview || undefined };
        setMessages(prev => [...prev, userMessage]);
        const text = input;
        const image = imageFile;

        setInput('');
        setImageFile(null);
        setImagePreview(null);
        setIsLoading(true);

        try {
            const promptParts: (string | Part)[] = [text];

            if (image) {
                const imagePart = await fileToGenerativePart(image);
                promptParts.unshift(imagePart); // Image part first
            }

            const result = await chat.sendMessageStream(promptParts);

            let currentModelMessage = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of result.stream) {
                currentModelMessage += chunk.text();
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = currentModelMessage;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    if (!canShowChatbot) {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark z-50"
                aria-label="Open travel assistant"
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <Icons.ChatBubbleIcon className="w-8 h-8" />
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-toast-in">
                    <header className="flex items-center justify-between p-4 bg-sidebar border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-800">AI Travel Assistant</h2>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {error ? (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-red-500 text-center">{error}</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs md:max-w-md lg:max-w-xs xl:max-w-sm rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-h-40" />}
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 rounded-xl px-4 py-3">
                                            <div className="flex items-center justify-center space-x-1">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                        {imagePreview && (
                            <div className="relative mb-2">
                                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-40" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 text-xs"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                         {imageError && <p className="text-red-500 text-xs mb-2">{imageError}</p>}

                        <div className="flex items-center space-x-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gray-200 text-gray-600 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-gray-300"
                                aria-label="Attach image"
                            >
                                <PaperclipIcon className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={error ? "Chat is disabled" : "Ask about destinations..."}
                                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading || !!error}
                                aria-label="Chat message"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-primary-dark disabled:bg-primary/50 transition-colors"
                                disabled={isLoading || (!input.trim() && !imageFile) || !!error}
                                aria-label="Send message"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;