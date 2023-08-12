import React, { useState, useEffect } from "react";

const AddEditForm = ({
  setShowForm,
  clearID,
  employeeID,
  onDBUpdated,
  initData,
  updateCardData,
}) => {
  const [data, setData] = useState(
    initData || {
      id: employeeID,
      name: "",
      title: "",
      avatar: "",
    }
  );

  const [mode, setMode] = useState(employeeID ? "edit" : "create");

  const findRecord = async () => {
    try {
      const response = await fetch(`/employees/${employeeID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      const data = await response.json();
      setData(data[0]);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    if (employeeID) {
      findRecord();
    }
  }, [employeeID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    updateCardData(employeeID, name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "edit") {
        console.log("Updating employee:", data);
        await fetch(`/employees/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      alert(`Employee ${mode === "create" ? "added" : "updated"} successfully`);
      clearID();
      setShowForm(false);
      onDBUpdated();
    } catch (error) {
      console.error("Error updating/adding employee:", error);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    clearID();
  };

  return (
    <div className="add-edit-form">
      <div className="form-title-container">
        <h3>{mode === "edit" ? "Edit" : "Add"} Employee</h3>
        <button onClick={handleClose} className="close">
          X
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Employee Name: </label>
        <input
          required
          maxLength={30}
          placeholder="Employee name"
          name="name"
          id="name"
          value={data.name}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="title">Employee Title: </label>
        <input
          required
          maxLength={60}
          placeholder="Employee Title"
          name="title"
          id="title"
          value={data.title}
          onChange={handleChange}
        />
        {mode === "edit" && (
          <sub>Type "inactive" to remove an employee from main view</sub>
        )}
        <br />
        <label htmlFor="avatar">Employee Avatar URL: </label>
        <input
          required
          placeholder="example.com/example.jpg"
          name="avatar"
          id="avatar"
          value={data.avatar}
          onChange={handleChange}
        />
        <br />
        <input className={mode} type="submit" />
      </form>
    </div>
  );
};

export default AddEditForm;
