import React, { useState } from "react";

function EmployeeCard({ employee, handleShowForm }) {
  const [showThis, setShowThis] = useState(true);

  const deleteRecord = async () => {
    try {
      await fetch(`/employees/${employee.id}`, {
        method: "DELETE",
      });
      setShowThis(false);
      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    showThis && (
      <div className="card">
        <button onClick={() => handleShowForm(employee.id)}>
          <img
            src={employee.avatar}
            alt="Avatar"
            width="240px"
            className="avatar"
          />
          <div className="container">
            <h4>{employee.name}</h4>
            <p>{employee.title}</p>
          </div>
        </button>
        <button onClick={deleteRecord} className="del-button">
          <svg
            style={{ color: "red" }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
              fill="red"
            ></path>{" "}
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              fill="red"
            ></path>{" "}
          </svg>
        </button>
      </div>
    )
  );
}

export default EmployeeCard;
