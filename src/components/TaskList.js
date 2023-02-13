import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import axios from "axios";
import { URL } from "../App";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import loading from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setcompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [tasking, setTasking] = useState(tasks);

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);

      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input can't be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task added");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      toast.warning("Task deleted", { theme: "light" });

      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setcompletedTasks(cTask);
  }, [tasks]);

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === " ") {
      return toast.error("task field can't be empty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: "" });
      toast.info("Task Updated");
      setIsEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = { name: task.name, completed: true };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToIncomplete = async (task) => {
    const newFormData = { name: task.name, completed: false };
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onDragEnd = async (result) => {
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);

    // Update the order of the tasks on the server
    try {
      const updatedTasks = await Promise.all(
        items.map((task, index) => {
          return axios.put(`${URL}/api/tasks/${task._id}`, {
            placeNumber: index + 1,
            name: task.name,
            completed: task.completed,
          });
        })
      );
      toast.success("Task order updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  //.Return
  return (
    <div>
      <h2 className="title">TASKY</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />

      {isLoading && (
        <div className="--flex-center">
          <img src={loading} alt="loading" />
        </div>
      )}

      {tasks.length === 0 && !isLoading && (
        <p className="message">No tasks available, please create one</p>
      )}

      <div className="task-list-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <ul
                className="task-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, index) => {
                  return (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Task
                            task={task}
                            setToComplete={setToComplete}
                            setToIncomplete={setToIncomplete}
                            deleteTask={deleteTask}
                            getSingleTask={getSingleTask}
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {tasks.length > 0 && (
        <div className="--flex-between pb">
          <p>
            <b>Total Task: </b>
            {tasks.length}
          </p>
          <p>
            <b>Completed Task: </b>
            {completedTasks.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
