import React, { useState } from "react";
import "./App.css";
import EmployeeList from "./components/employeelist";
import AddEditForm from "./components/AddEditForm";

function App() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [idToFind, setIdToFind] = useState("");
  const [showForm, setShowForm] = useState(false);

  const deleteRecord = async () => {
    if (!idToDelete) return;

    try {
      await fetch(`/employees/${idToDelete}`, {
        method: "DELETE",
      });
      alert("Employee deleted successfully");
      setIdToDelete("");
      setShowAllCards(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleFindAll = () => {
    setShowAllCards(true);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="App">
      <div className="App">
        <header className="App-header">
          <div className="search-functions">
            <input
              type="text"
              placeholder="Employee ID to delete"
              value={idToDelete}
              onChange={(e) => setIdToDelete(e.target.value)}
            />
            <button onClick={deleteRecord}>Delete</button>
          </div>
          <button onClick={handleFindAll}>Find All</button>
        </header>
      </div>
      {showAllCards && (
        <EmployeeList onEmployeeDeleted={() => setShowAllCards(false)} />
      )}
      <div className="editor">
        <input
          type="text"
          placeholder="Employee ID to find"
          value={idToFind}
          onChange={(e) => setIdToFind(e.target.value)}
        />
        <button onClick={handleShowForm}>Find</button>
        {showForm && idToFind !== "" && (
          <AddEditForm
            setShowForm={setShowForm}
            clearID={() => setIdToFind("")}
            employeeID={idToFind}
            onDBUpdated={() => setShowAllCards(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
