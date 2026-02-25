"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useRouter } from "next/navigation";
import { HiOutlineTruck, HiOutlineChevronRight, HiOutlineClock } from "react-icons/hi2";

type SellerOrder = {
  id: number;
  status: string;
  totalAmount: string;
  shippingCharge: string;
  shippingTatMin?: number;
  shippingTatMax?: number;
  order: {
    user: {
      name: string;
      phone: string;
    };
  };
};

export default function EmployeeOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/seller-orders?page=1&limit=20");
      setOrders(res.data.orders || []);
    } catch (err: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const markPacked = async (e: React.MouseEvent, sellerOrderId: number) => {
    e.stopPropagation(); // Prevent card click navigation
    try {
      await api.post(`/api/admin/fulfillment/mark-packed/${sellerOrderId}`);
      toast.success("Order marked PACKED");
      fetchOrders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amazon-orange"></div>
          <p className="text-amazon-mutedText font-bold text-sm uppercase tracking-widest">Loading Orders...</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-amazon-borderGray pb-4">
          <div>
            <h1 className="text-2xl font-black text-amazon-text uppercase tracking-tight">Fulfillment Center</h1>
            <p className="text-amazon-mutedText text-sm font-medium">Manage and process active seller orders.</p>
          </div>
          <div className="bg-white border border-amazon-borderGray px-4 py-2 rounded-lg shadow-sm">
            <span className="text-xs font-bold text-amazon-mutedText uppercase tracking-widest">Active Orders: </span>
            <span className="text-amazon-darkBlue font-black">{orders.length}</span>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="grid gap-4">
          {orders.length > 0 ? (
            orders.map((o) => (
              <div
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="group bg-white border border-amazon-borderGray rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:border-amazon-orange hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* STATUS STRIP */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  o.status === "PENDING" ? "bg-amazon-orange" : 
                  o.status === "CONFIRMED" ? "bg-amazon-success" : "bg-amazon-navy"
                }`} />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-amazon-text text-lg">
                      {o.order.user.name}
                    </p>
                    <span className="text-amazon-mutedText text-sm font-medium">| {o.order.user.phone}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <p className="text-amazon-text font-bold">
                      Amount: <span className="text-amazon-success font-black">₹{o.totalAmount}</span>
                    </p>
                    <p className="text-amazon-mutedText font-medium">
                      Shipping: ₹{o.shippingCharge}
                    </p>
                    {o.shippingTatMin && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                        <HiOutlineClock size={14} />
                        TAT: {o.shippingTatMin}-{o.shippingTatMax} Days
                      </div>
                    )}
                  </div>

                  <div className="pt-1">
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${
                      o.status === "PENDING" ? "bg-orange-50 text-amazon-orange border-orange-200" :
                      o.status === "CONFIRMED" ? "bg-green-50 text-amazon-success border-green-200" :
                      "bg-amazon-lightGray text-amazon-darkBlue border-amazon-borderGray"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>

                
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-amazon-borderGray rounded-2xl p-20 text-center">
              <HiOutlineTruck className="mx-auto text-amazon-borderGray mb-4" size={48} />
              <p className="text-amazon-mutedText font-black uppercase tracking-widest">No orders found in queue</p>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
}