import React, { useRef } from "react";
import { FiEdit } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";

const Task = ({
  task,
  deleteTask,
  getSingleTask,
  setToComplete,
  setToIncomplete,
  index,
}) => {
  const checkbox = useRef();

  const handleClick = () => {
    if (checkbox.current.checked) {
      setToComplete(task);
    } else {
      setToIncomplete(task);
    }
  };

  return (
    <div className="task">
      {/* <label htmlFor="checkbox">Checkbox</label> */}
      <div className="task-with-checkbox">
        <input
          type="checkbox"
          className="checkbox-round"
          ref={checkbox}
          checked={task.completed ? true : false}
          onChange={handleClick}
        />
        &nbsp;&nbsp;
        <p
          className={task.completed ? "completed" : ""}
          onClick={() => getSingleTask(task)}
        >
          {task.name}
        </p>
      </div>
      <div className="task-icons">
        <FiEdit color="orange" onClick={() => getSingleTask(task)} />
        <TiDeleteOutline
          className="delete-task"
          onClick={(id) => deleteTask(task._id)}
          color="darkred"
        />
      </div>
    </div>
  );
};

export default Task;
