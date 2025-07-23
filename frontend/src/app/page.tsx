"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/ask", {
        question: query
      });
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("Error: Could not get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Mheshimiwa Watch</h1>

      <div className="max-w-2xl mx-auto">
        <textarea
          className="w-full p-4 border border-green-600 rounded-lg mb-4"
          placeholder="Ask about political promises, projects, or MP performance..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Checking Records..." : "Ask AI"}
        </button>

        {answer && (
          <div className="mt-8 p-6 bg-white border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Accountability Report:</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, "<br/>") }} />
          </div>
        )}
      </div>
    </main>
  );
}