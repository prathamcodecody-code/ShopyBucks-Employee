"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import EmployeeLayout from "@/components/EmployeeLayout";
import { 
  HiOutlineUser, 
  HiOutlineBriefcase, 
  HiOutlineChartPie, 
  HiOutlineArrowLeft,
  HiOutlineChatBubbleBottomCenterText
} from "react-icons/hi2";

export default function EmployeeCampaignDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [c, setCampaign] = useState<any>(null);

  useEffect(() => {
    api.get(`/employee/campaigns/details/${id}`).then(res => setCampaign(res.data));
  }, [id]);

  if (!c) {
    return (
      <EmployeeLayout>
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-amazon-orange"></div>
          <p className="text-amazon-mutedText font-black uppercase tracking-widest text-xs">Loading Details...</p>
        </div>
      </EmployeeLayout>
    );
  }

  const spent = c.products.reduce(
    (s: number, p: any) => s + (p.allocatedCredits - p.remainingCredits),
    0
  );

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER & NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-amazon-darkBlue pb-6">
          <div className="space-y-1">
            <button
              onClick={() => router.back()}
              className="text-xs font-bold text-amazon-orange hover:underline flex items-center gap-1 uppercase tracking-wider mb-2"
            >
              <HiOutlineArrowLeft size={14} /> Back to Campaigns
            </button>
            <h1 className="text-3xl font-black text-amazon-darkBlue uppercase italic tracking-tighter">
              {c.name}
            </h1>
          </div>
          <div className="bg-white border-2 border-amazon-darkBlue px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(19,25,33,1)]">
            <span className="text-[10px] font-black text-amazon-mutedText uppercase tracking-widest">Campaign ID: </span>
            <span className="text-amazon-darkBlue font-black font-mono">#CP-{c.id}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SELLER & STATS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SELLER INFO CARD */}
            <section className="bg-amazon-lightGray border-4 border-amazon-darkBlue p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(19,25,33,1)]">
              <div className="flex items-center gap-3 mb-6 border-b-2 border-amazon-darkBlue pb-4 font-black uppercase italic text-amazon-darkBlue">
                <HiOutlineUser size={22} className="text-amazon-orange" />
                <h3>Seller Profile</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
                <DetailItem label="Full Name" value={c.seller.name} />
                <DetailItem label="Email Address" value={c.seller.email} />
                <DetailItem label="Contact Phone" value={c.seller.phone} />
                <DetailItem label="Registered Business" value={c.seller.businessName} />
              </div>
            </section>

            {/* CAMPAIGN METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Stat label="Total Budget" value={c.totalCredits} />
              <Stat label="Total Consumed" value={spent} isNegative />
              <Stat label="Campaign Status" value={c.status} isStatus />
            </div>

            {/* INVENTORY TABLE */}
            <div className="bg-white border-4 border-amazon-darkBlue rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(19,25,33,1)]">
              <div className="bg-amazon-darkBlue text-white px-6 py-4 flex items-center gap-2">
                <HiOutlineBriefcase size={20} className="text-amazon-orange" />
                <span className="text-xs font-black uppercase tracking-widest">Targeted Inventory</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-amazon-lightGray border-b-2 border-amazon-borderGray">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText">Product Details</th>
                    <th className="px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText text-center">Allocated</th>
                    <th className="px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText text-right">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-amazon-borderGray">
                  {c.products.map((p: any) => (
                    <tr key={p.productId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-amazon-darkBlue text-sm italic uppercase tracking-tighter">{p.product.title}</p>
                        <p className="text-[10px] text-amazon-mutedText font-bold">SKU: {p.productId}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-amazon-text">{p.allocatedCredits}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-amazon-orange italic">{p.remainingCredits}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: REVIEWS & HISTORY */}
          <div className="space-y-6">
            <div className="bg-white border-4 border-amazon-darkBlue rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(19,25,33,1)]">
              <div className="flex items-center gap-2 mb-6 text-amazon-darkBlue">
                <HiOutlineChatBubbleBottomCenterText size={24} className="text-amazon-orange" />
                <h3 className="text-xs font-black uppercase tracking-widest leading-none">Review Log</h3>
              </div>

              {c.reviews?.[0] ? (
                <div className="space-y-4">
                  <div className="bg-amazon-lightGray p-4 rounded-xl border-2 border-amazon-darkBlue relative">
                    <span className={`absolute -top-3 left-4 px-2 py-0.5 rounded border-2 text-[10px] font-black uppercase tracking-widest ${
                      c.reviews[0].action === 'APPROVED' ? 'bg-amazon-success text-white border-amazon-darkBlue' : 'bg-amazon-danger text-white border-amazon-darkBlue'
                    }`}>
                      {c.reviews[0].action}
                    </span>
                    <p className="text-sm font-bold text-amazon-darkBlue mt-2">
                      Handled by: <span className="text-amazon-orange">{c.reviews[0].employee.name}</span>
                    </p>
                    <p className="text-[10px] text-amazon-mutedText font-black uppercase mt-1">
                      {new Date(c.reviews[0].createdAt).toLocaleString()}
                    </p>
                    {c.reviews[0].note && (
                      <div className="mt-4 p-3 bg-white border-2 border-amazon-borderGray rounded-lg italic text-sm text-amazon-text font-medium">
                        "{c.reviews[0].note}"
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center border-2 border-dashed border-amazon-borderGray rounded-xl">
                  <HiOutlineChartPie className="mx-auto text-amazon-borderGray mb-2" size={32} />
                  <p className="text-[10px] font-black text-amazon-mutedText uppercase tracking-widest">Awaiting First Review</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </EmployeeLayout>
  );
}

function Stat({ label, value, isNegative, isStatus }: any) {
  return (
    <div className="bg-white border-4 border-amazon-darkBlue p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(19,25,33,1)]">
      <p className="text-[10px] font-black text-amazon-mutedText uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className={`text-2xl font-black italic tracking-tighter uppercase ${
        isStatus && value === "ACTIVE" ? "text-amazon-success" : 
        isNegative ? "text-amazon-danger" : "text-amazon-darkBlue"
      }`}>
        {value}
      </p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-amazon-mutedText uppercase tracking-widest mb-1">{label}</span>
      <span className="text-amazon-darkBlue uppercase tracking-tighter">{value || "N/A"}</span>
    </div>
  );
}