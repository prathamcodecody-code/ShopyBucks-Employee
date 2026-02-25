"use client";

import EmployeeLayout from "@/components/EmployeeLayout";

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <h1 className="text-2xl font-bold mb-4">
        Employee Dashboard
      </h1>

      <p className="text-gray-600">
        You are logged in as an employee.
      </p>
    </EmployeeLayout>
  );
}