"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import EmployeeLayout from "@/components/EmployeeLayout";
import OrderTracking from "@/components/OrderTracking";
import { HiOutlineArrowLeft, HiOutlinePrinter, HiOutlineInformationCircle } from "react-icons/hi2";

export default function EmployeeOrderDetailsPage() {
  const { sellerOrderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [remarks, setRemarks] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/seller-orders/${sellerOrderId}`);
      console.log("📦 Employee Order Details:", res.data);
      setOrder(res.data);
    } catch (err: any) {
      toast.error("Failed to load order");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const confirmCod = async () => {
    try {
      setProcessing(true);
      await api.post(`/api/admin/fulfillment/confirm-cod/${sellerOrderId}`, { remarks });
      toast.success("COD confirmed");
      setRemarks("");
      fetchOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to confirm COD");
    } finally {
      setProcessing(false);
    }
  };

  const markPacked = async () => {
    try {
      setProcessing(true);
      await api.post(`/api/admin/fulfillment/mark-packed/${sellerOrderId}`);
      toast.success("Order marked PACKED");
      fetchOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to mark packed");
    } finally {
      setProcessing(false);
    }
  };

  const createShipment = async () => {
    try {
      setProcessing(true);
      await api.post(`/api/admin/fulfillment/create-shipment/${sellerOrderId}`);
      toast.success("Shipment created");
      fetchOrder();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create shipment");
    } finally {
      setProcessing(false);
    }
  };

  const downloadInvoice = async (sellerOrderId: number) => {
  const res = await api.get(
    `/api/invoices/${sellerOrderId}`,
    { responseType: "blob" }
  );

  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${sellerOrderId}.pdf`;
  a.click();

  window.URL.revokeObjectURL(url);
};

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amazon-orange"></div>
        </div>
      </EmployeeLayout>
    );
  }

  if (!order) return null;

  const canConfirmCod = order.status === "PENDING" && 
    (order.codVerification || order.order?.paymentMethod === "EASEBUZZ");

  // ✅ Parse the shipping address properly
  const shippingAddress = order.order?.address;
  let addr = {
    fullName: "N/A",
    phone: "N/A",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  };

  if (shippingAddress && typeof shippingAddress === 'object') {
    addr = shippingAddress as any;
  }

  // ✅ Get seller pickup address
  const sellerPickupAddress = order.seller?.addresses?.[0];

  // ✅ Calculate correct pricing
  const itemsSubtotal = order.items?.reduce((sum: number, item: any) => 
    sum + (Number(item.unitPrice) * Number(item.quantity)), 0
  ) || 0;
  
  const shippingCharge = Number(order.shippingCharge || 0);
  const totalAmount = Number(order.totalAmount || 0);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amazon-borderGray pb-6">
          <div className="space-y-1">
            <button
              onClick={() => router.back()}
              className="text-xs font-bold text-blue-600 hover:text-amazon-orange flex items-center gap-1 uppercase tracking-wider mb-2"
            >
              <HiOutlineArrowLeft size={14} /> Back to List
            </button>
            <h1 className="text-2xl font-black text-amazon-darkBlue uppercase tracking-tight">
              Order <span className="text-amazon-orange">#{order.id}</span>
            </h1>
            <p className="text-xs text-amazon-mutedText font-bold">
                ORDER PLACED: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
            onClick={() => downloadInvoice(Number(order.id))}
            className="flex items-center gap-2 px-4 py-2 border border-amazon-borderGray rounded-lg text-xs font-black bg-white hover:bg-amazon-lightGray shadow-sm transition-all">
                <HiOutlinePrinter size={16} /> PRINT INVOICE
            </button>
          </div>
        </div>

        {/* PROGRESS TRACKER CARD */}
        <div className="bg-white border border-amazon-borderGray rounded-xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amazon-mutedText mb-8">Fulfillment Progress</h3>
            <OrderTracking status={order.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ACTION CENTER */}
            <div className="bg-white border border-amazon-borderGray rounded-xl p-6 shadow-sm border-l-4 border-l-amazon-orange">
              <h3 className="text-sm font-black uppercase tracking-widest text-amazon-darkBlue mb-4 flex items-center gap-2">
                <HiOutlineInformationCircle size={18} /> Required Actions
              </h3>

              {canConfirmCod && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                    <p className="text-xs font-bold text-amazon-orange uppercase mb-2">Awaiting Verification</p>
                    <textarea
                      className="w-full p-3 border border-amazon-borderGray rounded-lg text-sm focus:ring-2 focus:ring-amazon-orange outline-none bg-white transition-all"
                      rows={3}
                      placeholder="Add internal remarks about this confirmation..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={confirmCod}
                    disabled={processing}
                    className="w-full md:w-auto px-8 py-3 bg-amazon-darkBlue text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-amazon-navy shadow-md disabled:opacity-50 transition-all"
                  >
                    {processing ? "Processing..." : "Confirm & Accept Order"}
                  </button>
                </div>
              )}

              {order.status === "ACCEPTED" && (
                <button
                  onClick={markPacked}
                  disabled={processing}
                  className="px-8 py-3 bg-amazon-success text-white font-black text-xs uppercase tracking-widest rounded-lg hover:opacity-90 shadow-md disabled:opacity-50 transition-all"
                >
                  {processing ? "Updating..." : "Generate Packing Label"}
                </button>
              )}

              {order.status === "PACKED" && !order.shipment && (
                <button
                  onClick={createShipment}
                  disabled={processing}
                  className="px-8 py-3 bg-amazon-orange text-amazon-darkBlue font-black text-xs uppercase tracking-widest rounded-lg hover:bg-amazon-orangeHover shadow-md disabled:opacity-50 transition-all"
                >
                  {processing ? "Creating Shipment..." : "Dispatch to Carrier"}
                </button>
              )}

              {!canConfirmCod && order.status !== "ACCEPTED" && order.status !== "PACKED" && (
                <div className="p-4 bg-amazon-lightGray rounded-lg text-center">
                    <p className="text-xs font-black text-amazon-mutedText uppercase italic tracking-widest">No active actions required for {order.status} state</p>
                </div>
              )}
            </div>

            {/* ITEM TABLE */}
            <div className="bg-white border border-amazon-borderGray rounded-xl overflow-hidden shadow-sm">
              <div className="bg-amazon-navy text-white px-6 py-4 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest">Order Inventory</span>
                <span className="text-xs font-bold opacity-70">{order.items?.length || 0} Items</span>
              </div>
              <div className="p-0">
                <table className="w-full border-collapse">
                    <thead className="bg-amazon-lightGray border-b border-amazon-borderGray">
                        <tr>
                            <th className="text-left px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText">Product Details</th>
                            <th className="text-center px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText">Qty</th>
                            <th className="text-right px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText">Unit Price</th>
                            <th className="text-right px-6 py-3 text-[10px] font-black uppercase text-amazon-mutedText">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item: any) => (
                            <tr key={item.id} className="border-b border-amazon-borderGray last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-amazon-darkBlue text-sm">{item.product?.title}</p>
                                    <p className="text-[10px] text-amazon-mutedText">SKU: {item.product?.id || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-amazon-text text-sm">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className="font-black text-amazon-text text-sm">₹{Number(item.unitPrice).toFixed(2)}</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className="font-black text-amazon-danger text-sm">₹{(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              <div className="p-6 bg-amazon-lightGray">
                <div className="max-w-sm ml-auto space-y-2">
                    <div className="flex justify-between text-xs font-bold text-amazon-mutedText">
                        <span>Items Subtotal:</span>
                        <span>₹{itemsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-amazon-mutedText">
                        <span>Shipping Charge:</span>
                        <span>₹{shippingCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-amazon-darkBlue pt-2 border-t border-amazon-borderGray">
                        <span>Order Total:</span>
                        <span className="text-amazon-success">₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="space-y-6">
            
            {/* PAYMENT CARD */}
            <div className="bg-white border border-amazon-borderGray rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-amazon-mutedText mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div>
                    <p className="text-[10px] font-bold text-amazon-mutedText uppercase">Method</p>
                    <p className="text-lg font-black text-amazon-orange">{order.order?.paymentMethod || "N/A"}</p>
                </div>
                {order.order?.paymentMethod === "EASEBUZZ" && order.status === "PENDING" && (
                    <div className="flex gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-red-600 font-black">!</span>
                        <p className="text-[10px] text-red-700 font-bold leading-tight">Failed Online Payment. Recovered as Manual COD Confirmation.</p>
                    </div>
                )}
                
                {/* Shipment Tracking Info */}
                {order.shipment?.trackingId && (
                  <div className="pt-3 border-t border-amazon-borderGray">
                    <p className="text-[10px] font-bold text-amazon-mutedText uppercase mb-2">Shipment Tracking</p>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-bold text-blue-900">Tracking ID: <span className="font-mono">{order.shipment.trackingId}</span></p>
                      <p className="text-xs font-bold text-blue-900">Courier: {order.shipment.courier}</p>
                      <p className="text-xs font-bold text-blue-900">Status: {order.shipment.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CUSTOMER SHIPPING ADDRESS */}
            <div className="bg-white border border-amazon-borderGray rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-amazon-mutedText mb-4">Customer Delivery</h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-amazon-borderGray">
                    <p className="text-[10px] font-bold text-amazon-mutedText uppercase mb-1">Customer Name</p>
                    <p className="font-black text-amazon-darkBlue text-sm">{addr.fullName}</p>
                    <p className="text-xs text-amazon-mutedText font-medium mt-1">📞 {addr.phone}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-amazon-mutedText uppercase mb-2">Shipping Address</p>
                    <div className="text-xs text-amazon-text leading-relaxed font-medium bg-amazon-lightGray p-3 rounded-lg border border-amazon-borderGray space-y-1">
                        <p className="font-bold">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        {addr.landmark && <p className="text-amazon-mutedText italic">Landmark: {addr.landmark}</p>}
                        <p className="font-bold text-amazon-darkBlue">{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                </div>
              </div>
            </div>

            {/* SELLER DETAILS WITH PICKUP ADDRESS */}
            <div className="bg-white border border-amazon-borderGray rounded-xl p-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-amazon-mutedText mb-4">Seller Information</h3>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-amazon-borderGray">
                    <p className="font-bold text-amazon-darkBlue text-sm">{order.seller?.businessName || order.seller?.name}</p>
                    <p className="text-xs text-amazon-mutedText mt-1 uppercase font-bold tracking-tighter">GST: {order.seller?.gstNumber || "No GST"}</p>
                    <p className="text-xs text-amazon-mutedText mt-1">📞 {order.seller?.phone || "N/A"}</p>
                  </div>
                  
                  {sellerPickupAddress && (
                    <div>
                      <p className="text-[10px] font-bold text-amazon-mutedText uppercase mb-2">Pickup Address</p>
                      <div className="text-xs text-amazon-text leading-relaxed font-medium bg-amazon-lightGray p-3 rounded-lg border border-amazon-borderGray space-y-1">
                        <p className="font-bold">{sellerPickupAddress.addressLine1}</p>
                        {sellerPickupAddress.addressLine2 && <p>{sellerPickupAddress.addressLine2}</p>}
                        {sellerPickupAddress.landmark && <p className="text-amazon-mutedText italic">Landmark: {sellerPickupAddress.landmark}</p>}
                        <p className="font-bold text-amazon-darkBlue">
                          {sellerPickupAddress.city}, {sellerPickupAddress.state} - {sellerPickupAddress.pincode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
            </div>

          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}