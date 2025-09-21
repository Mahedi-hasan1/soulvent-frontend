"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { API_BASE } from "../../lib/api";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    city: "",
    gender: "male",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        router.replace("/");
      } else {
        setCheckedAuth(true);
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Validate all fields for signup
    if (mode === "signup") {
      if (!form.username || !form.email || !form.password || !form.city || !form.gender) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }
      if (form.username.length < 3) {
        setError("Username must be at least 3 characters.");
        setLoading(false);
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
    }
    try {
      const url =
        mode === "login"
          ? `${API_BASE}/login`
          : `${API_BASE}/signup`;
      const body =
        mode === "login"
          ? { username_or_email: form.username, password: form.password }
          : { username: form.username, email: form.email, password: form.password, city: form.city, gender: form.gender };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        // Save user info for Suggestions
        if (mode === "signup") {
          localStorage.setItem(
            "user",
            JSON.stringify({ username: form.username, city: form.city })
          );
        } else if (mode === "login" && data.user) {
          // If backend returns user info on login
          localStorage.setItem(
            "user",
            JSON.stringify({ username: data.user.username, city: data.user.city })
          );
        }
        router.replace("/");
      } else {
        setError(
          mode === "signup"
            ? data.message || "Sign up failed"
            : data.message || "Authentication failed"
        );
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  if (!checkedAuth) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-r from-sky-300 via-sky-100 to-white p-4 sm:p-6 lg:px-[5vw]">
      {/* Left Side - Brand Section */}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-transparent mb-6 lg:mb-0">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 mb-2 sm:mb-4 text-center">
          SoulVent
        </span>
        <p className="text-sm sm:text-base lg:text-lg text-blue-900 max-w-sm lg:max-w-md text-center font-medium px-4 lg:px-0">
          <span className="lg:hidden">Express yourself freely and anonymously</span>
          <span className="hidden lg:inline">What's in your mind right now? Say it. No one knows you. No one will ever know. Just let it go.</span>
        </p>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center bg-transparent p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            {mode === "signup" && (
              <>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </>
            )}
            {mode === "login" && (
              <>
                <input
                  name="username"
                  type="text"
                  placeholder="Username or Email"
                  value={form.username}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-base sm:text-lg py-2 sm:py-3 pl-3 sm:pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </>
            )}
            
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center mt-2 gap-2">
              <button
                type="submit"
                className="btn bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-all font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg w-full sm:w-auto whitespace-nowrap text-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? (mode === "login" ? "Signing in..." : "Signing up...") : mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mt-2">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 py-1"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
              
              {mode === "login" && (
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base font-bold text-center sm:text-right transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 py-1"
                  onClick={() => alert("Forgot password functionality coming soon!")}
                >
                  Forgot password?
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}