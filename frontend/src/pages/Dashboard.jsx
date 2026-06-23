// src/pages/Dashboard.jsx
// User's personal dashboard — shows saved trips and the trip generator
// Interview answer: "Dashboard fetches trips on mount using useEffect —
//   it runs once when the component first renders"

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TripForm from "../components/TripForm";
import ItineraryDisplay from "../components/ItineraryDisplay";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);          // list of saved trips
  const [loading, setLoading] = useState(true);
  const [generatedTrip, setGeneratedTrip] = useState(null); // newly generated trip
  const [view, setView] = useState("generate");    // "generate" or "saved"

  // Fetch user's trips when component mounts
  // useEffect with [] runs only ONCE after first render (like componentDidMount)
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/trips");
      setTrips(response.data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTripGenerated = (trip) => {
    setGeneratedTrip(trip);
    // Add to top of trips list (so it shows immediately without refetch)
    setTrips((prev) => [
      { id: trip.id, destination: trip.destination, days: trip.days, budget: trip.budget, travelStyle: trip.travelStyle, createdAt: trip.createdAt },
      ...prev,
    ]);
  };

  const handleDelete = async (tripId) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await api.delete(`/trips/${tripId}`);
      // Remove from local state (no need to refetch)
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-slate-500 mt-1">Plan new trips or revisit past itineraries</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
        <button
          onClick={() => { setView("generate"); setGeneratedTrip(null); }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm ${
            view === "generate"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          ✨ New Trip
        </button>
        <button
          onClick={() => setView("saved")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors text-sm ${
            view === "saved"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📁 Saved ({trips.length})
        </button>
      </div>

      {/* GENERATE VIEW */}
      {view === "generate" && (
        <div className="max-w-2xl">
          {generatedTrip ? (
            <ItineraryDisplay
              trip={generatedTrip}
              onClose={() => setGeneratedTrip(null)}
            />
          ) : (
            <TripForm onTripGenerated={handleTripGenerated} />
          )}
        </div>
      )}

      {/* SAVED TRIPS VIEW */}
      {view === "saved" && (
        <div>
          {loading ? (
            <p className="text-slate-500">Loading your trips...</p>
          ) : trips.length === 0 ? (
            // Empty state
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-4xl mb-3">✈️</p>
              <h3 className="text-xl font-semibold text-slate-800 mb-1">No trips yet</h3>
              <p className="text-slate-500 mb-4">Generate your first AI itinerary!</p>
              <button
                onClick={() => setView("generate")}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700"
              >
                Plan a Trip
              </button>
            </div>
          ) : (
            // Trip grid
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                      📍 {trip.destination}
                    </h3>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors ml-2 text-xl leading-none"
                      title="Delete trip"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {trip.days} days
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                      {trip.budget}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                      {trip.travelStyle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    {new Date(trip.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>

                  {/* Link to full trip detail page */}
                  <Link
                    to={`/trip/${trip.id}`}
                    className="block text-center bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium py-2 rounded-lg transition-colors text-sm"
                  >
                    View Itinerary →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
