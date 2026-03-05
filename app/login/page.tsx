"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginApi = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_URL || "https://apiv2.shopybucks.com",
  });

  // ----------------------------------------
  // STEP 1 — PASSWORD LOGIN
  // ----------------------------------------
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await loginApi.post("/employee/login", {
        email,
        password,
      });

      // 🔹 If 2FA required
      if (res.data.requiresOtp) {
        setTempToken(res.data.tempToken);
        setStep("otp");
        return;
      }

      // 🔹 If no 2FA
      const token = res.data.token;

      if (!token) throw new Error("No token received");

      await completeLogin(token);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Invalid credentials";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // STEP 2 — VERIFY OTP
  // ----------------------------------------
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await loginApi.post("/auth/employee/verify-otp", {
        otp,
        tempToken,
      });

      const token = res.data.token;

      if (!token) throw new Error("No token received");

      await completeLogin(token);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Invalid or expired OTP";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // FINAL LOGIN HANDLER
  // ----------------------------------------
  const completeLogin = async (token: string) => {
    localStorage.setItem("employee_token", token);

    try {
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch {}

    router.push("/dashboard");
    router.refresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    step === "credentials" ? handleLogin() : handleVerifyOtp();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white sm:bg-amazon-lightGray p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-amazon-darkBlue tracking-tighter">
          SHOPY<span className="text-amazon-orange">BUCKS</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amazon-mutedText mt-1">
          Staff Authentication
        </p>
      </div>

      <div className="bg-white sm:border border-amazon-borderGray p-8 rounded-lg w-full max-w-[350px] sm:shadow-sm">
        <h2 className="text-2xl font-normal mb-6 text-amazon-text">
          {step === "credentials" ? "Sign-In" : "Enter OTP"}
        </h2>

        {error && (
          <div className="bg-white border-l-4 border-amazon-danger p-3 mb-4 shadow-sm">
            <p className="text-amazon-danger text-sm font-bold">
              There was a problem
            </p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "credentials" && (
            <>
              <div>
                <label className="block text-xs font-bold mb-1">Email</label>
                <input
                  className="w-full border p-2 rounded-sm text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  Password
                </label>
                <input
                  className="w-full border p-2 rounded-sm text-sm"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {step === "otp" && (
            <div>
              <label className="block text-xs font-bold mb-1">
                One-Time Password
              </label>
              <input
                className="w-full border p-2 rounded-sm text-sm"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] py-1.5 rounded-sm text-sm disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : step === "credentials"
              ? "Continue"
              : "Verify & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
