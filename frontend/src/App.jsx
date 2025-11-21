import React, { useState } from "react";
import axios from "axios";
import ResultTable from "./components/ResultsTable";
import {
  FileUp,
  ListChecks,
  CheckCircle,
  UploadCloud,
  Wand2,
  Sparkles,
  FileSearch,
} from "lucide-react";

// const API_URL = "http://localhost:3000/api/check";
const API_URL = "https://pdf-rulecheck-ai.onrender.com/api/check";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => setPdfFile(e.target.files[0]);

  const handleRuleChange = (i, v) => {
    const newRules = [...rules];
    newRules[i] = v;
    setRules(newRules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);

    const activeRules = rules.filter((r) => r.trim() !== "");
    if (!pdfFile || activeRules.length === 0) {
      setError("Upload a PDF & enter at least one rule.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);
    formData.append("rules", JSON.stringify(activeRules));

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.error || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 px-6 py-10 text-gray-200">

      <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-gray-700/50 p-8">

        <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-lg">
          <Sparkles className="w-8 h-8 text-cyan-300" />
          PDF RuleCheck AI
        </h1>

        <p className="text-gray-400 text-sm mb-8 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-400" />
          Powered by Gemini | Detect, Analyze & Validate Documents Automatically
        </p>

        <form onSubmit={handleSubmit}>

          <div className="mb-8 p-5 rounded-xl bg-gray-800/60 border border-gray-700 hover:border-cyan-400 transition-all duration-300 shadow-inner">
            <label className="flex items-center gap-3 text-lg font-semibold mb-3">
              <FileUp className="text-cyan-300" /> Upload PDF (2-10 pages)
            </label>

            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="custom-file-input text-gray-300"
              />

              <UploadCloud className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>

            {pdfFile && (
              <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-cyan-400" />
                {pdfFile.name}
              </p>
            )}
          </div>

          <div className="mb-8 p-5 rounded-xl bg-gray-800/60 border border-gray-700 hover:border-blue-400 transition-all duration-300">
            <label className="flex items-center gap-3 text-lg font-semibold mb-3">
              <ListChecks className="text-blue-300" /> Enter Rules
            </label>

            {rules.map((rule, idx) => (
              <input
                key={idx}
                type="text"
                value={rule}
                onChange={(e) => handleRuleChange(idx, e.target.value)}
                placeholder={`Rule ${idx + 1}`}
                className="w-full mt-3 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:border-cyan-400 focus:ring-cyan-400 outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 flex items-center justify-center gap-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition-all duration-300 shadow-[0_0_15px_rgba(0,200,255,0.5)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                Run Document Check
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-900/40 border border-red-600 text-red-300">
            ⚠️ {error}
          </div>
        )}

        <ResultTable results={results} />
      </div>
    </div>
  );
}

export default App;
