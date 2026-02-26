"use client";

import AdminNotificationBell from "@/components/notifications/AdminNotificationBell";
import { HiOutlineUserCircle, HiOutlineChevronDown, HiOutlineIdentification } from "react-icons/hi2";

export default function EmployeeNavbar() {
  return (
    <nav className="h-20 bg-white border-b-4 border-amazon-darkBlue flex items-center justify-between px-8 sticky top-0 z-30">
      
      {/* Page Title & Status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <h2 className="text-amazon-darkBlue font-black uppercase tracking-tighter italic text-xl">
            Staff <span className="text-amazon-orange">Panel</span>
          </h2>
        </div>
        
        {/* Employee Duty Status Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 border-2 border-blue-200 px-3 py-1 rounded-lg">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
            On Duty
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Shift Info - Useful for Employees */}
        <div className="hidden lg:flex flex-col items-end border-r-2 border-amazon-borderGray pr-4">
          <p className="text-[9px] font-black text-amazon-mutedText uppercase tracking-widest leading-none">Shift System</p>
          <p className="text-[11px] font-bold text-amazon-darkBlue uppercase">Fulfillment Ops</p>
        </div>

        {/* Notification Bell */}
        <div className="relative hover:scale-105 transition-transform cursor-pointer p-2 rounded-xl border-2 border-transparent hover:border-amazon-darkBlue hover:bg-amazon-orange hover:shadow-[3px_3px_0px_0px_rgba(19,25,33,1)]">
          <AdminNotificationBell />
        </div>

        {/* Profile Dropdown */}
        <button className="group flex items-center gap-3 px-3 py-1.5 rounded-xl border-2 border-amazon-darkBlue bg-white shadow-[4px_4px_0px_0px_rgba(19,25,33,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
          <div className="w-8 h-8 rounded-lg bg-amazon-darkBlue text-amazon-orange border-2 border-amazon-darkBlue flex items-center justify-center">
            <HiOutlineIdentification size={20} />
          </div>
          
          <div className="text-left hidden sm:block">
            <p className="text-[9px] font-black text-amazon-mutedText uppercase tracking-[0.15em] leading-tight">Employee ID: 441</p>
            <p className="text-xs font-bold text-amazon-darkBlue uppercase">Warehouse Staff</p>
          </div>
          
          <HiOutlineChevronDown size={14} className="text-amazon-darkBlue group-hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>
    </nav>
  );
}