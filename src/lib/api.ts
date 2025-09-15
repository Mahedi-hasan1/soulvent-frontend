// src/lib/api.ts

// Change this value to switch between environments
//export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://soulvent-api.onrender.com";
let defaultBase = "https://soulvent-api.onrender.com";
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
	defaultBase = "http://localhost:8080";
}
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || defaultBase;
