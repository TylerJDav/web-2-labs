import React, { useState, useEffect } from "react";
import "./App.css";
import EmployeeList from "./components/employeelist";
import AddEditForm from "./components/AddEditForm";

function App() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [showSomeCards, setShowSomeCards] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [employees, setEmployees] = useState(null);
  const [idToEdit, setIdToEdit] = useState(null);
  const [nameToFind, setNameToFind] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editedCardData, setEditedCardData] = useState({});

  useEffect(() => {
    if (showAllCards) {
      fetchEmployees();
    } else if (showSomeCards) {
      findRecord();
    }
  }, [showInactive, showAllCards, showSomeCards]);

  const fetchEmployees = async () => {
    try {
      let endpoint = "/employees";
      if (showInactive) {
        endpoint = "/employees/all";
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
      setShowAllCards(true);
      setShowSomeCards(false);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const findRecord = async () => {
    try {
      let endpoint = `/employees/${nameToFind}`;
      if (showInactive) {
        endpoint = `/employees/all/${nameToFind}`;
      }
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      const data = await response.json();
      setEmployees(data);
      setShowSomeCards(true);
      setShowAllCards(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleFindAll = () => {
    fetchEmployees();
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
        <div className="toggle-container">
          <p>Show Inactive Employees</p>
          <label className="switch">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </header>
      <div className="body">
        <div className="card-container">
          {(showSomeCards || showAllCards) && (
            <EmployeeList
              employees={employees}
              onEmployeeDeleted={() => {
                setShowSomeCards(false);
                setShowAllCards(false);
                setIdToEdit(null);
              }}
              handleShowForm={handleShowForm}
              editingEmployee={idToEdit}
              editedCardData={editedCardData}
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
