const BlankCard = ({ handleShowForm }) => {
  return (
    <div className="card">
      <button onClick={handleShowForm}>
        <svg
          style={{ color: "rgb(192, 192, 192)" }}
          xmlns="http://www.w3.org/2000/svg"
          width="240px"
          height="240px"
          fill="currentColor"
          class="bi bi-plus-square-fill"
          viewBox="0 0 16 16"
          className="avatar"
        >
          {" "}
          <path
            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"
            fill="#c0c0c0"
          ></path>{" "}
        </svg>
        <div className="container">
          <h4>Add New Employee</h4>
          <p>Click here to add a new employee</p>
        </div>
      </button>
    </div>
  );
};

export default BlankCard;
