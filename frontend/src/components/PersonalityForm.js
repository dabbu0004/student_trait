import React, { useState } from "react";
import axios from "axios";

const PersonalityForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject1: "",
    subject2: "",
    subject3: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // clamp value between 0 and 100
  const clampMarks = (value) => {
    if (value === "") return "";
    const num = Number(value);
    if (num < 0) return 0;
    if (num > 100) return 100;
    return num;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // apply limit only to subjects
    if (name.startsWith("subject")) {
      setFormData({
        ...formData,
        [name]: clampMarks(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post("https://student-trait-1.onrender.com/api/personality",
        {
          name: formData.name,
          subject1: Number(formData.subject1),
          subject2: Number(formData.subject2),
          subject3: Number(formData.subject3),
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 px-4 py-10">
    {/* Decorative background blobs */}
    <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>

    <div className="relative w-full max-w-lg backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 mb-2">
          Identity Mapper
        </h1>
        <p className="text-slate-400 text-center text-sm mb-8">Discover the core of your personality through your performance</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="group">
            <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivers"
              required
              className="w-full bg-slate-800/50 border border-slate-600 text-white p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 placeholder:text-slate-500 group-hover:border-slate-400"
            />
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["subject1", "subject2", "subject3"].map((sub, i) => (
              <div key={sub} className="group">
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2 ml-1 text-center sm:text-left">
                  Score {i + 1}
                </label>
                <input
                  type="number"
                  name={sub}
                  min={0}
                  max={100}
                  value={formData[sub]}
                  onChange={handleChange}
                  placeholder="0-100"
                  required
                  className="w-full bg-slate-800/50 border border-slate-600 text-white p-4 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-300 text-center"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
            <span className="relative">
              {loading ? "Analysing Traits..." : "Reveal Personality"}
            </span>
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50">
            <p className="text-center text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="mt-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="bg-slate-900 rounded-[14px] p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-1">
                  Insight for {result.name}
                </h2>
                <div className="flex justify-center gap-4 text-xs text-slate-400 mb-6 uppercase tracking-[0.2em]">
                  <span>Avg: {result.average}</span>
                  <span>Grade: {result.grade}</span>
                </div>

                <div className="relative inline-block px-8 py-3 rounded-full bg-white/5 border border-white/10 mb-4">
                  <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-300 uppercase italic">
                    {result.personalityTrait}
                  </p>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed px-4">
                  {result.personalityTrait === "Leader" && "A vision-driven force of nature. You excel at turning obstacles into stepping stones for others."}
                  {result.personalityTrait === "Thinker" && "The architect of logic. You possess the rare ability to see patterns where others see chaos."}
                  {result.personalityTrait === "Artist" && "A weaver of imagination. You translate the intangible into beauty that resonates."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default PersonalityForm;


