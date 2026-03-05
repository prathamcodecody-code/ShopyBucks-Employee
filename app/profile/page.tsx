"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EmployeeLayout from "@/components/EmployeeLayout";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    const res = await api.get("/employee/profile");
    setProfile(res.data);
    setPhone(res.data.phone || "");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      await api.post("/employee/profile/phone", { phone });
      setMessage("OTP sent to your phone");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      await api.post("/employee/profile/verify-phone", {
        phone,
        otp,
      });

      setMessage("Phone verified successfully");
      fetchProfile();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <EmployeeLayout><div>Loading...</div></EmployeeLayout>;

  return (
    <EmployeeLayout>
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Employee Profile</h2>

      <div className="mb-4">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Phone Number</label>

        {!profile.phoneVerified ? (
          <>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="Enter phone number"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send OTP
            </button>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Verify Phone
              </button>
            </div>
          </>
        ) : (
          <div className="text-green-600 font-semibold">
            ✅ Phone Verified ({profile.phone})
          </div>
        )}
      </div>

      {profile.phoneVerified && (
        <div className="mt-4">
          <p className="text-sm">
            Two Factor Authentication:
            <span className="ml-2 font-semibold">
              {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </p>
        </div>
      )}

      {message && (
        <div className="mt-4 text-sm text-blue-600">{message}</div>
      )}
    </div>
    </EmployeeLayout>
  );
}