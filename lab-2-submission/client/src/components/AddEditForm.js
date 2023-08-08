import { useState, useEffect } from "react";

const AddEditForm = ({ setShowForm, clearID, employeeID, onDBUpdated }) => {
  const [employee, setEmployee] = useState(null);
  const [mode, setMode] = useState("create");
  const [notFound, setNotFound] = useState();

  const findRecord = async () => {
    try {
      const response = await fetch(`/employees/${employeeID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      const data = await response.json();
      setEmployee(data[0]);
      console.log(data[0]);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    if (employeeID) {
      findRecord();
    } else {
      setNotFound = true;
    }
  }, [employeeID]);

  const [data, setData] = useState({
    id: employeeID,
    name: "",
    title: "",
    avatar: "",
  });

  useEffect(() => {
    if (employee) {
      setData({
        id: employee.id,
        name: employee.name,
        title: employee.title,
        avatar: employee.avatar,
      });
      setMode("edit");
    } else {
      setNotFound(true);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(data);
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

      alert(
        `Employee ${mode === "create" ? mode + "d" : mode + "ed"} successfully`
      );
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
        <h3>{mode} employee</h3>
        <button onClick={() => handleClose()}>X</button>
        {notFound && (
          <p className="error">
            Employee not found. Enter information to create new employee.
          </p>
        )}
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
