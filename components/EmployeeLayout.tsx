"use client";

import EmployeeNavbar from "./Navbar";// This acts as your Employee/Seller navbar
import Sidebar from "./Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-amazon-lightGray text-amazon-text font-sans selection:bg-amazon-orange/30">
      {/* SIDEBAR - Fixed positioning is handled inside the component */}
      <Sidebar />

      {/* RIGHT SIDE CONTAINER - Takes up remaining space after sidebar */}
      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300 min-h-screen">
        
        {/* NAVBAR - Now correctly placed at the top of the content column */}
        <EmployeeNavbar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1">
          {/* mt-16 handles mobile header height. 
              md:mt-0 because the Navbar is part of the flex flow on desktop.
          */}
          <div className="p-4 md:p-8 mt-16 md:mt-0 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
