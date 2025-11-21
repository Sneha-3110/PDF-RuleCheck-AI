import React from "react";
import { ShieldCheck, AlertTriangle, Sparkles, FileSearch, Brain } from "lucide-react";

const getStatusColor = (status) => {
  return status.toLowerCase() === "pass"
    ? "bg-green-500/20 text-green-300 border border-green-600/40 shadow-[0_0_8px_rgba(0,255,100,0.2)]"
    : "bg-red-500/20 text-red-300 border border-red-600/40 shadow-[0_0_8px_rgba(255,0,80,0.2)]";
};

const getConfidenceColor = (value) => {
  if (value >= 80) return "bg-green-500 shadow-[0_0_10px_rgba(0,255,100,0.4)]";
  if (value >= 50) return "bg-yellow-500 shadow-[0_0_10px_rgba(255,255,0,0.4)]";
  return "bg-red-500 shadow-[0_0_10px_rgba(255,0,80,0.4)]";
};

const ResultTable = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-12 overflow-x-auto">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-cyan-300 w-7 h-7 drop-shadow-[0_0_10px_cyan]" />
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text drop-shadow-md">
          Document Check Results
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)] overflow-hidden">
        <table className="min-w-full text-sm text-slate-300">
          <thead className="bg-slate-800/80">
            <tr>
              {[
                { label: "Rule", icon: FileSearch },
                { label: "Status", icon: ShieldCheck },
                { label: "Confidence", icon: Brain },
                { label: "Evidence", icon: AlertTriangle },
                { label: "Reasoning", icon: Sparkles },
              ].map((h, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 border-b border-slate-700 text-left font-semibold uppercase tracking-wide text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <h.icon className="w-4 h-4 text-cyan-300" />
                    {h.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className="hover:bg-slate-800/50 transition-colors duration-300"
              >
                {/* Rule */}
                <td className="px-6 py-4 border-b border-slate-800">
                  {result.rule}
                </td>

                {/* Status pill */}
                <td className="px-6 py-4 border-b border-slate-800 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      result.status
                    )}`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </td>

                {/* Confidence bar */}
                <td className="px-6 py-4 border-b border-slate-800 w-48">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100 mb-2 drop-shadow">
                      {result.confidence}%
                    </span>

                    <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getConfidenceColor(
                          result.confidence
                        )}`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Evidence */}
                <td className="px-6 py-4 border-b border-slate-800 text-xs italic text-slate-400 leading-relaxed">
                  {result.evidence}
                </td>

                {/* Reasoning */}
                <td className="px-6 py-4 border-b border-slate-800 text-slate-300 leading-relaxed">
                  {result.reasoning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;
