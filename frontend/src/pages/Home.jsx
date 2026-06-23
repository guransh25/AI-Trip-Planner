// src/pages/Home.jsx
// Landing page — shown to all visitors (logged in or not)
// Shows the trip generator form and the result

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TripForm from "../components/TripForm";
import ItineraryDisplay from "../components/ItineraryDisplay";

const Home = () => {
  const { isLoggedIn } = useAuth();
  // generatedTrip holds the trip object returned from the API
  const [generatedTrip, setGeneratedTrip] = useState(null);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-block bg-white/20 backdrop-blur text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🤖 Powered by Claude AI
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Your AI Travel
            <br />
            <span className="text-yellow-300">Planner</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Get a personalized day-by-day itinerary for any destination in seconds.
            Just tell us where you want to go.
          </p>

          {/* CTA buttons for non-logged-in users */}
          {!isLoggedIn && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Start Planning Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/50 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {isLoggedIn ? (
          // Logged in — show the trip form
          <>
            {/* If a trip was just generated, show it; otherwise show the form */}
            {generatedTrip ? (
              <ItineraryDisplay
                trip={generatedTrip}
                onClose={() => setGeneratedTrip(null)}
              />
            ) : (
              <TripForm onTripGenerated={(trip) => setGeneratedTrip(trip)} />
            )}
          </>
        ) : (
          // Not logged in — show features and a login prompt
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🤖", title: "AI-Powered", desc: "Claude AI generates detailed day-by-day plans" },
              { icon: "💾", title: "Save & Access", desc: "All your trips saved to your account" },
              { icon: "⚡", title: "Instant", desc: "Full itinerary generated in under 30 seconds" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
