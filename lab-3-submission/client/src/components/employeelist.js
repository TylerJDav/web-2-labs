import React, { useEffect, useState } from "react";
import EmployeeCard from "./employeecard";
import BlankCard from "./BlankCard";

function EmployeeList({
  employees,
  onEmployeeDeleted,
  handleShowForm,
  editingEmployee,
  editedCardData,
}) {
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    if (employees) {
      setEmployeeList(employees);
    }
  }, [employees]);

  const handleDeleteSuccess = async (id) => {
    try {
      const response = await fetch(`/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      const updatedEmployees = employeeList.filter(
        (employee) => employee.id !== id
      );
      setEmployeeList(updatedEmployees);
      onEmployeeDeleted();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="card-container">
      {employeeList.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onDeleteSuccess={() => handleDeleteSuccess(employee.id)}
          handleShowForm={handleShowForm}
          isEditing={employee.id === editingEmployee}
          editedData={editedCardData[employee.id]}
        />
      ))}
      <BlankCard handleShowForm={() => handleShowForm(null)} />
    </div>
  );
}

export default EmployeeList;
