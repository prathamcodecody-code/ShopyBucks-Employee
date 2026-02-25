"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/employee/login", {
        email,
        password,
      });

      // Set cookie via API route
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.data.token }),
      });

      localStorage.setItem("employee_token", res.data.token);

      // Redirect to employee dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white sm:bg-amazon-lightGray p-4">
      {/* Brand Logo / Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-amazon-darkBlue tracking-tighter">
          SHOPY<span className="text-amazon-orange">BUCKS</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amazon-mutedText mt-1">
          Staff Authentication
        </p>
      </div>

      <div className="bg-white sm:border border-amazon-borderGray p-8 rounded-lg w-full max-w-[350px] sm:shadow-sm">
        <h2 className="text-2xl font-normal mb-6 text-amazon-text">Sign-In</h2>

        {error && (
          <div className="bg-white border-l-4 border-amazon-danger p-3 mb-4 shadow-sm flex items-start gap-3">
            <span className="text-amazon-danger font-bold text-lg">!</span>
            <div>
              <p className="text-amazon-danger text-sm font-bold">There was a problem</p>
              <p className="text-amazon-text text-xs">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amazon-text mb-1 ml-0.5">
              Email
            </label>
            <div className="relative">
              <input
                className="w-full border border-gray-400 p-2 rounded-sm text-sm focus:outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amazon-text mb-1 ml-0.5 flex justify-between">
              Password
            </label>
            <input
              className="w-full border border-gray-400 p-2 rounded-sm text-sm focus:outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] transition-all"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:from-[#f5d179] hover:to-[#eeae1a] text-amazon-text py-1.5 rounded-sm shadow-sm text-sm transition-all active:from-[#e7ad20] active:to-[#e7ad20]"
          >
            {loading ? "Please wait..." : "Sign-In"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-amazon-borderGray">
          <p className="text-[11px] text-amazon-mutedText leading-relaxed">
            By signing in, you agree to ShopyBucks' Internal <span className="text-blue-700 hover:text-amazon-orange underline cursor-pointer">Conditions of Use</span> and Staff Privacy Notice.
          </p>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-8 text-center border-t border-gray-300 w-full max-w-[350px] pt-4">
        <div className="flex justify-center gap-4 text-[11px] text-blue-700">
          <span className="hover:text-amazon-orange hover:underline cursor-pointer">Help</span>
          <span className="hover:text-amazon-orange hover:underline cursor-pointer">Privacy</span>
          <span className="hover:text-amazon-orange hover:underline cursor-pointer">Terms</span>
        </div>
        <p className="text-[10px] text-amazon-mutedText mt-4">
          © 2026, ShopyBucks.com, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
}