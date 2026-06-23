// src/pages/TripDetail.jsx
// Shows the full itinerary for a single saved trip
// Uses the :id URL parameter to fetch the right trip

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItineraryDisplay from "../components/ItineraryDisplay";
import api from "../api/axios";

const TripDetail = () => {
  const { id } = useParams(); // gets the :id from the URL e.g. /trip/3 → id = "3"
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (err) {
        setError("Trip not found or you don't have access to it.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]); // re-run if id changes

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Loading itinerary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-slate-500 hover:text-slate-700 font-medium mb-6 flex items-center gap-1"
      >
        ← Back to My Trips
      </button>

      <ItineraryDisplay trip={trip} />
    </div>
  );
};

export default TripDetail;
