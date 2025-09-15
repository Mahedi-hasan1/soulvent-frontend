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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-300 via-sky-100 to-white px-[5vw]">
      {/* Left Side */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center p-12 bg-transparent">
        <span className="text-5xl font-extrabold text-blue-600 mb-4">SoulVent</span>
        <p className="text-lg text-blue-900 max-w-md text-center font-medium">
          What’s in your mind right now? Say it. No one knows you. No one will ever know. Just let it go.
        </p>
      </div>
      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center bg-transparent p-8 md:-ml-[5vw] w-full">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10" style={{ width: '85%' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
                  required
                />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
                  required
                />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
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
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input bg-white border border-gray-300 text-black text-lg py-2 pl-4 rounded-lg"
                  required
                />
              </>
            )}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <div className="flex flex-row items-center mt-2 gap-2">
              <button
                type="submit"
                className="btn bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold px-8 py-2 rounded-lg text-lg w-1/2 whitespace-nowrap text-center"
                disabled={loading}
              >
                {loading ? (mode === "login" ? "Signing in..." : "Signing up...") : mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            </div>
            <div className="flex flex-row justify-between items-center gap-2">
              <button
                type="button"
                className="text-blue-600 hover:underline text-base font-bold"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
              <button
                type="button"
                className="text-blue-600 hover:underline text-base font-bold text-right"
                onClick={() => alert("Forgot password functionality coming soon!")}
                style={{ visibility: mode === "login" ? "visible" : "hidden" }}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
