"use client";

import { 
  HiOutlineCheck, 
  HiOutlineXMark, 
  HiOutlineArrowPath,
  HiTruck
} from "react-icons/hi2";

export default function OrderTracking({ status }: { status: string }) {
  const STEPS = ["PENDING", "ACCEPTED", "PACKED", "SHIPPED", "DELIVERED"];

  const isCancelled = status === "CANCELLED";
  const isReturned = status === "RETURNED";
  const currentIndex = STEPS.indexOf(status);

  // Calculate truck and line position
  const progressPercent = currentIndex >= 0 
    ? (currentIndex / (STEPS.length - 1)) * 100 
    : 0;

  return (
    <div className="w-full py-12">
      <div className="relative max-w-4xl mx-auto px-10">
        
        {/* THE ROAD (Light Gray Background Line) */}
        <div className="absolute top-5 left-10 right-10 h-[3px] bg-amazon-borderGray -z-10 rounded-full" />

        {/* THE JOURNEY (Amazon Orange Progress Line) */}
        {!isCancelled && !isReturned && (
          <div 
            className="absolute top-5 left-10 h-[3px] bg-amazon-orange -z-10 transition-all duration-1000 ease-in-out rounded-full"
            style={{ width: `calc(${progressPercent}%)` }}
          />
        )}

        {/* MOVING TRUCK OVERLAY */}
        {!isCancelled && !isReturned && currentIndex >= 0 && (
          <div 
            className="absolute top-[-22px] transition-all duration-1000 ease-in-out z-30"
            style={{ 
                left: `calc(${progressPercent}% + 40px)`, 
                transform: 'translateX(-100%)' 
            }}
          >
            <div className="flex flex-col items-center">
                {/* Truck box with Amazon Orange and Navy Shadow */}
                <div className="bg-amazon-orange text-amazon-darkBlue p-2 rounded-lg shadow-lg shadow-amazon-orange/20 animate-bounce border border-amazon-orangeHover">
                    <HiTruck size={22} />
                </div>
                {/* Pointer triangle */}
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-amazon-orange" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = !isCancelled && !isReturned && currentIndex >= index;
            const isCurrent = !isCancelled && !isReturned && currentIndex === index;

            return (
              <div key={step} className="flex flex-col items-center relative">
                {/* STEP CIRCLE */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 z-20 ${
                    isCompleted
                      ? "border-amazon-success bg-amazon-success text-white shadow-sm"
                      : "border-amazon-borderGray bg-white text-amazon-mutedText"
                  } ${isCurrent ? "scale-110 ring-4 ring-amazon-orange/10 border-amazon-orange" : "scale-100"}`}
                >
                  {isCompleted ? (
                    <HiOutlineCheck size={20} strokeWidth={4} />
                  ) : (
                    <span className="text-sm font-black">{index + 1}</span>
                  )}
                </div>

                {/* STEP LABEL */}
                <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
                   <p className={`text-[11px] font-black uppercase tracking-tight ${
                     isCompleted ? "text-amazon-darkBlue" : "text-amazon-mutedText"
                   }`}>
                     {step}
                   </p>
                   {isCurrent && (
                     <span className="text-[9px] font-bold text-amazon-orange animate-pulse">CURRENT</span>
                   )}
                </div>
              </div>
            );
          })}

          {/* TERMINAL STATES (Cancelled / Returned) */}
          {(isCancelled || isReturned) && (
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg z-20 ${
                  isCancelled 
                    ? "bg-amazon-danger border-amazon-danger text-white" 
                    : "bg-amazon-orange border-amazon-orange text-amazon-darkBlue"
                }`}
              >
                {isCancelled ? <HiOutlineXMark size={20} /> : <HiOutlineArrowPath size={20} />}
              </div>
              <p className={`text-[11px] mt-3 font-black uppercase tracking-tight absolute -bottom-10 whitespace-nowrap ${
                isCancelled ? "text-amazon-danger" : "text-amazon-orange"
              }`}>
                {status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}