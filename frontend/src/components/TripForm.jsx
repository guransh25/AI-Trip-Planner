// src/components/TripForm.jsx
// The main form for generating an AI itinerary
// Uses controlled inputs (React manages the form state)
// Interview answer: "Controlled inputs mean React state is the single source of truth
//   for form values — every keystroke updates state via onChange"

import { useState } from "react";
import api from "../api/axios";

// Props: onTripGenerated — callback to pass the result up to the parent
const TripForm = ({ onTripGenerated }) => {
  // Form state — one object for all fields
  const [form, setForm] = useState({
    destination: "",
    days: "3",
    budget: "moderate",
    travelStyle: "cultural",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle any input change — generic handler for all fields
  // `name` matches the key in the form state object
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form reload
    setError("");

    if (!form.destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    setLoading(true);
    try {
      // POST request to our backend (which calls Claude API)
      const response = await api.post("/trips/generate", form);
      // Pass the generated trip up to the parent component
      onTripGenerated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate trip. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Plan Your Trip</h2>
      <p className="text-slate-500 mb-6">Tell us about your dream destination</p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Destination input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Destination *
          </label>
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="e.g. Tokyo, Japan"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Days and Budget — side by side on larger screens */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Number of Days
            </label>
            <select
              name="days"
              value={form.days}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                <option key={d} value={d}>{d} day{d > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Budget
            </label>
            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="budget">Budget 💰</option>
              <option value="moderate">Moderate 💰💰</option>
              <option value="luxury">Luxury 💰💰💰</option>
            </select>
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Travel Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { value: "cultural", label: "🏛️ Cultural" },
              { value: "adventure", label: "🧗 Adventure" },
              { value: "relaxation", label: "🏖️ Relaxation" },
              { value: "foodie", label: "🍜 Foodie" },
              { value: "family", label: "👨‍👩‍👧 Family" },
            ].map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => setForm({ ...form, travelStyle: style.value })}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  form.travelStyle === style.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin text-lg">⏳</span>
              Generating your itinerary...
            </>
          ) : (
            <>✈️ Generate Itinerary</>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
