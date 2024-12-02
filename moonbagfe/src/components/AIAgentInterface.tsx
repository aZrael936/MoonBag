import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

export function AIAgentInterface() {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement AI agent interaction
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">AI Agent Interface</h2>
      </div>
      
      <div className="h-[400px] mb-4 bg-gray-50 rounded-lg p-4 overflow-y-auto">
        {/* Messages will be displayed here */}
        <div className="text-gray-500 text-center mt-[180px]">
          Start interacting with the AI agent
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}