"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import EmployeeLayout from "@/components/EmployeeLayout";
import { HiOutlineTv, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

export default function EmployeeCampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get("/employee/campaigns/all")
      .then(res => setCampaigns(res.data))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      ACTIVE: "bg-green-50 text-amazon-success border-green-200",
      PAUSED: "bg-amazon-lightGray text-amazon-mutedText border-amazon-borderGray",
      COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
      REJECTED: "bg-red-50 text-amazon-danger border-amazon-danger/30",
    };
    return map[status] ?? "bg-gray-100 border-gray-200";
  };

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-amazon-darkBlue pb-6">
          <div>
            <h1 className="text-3xl font-black text-amazon-darkBlue uppercase italic tracking-tighter">
              Seller <span className="text-amazon-orange">Campaigns</span>
            </h1>
            <p className="text-amazon-mutedText font-bold text-sm uppercase tracking-widest mt-1">
              Review and manage promotional advertisements
            </p>
          </div>
          <div className="bg-white border-2 border-amazon-darkBlue px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(19,25,33,1)] flex items-center gap-3">
            <HiOutlineTv className="text-amazon-orange" size={24} />
            <span className="font-black text-amazon-darkBlue uppercase tracking-tighter">{campaigns.length} Total Ads</span>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white border-4 border-amazon-darkBlue rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(19,25,33,1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amazon-darkBlue text-white">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Seller Entity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Campaign Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Spent</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-amazon-borderGray">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center font-black uppercase italic text-amazon-mutedText animate-pulse">
                      Syncing Global Campaigns...
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center font-black uppercase italic text-amazon-mutedText">
                      No campaigns awaiting review
                    </td>
                  </tr>
                ) : (
                  campaigns.map(c => {
                    const spent = c.products.reduce(
                      (s: number, p: any) => s + (p.allocatedCredits - p.remainingCredits),
                      0
                    );
                    const remaining = c.products.reduce(
                      (s: number, p: any) => s + p.remainingCredits,
                      0
                    );

                    return (
                      <tr
                        key={c.id}
                        className="group hover:bg-amazon-lightGray transition-all cursor-pointer"
                        onClick={() => router.push(`/campaigns_list/${c.id}`)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-black text-amazon-darkBlue uppercase italic tracking-tighter group-hover:text-amazon-orange transition-colors">
                            {c.seller?.name || "Independent Seller"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-amazon-text uppercase tracking-tight">
                            {c.name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyle(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-amazon-mutedText">
                          {spent}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="font-black text-amazon-darkBlue italic">
                              {remaining}
                            </span>
                            <HiOutlineArrowTopRightOnSquare size={18} className="text-amazon-borderGray group-hover:text-amazon-orange" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}