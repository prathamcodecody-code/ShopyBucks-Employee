"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  HiOutlineHome, 
  HiOutlineUserGroup,
  HiOutlineCube
} from "react-icons/hi2";
import {  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";
import { Menu, X, Store } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: HiOutlineHome },
    { name: "Orders", href: "/orders", icon: HiOutlineClipboardList },
    { name: "Inventory", href: "/inventory", icon: HiOutlineCube },
    { name: "Staff Profile", href: "/profile", icon: HiOutlineUserGroup },
  ];

  const handleLogout = () => {
    // Clear your specific employee tokens
    localStorage.removeItem("employee_token");
    // Add any cookie clearing logic here if needed
    router.push("/login"); 
  };

  const LinkItem = (item: typeof menuItems[0]) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200
          border-2 mb-2
          ${
            isActive
              ? "bg-amazon-orange border-amazon-darkBlue text-amazon-darkBlue shadow-[4px_4px_0px_0px_rgba(19,25,33,1)] scale-[1.02]"
              : "text-amazon-mutedText border-transparent hover:bg-amazon-lightGray hover:text-amazon-darkBlue"
          }
        `}
      >
        <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
        <span className="tracking-tight">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-4 border-amazon-darkBlue flex items-center px-4 z-40">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-amazon-orange border-2 border-amazon-darkBlue rounded-lg shadow-[2px_2px_0px_0px_rgba(19,25,33,1)]"
        >
          <Menu size={24} className="text-amazon-darkBlue" />
        </button>
        <h1 className="ml-4 font-black text-amazon-darkBlue italic uppercase tracking-tighter">
          ShopyBucks <span className="text-amazon-orange text-xs not-italic">Staff</span>
        </h1>
      </div>

      {/* OVERLAY (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-amazon-darkBlue/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white border-r-4 border-amazon-darkBlue
          flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand Section */}
        <div className="p-6 border-b-2 border-amazon-borderGray shrink-0 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-4 md:hidden p-1 border-2 border-amazon-darkBlue rounded-md"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col">
            <div className="relative w-32 md:w-44">
              <img src="/shopybucks.jpg" alt="ShopyBucks Logo" className="w-full h-auto object-contain" />
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-black bg-amazon-darkBlue text-white px-2 py-1 rounded-md w-fit uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Staff Portal
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="mt-2">
            <p className="px-4 text-[10px] font-black text-amazon-mutedText uppercase tracking-[0.2em] mb-4">
              Main Operations
            </p>
            {menuItems.map((item) => LinkItem(item))}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-6 bg-amazon-lightGray border-t-2 border-amazon-borderGray shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-4 rounded-xl
              bg-white border-2 border-amazon-darkBlue text-amazon-darkBlue font-black uppercase tracking-tighter
              shadow-[4px_4px_0px_0px_rgba(177,39,4,1)]
              hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all
            "
          >
            <HiOutlineLogout size={20} strokeWidth={3} className="text-amazon-danger" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] bg-amazon-darkBlue/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amazon-darkBlue rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 w-full max-w-sm">
            <h3 className="text-2xl font-black mb-2 text-amazon-darkBlue uppercase italic tracking-tighter leading-tight">
              End Shift?
            </h3>
            <p className="text-amazon-mutedText font-medium mb-8">
              Make sure all pending orders are processed before logging out.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-amazon-danger text-white border-4 border-amazon-darkBlue rounded-xl font-black uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 bg-white text-amazon-darkBlue border-4 border-amazon-darkBlue rounded-xl font-black uppercase tracking-tighter hover:bg-amazon-lightGray transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}