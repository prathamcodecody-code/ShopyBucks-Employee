"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import EmployeeLayout from "@/components/EmployeeLayout";

type CampaignProduct = {
  allocatedCredits: number;
  remainingCredits: number;
  product: {
    title: string;
  };
};

type Campaign = {
  id: number;
  name: string;
  status: string;
  totalCredits: number;
  seller: {
    id: number;
    name: string;
    email: string;
    businessName?: string;
  };
  products: CampaignProduct[];
};

export default function EmployeeCampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<Campaign | null>(null);
  const [reason, setReason] = useState("");

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/campaigns/pending");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to fetch pending campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  /* ================= ACTIONS ================= */

  const approve = async (id: number) => {
    setActionLoading(id);
    try {
      await api.post(`/employee/campaigns/${id}/approve`);
      await loadCampaigns();
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async () => {
    if (!rejecting) return;
    setActionLoading(rejecting.id);
    try {
      await api.post(`/employee/campaigns/${rejecting.id}/reject`, { reason });
      setRejecting(null);
      setReason("");
      await loadCampaigns();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-6 text-amazon-mutedText italic">Loading pending queue...</div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto p-6 text-amazon-text">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amazon-darkBlue">
            Pending Campaign Approvals
          </h1>
          <div className="bg-amazon-lightGray px-3 py-1 rounded-full text-sm font-bold border border-amazon-borderGray">
            {campaigns.length} Waiting
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="border border-amazon-borderGray bg-white rounded-lg p-12 text-center shadow-sm">
            <span className="text-4xl block mb-4">🎉</span>
            <p className="text-amazon-mutedText font-medium">All caught up! No pending campaigns.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-white border border-amazon-borderGray rounded-lg shadow-sm overflow-hidden">
                {/* ADMIN HEADER */}
                <div className="bg-amazon-navy p-4 flex justify-between items-center text-white">
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{c.name}</h2>
                    <p className="text-xs text-gray-300 mt-1 uppercase tracking-wider">
                      Seller: <span className="text-amazon-orange">{c.seller.businessName ?? c.seller.name}</span> • {c.seller.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded border border-white/30 uppercase">
                    Pending Review
                  </span>
                </div>

                <div className="p-4 grid md:grid-cols-2 gap-6">
                  {/* LEFT: PRODUCTS */}
                  <div>
                    <p className="text-xs font-bold text-amazon-mutedText uppercase mb-2">Requested Products</p>
                    <ul className="space-y-2">
                      {c.products.map((p, i) => (
                        <li key={i} className="text-sm flex justify-between border-b border-amazon-lightGray pb-1">
                          <span className="text-amazon-navy">{p.product.title}</span>
                          <span className="font-bold">{p.allocatedCredits} credits</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RIGHT: SUMMARY & ACTIONS */}
                  <div className="bg-amazon-lightGray/50 p-4 rounded-lg border border-amazon-borderGray flex flex-col justify-between">
                    <div className="mb-4">
                      <p className="text-xs font-bold text-amazon-mutedText uppercase">Total Campaign Budget</p>
                      <p className="text-2xl font-black text-amazon-darkBlue">{c.totalCredits} Credits</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => approve(c.id)}
                        disabled={actionLoading !== null}
                        className="flex-1 bg-amazon-success text-white font-bold py-2 rounded shadow-sm hover:brightness-110 transition-all disabled:opacity-50"
                      >
                        {actionLoading === c.id ? "Approving..." : "Approve"}
                      </button>
                      <button
                        onClick={() => setRejecting(c)}
                        disabled={actionLoading !== null}
                        className="flex-1 border border-amazon-danger text-amazon-danger font-bold py-2 rounded hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REJECT MODAL */}
        {rejecting && (
          <div className="fixed inset-0 bg-amazon-darkBlue/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-amazon-borderGray">
              <h3 className="text-lg font-bold text-amazon-darkBlue mb-1">
                Reject Campaign
              </h3>
              <p className="text-xs text-amazon-mutedText mb-4">
                The seller will see this reason in their dashboard.
              </p>
              
              <textarea
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Offensive content, invalid product category, etc."
                className="w-full border border-amazon-borderGray rounded-md p-3 min-h-[120px] outline-none focus:ring-1 focus:ring-amazon-danger transition-all text-sm"
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setRejecting(null);
                    setReason("");
                  }}
                  className="px-4 py-2 text-sm font-bold text-amazon-mutedText hover:text-amazon-darkBlue"
                >
                  Go Back
                </button>
                <button
                  onClick={reject}
                  disabled={!reason.trim() || actionLoading !== null}
                  className="bg-amazon-danger text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}