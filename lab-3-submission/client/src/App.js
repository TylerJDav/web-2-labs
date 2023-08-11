import React, { useState } from "react";
import "./App.css";
import EmployeeList from "./components/employeelist";
import AddEditForm from "./components/AddEditForm";

function App() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [employees, setEmployees] = useState(null);
  const [idToEdit, setIdToEdit] = useState(null);
  const [nameToFind, setNameToFind] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editedCardData, setEditedCardData] = useState({});

  const findRecord = async () => {
    try {
      const response = await fetch(`/employees/${nameToFind}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      const data = await response.json();
      setEmployees(data);
      setShowAllCards(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleFindAll = async () => {
    try {
      const response = await fetch("/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
      setShowAllCards(false);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
    setNameToFind("");
  };

  const handleShowForm = (employeeId) => {
    setIdToEdit(employeeId);
    setShowForm(true);
  };

  const updateCardData = (employeeId, field, value) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === employeeId ? { ...employee, [field]: value } : employee
    );
    setEmployees(updatedEmployees);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="left-siders">
          <input
            type="text"
            placeholder="Search by name"
            value={nameToFind}
            onChange={(e) => setNameToFind(e.target.value)}
          />
          <button onClick={findRecord}>Find</button>
        </div>
        <div className="right-siders">
          <button onClick={handleFindAll}>Find All</button>
          <button onClick={() => handleShowForm(null)}>Add New</button>
        </div>
      </header>
      <div className="body">
        <div className="card-container">
          {employees && (
            <EmployeeList
              employees={employees}
              onEmployeeDeleted={() => {
                setShowAllCards(false);
                setIdToEdit(null);
              }}
              handleShowForm={handleShowForm}
              editingEmployee={idToEdit}
              editedCardData={editedCardData}
            />
          )}
          {showAllCards && (
            <EmployeeList
              onEmployeeDeleted={() => {
                setShowAllCards(false);
                setIdToEdit(null);
              }}
              handleShowForm={handleShowForm}
              editingEmployee={idToEdit}
            />
          )}
        </div>
        {showForm && (
          <div className="editor">
            <AddEditForm
              setShowForm={setShowForm}
              clearID={() => setIdToEdit(null)}
              employeeID={idToEdit}
              onDBUpdated={() => {
                setShowAllCards(false);
                setEmployees(null);
              }}
              updateCardData={updateCardData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
