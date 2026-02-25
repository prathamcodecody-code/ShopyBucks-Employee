"use client";

import Sidebar from "./Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-amazon-lightGray text-amazon-text font-sans selection:bg-amazon-orange/30">
      {/* Sidebar Component 
         Handles its own fixed positioning and mobile toggle state
      */}
      <Sidebar />
      
      {/* Main Content Area 
         - md:pl-72: Adds padding on desktop to prevent the fixed sidebar from overlapping content
         - pt-16 md:pt-0: Adds top padding on mobile for the floating header
      */}
      <main className="flex-1 flex flex-col min-h-screen md:pl-72 transition-all duration-300">
        <div className="p-4 md:p-8 mt-16 md:mt-0 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}