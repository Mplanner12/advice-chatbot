"use client";

import { useState } from "react";
import axios from "axios";
import { MdSend } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";

enum Sender {
  User = "user",
  Bot = "bot",
}

interface Message {
  text: string;
  sender: Sender;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { text: input, sender: Sender.User };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", { prompt: input });
      const botMessage: Message = {
        text: response.data.text,
        sender: Sender.Bot,
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error fetching response", error);
      setMessages([
        ...messages,
        userMessage,
        { text: "Something went wrong!", sender: Sender.Bot },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-700 text-white p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        <AiOutlineRobot
          className="text-yellow-300 mr-2 inline-block"
          size={32}
        />{" "}
        AI Advice Chatbot
      </h1>
      <div className="flex flex-col w-full max-w-2xl bg-white text-gray-800 rounded-lg shadow-md overflow-hidden">
        <div
          className="flex-1 p-4 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-200 self-start text-left"
              }`}
            >
              {message.sender === "bot" && (
                <AiOutlineRobot className="text-blue-500 mr-2 inline-block" />
              )}
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="my-2 p-3 bg-gray-200 rounded-lg self-start text-left flex items-center">
              <AiOutlineRobot className="text-blue-500 mr-2 animate-spin inline-block" />
              Typing...
            </div>
          )}
        </div>
        <div className="flex items-center p-4 border-t border-gray-300">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Ask for advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            disabled={!input.trim()}
          >
            <MdSend className="mr-2 inline-block" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
