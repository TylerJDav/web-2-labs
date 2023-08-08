import React, { useEffect, useState } from "react";
import EmployeeCard from "./employeecard";

function EmployeeList({ onEmployeeDeleted }) {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteSuccess = async (id) => {
    try {
      const response = await fetch(`/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      fetchEmployees();
      onEmployeeDeleted();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  console.log("Render - EmployeeList", employees);

  return (
    <div className="card-container">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onDeleteSuccess={() => handleDeleteSuccess(employee.id)}
        />
      ))}
    </div>
  );
}

export default EmployeeList;
