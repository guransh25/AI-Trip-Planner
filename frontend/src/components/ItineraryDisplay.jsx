// src/components/ItineraryDisplay.jsx
// Displays the AI-generated itinerary in a readable format
// Uses react-markdown to render the markdown text Claude returns

import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const ItineraryDisplay = ({ trip, onClose }) => {
  const navigate = useNavigate();

  if (!trip) return null;

  const budgetLabel = {
    budget: "Budget 💰",
    moderate: "Moderate 💰💰",
    luxury: "Luxury 💰💰💰",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">📍 {trip.destination}</h2>
            <div className="flex flex-wrap gap-3 text-blue-100 text-sm">
              <span>🗓️ {trip.days} days</span>
              <span>•</span>
              <span>{budgetLabel[trip.budget]}</span>
              <span>•</span>
              <span className="capitalize">🎯 {trip.travelStyle}</span>
            </div>
          </div>
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Itinerary content */}
      <div className="p-6">
        <div className="itinerary-content prose max-w-none">
          {/* ReactMarkdown converts markdown text to formatted HTML */}
          <ReactMarkdown>{trip.itinerary}</ReactMarkdown>
        </div>

        {/* Action buttons */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            View All Trips
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors"
            >
              Plan Another Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
