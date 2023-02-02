import React from "react";

const TaskForm = ({
  createTask,
  name,
  handleInputChange,
  isEditing,
  updateTask,
}) => {
  return (
    <form className="searchBar" onSubmit={isEditing ? updateTask : createTask}>
      <input
        id="searchQueryInput"
        type="text"
        placeholder="Add a task"
        name="name"
        value={name}
        onChange={handleInputChange}
      />
      <button id="searchQuerySubmit" type="submit">
        {isEditing ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default TaskForm;
